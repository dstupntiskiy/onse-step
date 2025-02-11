using Scheduler;
using Scheduler.Infrastructure.Data;
using Serilog;
using Serilog.Core;

public class Program
{

    private static IConfigurationBuilder ConfigurationBuilder =>
        new ConfigurationBuilder()
            .AddJsonFile("appsettings.json")
            .AddEnvironmentVariables();

    public static async Task Main()
    {
        Log.Logger = CreateLogger(ConfigurationBuilder.Build());
        
        try
        {
            var host = CreateWebHostBuilder().Build();

            using (var scope = host.Services.CreateScope())
            {
                var dbInitializer = scope.ServiceProvider.GetRequiredService<DatabaseInitializer>();
                dbInitializer.Initialize();
            }
            await host.RunAsync();
        }
        catch (Exception ex)
        {
            Log.Fatal(ex, "Host terminated unexpectedly");
        }
        finally
        {
            Log.CloseAndFlush();
        }
    }

    public static IWebHostBuilder CreateWebHostBuilder() =>
        new WebHostBuilder()
            .ConfigureLogging((_, z) => z.ClearProviders().AddSerilog(dispose: true))
            .UseDefaultServiceProvider(z => { z.ValidateScopes = true; })
            .UseKestrel()
            .ConfigureAppConfiguration(
                (z, builder) =>
                {
                    foreach (var source in ConfigurationBuilder.Sources)
                    {
                        builder.Add(source);
                    }
                })
            .UseStartup<Startup>()
            .UseUrls("http://0.0.0.0:5000");

    private static Logger CreateLogger(IConfiguration configuration)
    {
        var logger = new LoggerConfiguration().ReadFrom.Configuration(configuration);

        return logger.CreateLogger();
    }
}