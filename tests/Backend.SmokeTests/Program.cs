using System.Net;
using System.Text.Json;
using Microsoft.AspNetCore.Hosting;
using Microsoft.AspNetCore.Hosting.Server;
using Microsoft.AspNetCore.Hosting.Server.Features;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Infrastructure;
using Microsoft.EntityFrameworkCore.Migrations;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;
using Scheduler;
using Scheduler.Infrastructure.Data;
using Scheduler.Extentions;
using Scheduler.Infrastructure.Extentions;

// Deliberately uses an unreachable database and never invokes Program.Main or Migrate.
var configuration = new ConfigurationBuilder().AddInMemoryCollection(new Dictionary<string, string?>
{
    ["ConnectionStrings:DefaultConnection"] = "Host=127.0.0.1;Port=1;Database=smoke;Username=smoke;Password=smoke;Timeout=1",
    ["Auth:Issuer"] = "smoke",
    ["Auth:Audience"] = "smoke",
    ["Auth:Secret"] = "smoke-test-key-only-32-characters-minimum"
}).Build();

using (var context = new OneStepContext(new DbContextOptions<OneStepContext>(), configuration))
{
    if (context.Database.HasPendingModelChanges())
        throw new Exception("EF model differs from the migration snapshot; EF 9 startup migration would fail.");
    var sql = context.GetService<IMigrator>().GenerateScript(options: MigrationsSqlGenerationOptions.Idempotent);
    if (string.IsNullOrWhiteSpace(sql)) throw new Exception("Migration SQL was not generated.");
    Console.WriteLine("PASS: EF model matches snapshot; PostgreSQL migration SQL generated offline.");
}

// Disable only NHibernate's database keyword discovery to construct mappings offline.
using var factory = NHibernateDependencyInjection.CreateConfiguration(configuration.GetConnectionString("DefaultConnection")!)
    .ExposeConfiguration(cfg => cfg.SetProperty("hbm2ddl.keywords", "none"))
    .BuildSessionFactory();
// Exercise production registrations and middleware without Main's database initializer.
using var host = new WebHostBuilder()
    .UseSetting(WebHostDefaults.ApplicationKey, typeof(Startup).Assembly.FullName)
    .UseKestrel()
    .UseConfiguration(configuration)
    .ConfigureAppConfiguration(builder => builder.AddConfiguration(configuration))
    .ConfigureServices(services =>
    {
        services.AddDbContext<OneStepContext>(options => options.UseNpgsql(configuration.GetConnectionString("DefaultConnection")))
            .AddSingleton(factory)
            .AddScoped(_ => factory.OpenSession())
            .AddWebApi()
            .AddRepositories()
            .ConfigureAuth(configuration);
        services.AddControllers().AddApplicationPart(typeof(Startup).Assembly);
    })
    .Configure(app => new Startup(configuration, app.ApplicationServices.GetRequiredService<IWebHostEnvironment>()).Configure(app))
    .UseUrls("http://127.0.0.1:0")
    .Build();
await host.StartAsync();
try
{
    var address = host.Services.GetRequiredService<IServer>().Features.Get<IServerAddressesFeature>()!.Addresses.Single();
    using var client = new HttpClient { BaseAddress = new Uri(address) };
    using var swagger = await client.GetAsync("/swagger/v1/swagger.json");
    swagger.EnsureSuccessStatusCode();
    using var document = JsonDocument.Parse(await swagger.Content.ReadAsStringAsync());
    if (!document.RootElement.GetProperty("paths").EnumerateObject().Any())
        throw new Exception("No API routes in OpenAPI document.");
    Console.WriteLine("PASS: NHibernate initialization and API/OpenAPI pipeline.");
    using var protectedResponse = await client.GetAsync("/api/Group/GetAll");
    if (protectedResponse.StatusCode != HttpStatusCode.Unauthorized)
        throw new Exception($"Protected route returned {protectedResponse.StatusCode}, expected 401.");
    Console.WriteLine("PASS: JWT authentication rejects unauthenticated requests.");
}
finally
{
    await host.StopAsync();
}
