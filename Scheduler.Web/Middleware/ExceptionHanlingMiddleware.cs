using System.Net;
using System.Net.Mime;
using Microsoft.AspNetCore.Mvc.Formatters;
using Newtonsoft.Json;

namespace Scheduler.Middleware;

public class ExceptionHanlingMiddleware
{
    private readonly RequestDelegate next;

    public ExceptionHanlingMiddleware( RequestDelegate next)
    {
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