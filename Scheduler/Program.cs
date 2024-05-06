using Scheduler;
using Serilog;
using Serilog.Core;

public class Program
{

    private static IConfigurationBuilder ConfigurationBuilder =>
        new ConfigurationBuilder()
            .AddJsonFile("appsettings.json");

    public static async Task Main()
    {
        Log.Logger = CreateLogger(ConfigurationBuilder.Build());
        
        try
        {
            await CreateWebHostBuilder().Build().RunAsync();
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
            .UseDefaultServiceProvider(z => { z.ValidateScopes = true; })
            .UseKestrel()
            .UseContentRoot(Directory.GetCurrentDirectory())
            .ConfigureAppConfiguration(
                (z, builder) =>
                {
                    foreach (var source in ConfigurationBuilder.Sources)
                    {
                        builder.Add(source);
                    }
                })
            .ConfigureLogging((_, z) => z.ClearProviders().AddSerilog(dispose: true))
            .UseStartup<Startup>();

    private static Logger CreateLogger(IConfiguration configuration)
    {
        var logger = new LoggerConfiguration().ReadFrom.Configuration(configuration);

        return logger.CreateLogger();
    }
}