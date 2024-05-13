using System.Net;
using System.Net.Mime;
using Microsoft.AspNetCore.Mvc.Formatters;
using Newtonsoft.Json;

namespace Scheduler.Middleware;

public class ExceptionHanlingMiddleware
{
    private readonly ILogger logger;
    private readonly RequestDelegate next;

    public ExceptionHanlingMiddleware(ILogger logger, RequestDelegate next)
    {
        this.logger = logger;
        this.next = next;
    }

    public async Task InvokeAsync(HttpContext httpContext)
    {
        try
        {
            await this.next(httpContext);
        }
        catch (Exception ex)
        {
            this.logger.LogError(ex, "Request completed with error");
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