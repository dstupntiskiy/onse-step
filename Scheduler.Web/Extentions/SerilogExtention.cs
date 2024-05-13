using Serilog;
using Serilog.Core;

namespace Scheduler.Extentions;

public static class SerilogExtention
{
    public static IWebHostBuilder UseSerilogLogger(this IWebHostBuilder builder)
    {
        return builder
            .ConfigureLogging(cfg => cfg.ClearProviders());
    }
}