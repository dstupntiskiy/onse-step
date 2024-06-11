using System.Net;
using System.Net.Mime;
using Newtonsoft.Json;

namespace Scheduler.Middleware;

public class ExceptionHanlingMiddleware(RequestDelegate next, ILogger<ExceptionHanlingMiddleware> logger)
{
    private readonly ILogger logger = logger;

    public async Task InvokeAsync(HttpContext httpContext)
    {
        try
        {
            await next(httpContext);
        }
        catch (Exception ex)
        {
            this.logger.LogError(ex, ex.Message);
            await this.HandleExceptionAsync(httpContext, ex);
        }
    }
    
    private Task HandleExceptionAsync(HttpContext context, Exception exception)
    {
        context.Response.ContentType = MediaTypeNames.Application.Json;
        context.Response.StatusCode = (int)HttpStatusCode.InternalServerError;
        return context.Response.WriteAsync(JsonConvert.SerializeObject(exception.GetBaseException().Message));
    }
}