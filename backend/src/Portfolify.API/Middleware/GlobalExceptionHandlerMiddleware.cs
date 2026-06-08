using System.Net;
using System.Text.Json;
using Portfolify.Application.Exceptions;

namespace Portfolify.API.Middleware;

public sealed class GlobalExceptionHandlerMiddleware
{
    private readonly RequestDelegate _next;
    private readonly ILogger<GlobalExceptionHandlerMiddleware> _logger;

    public GlobalExceptionHandlerMiddleware(RequestDelegate next, ILogger<GlobalExceptionHandlerMiddleware> logger)
    {
        _next = next;
        _logger = logger;
    }

    public async Task InvokeAsync(HttpContext httpContext)
    {
        try
        {
            await _next(httpContext);
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "An unhandled exception occurred: {Message}", ex.Message);
            await HandleExceptionAsync(httpContext, ex);
        }
    }

    private static async Task HandleExceptionAsync(HttpContext context, Exception exception)
    {
        context.Response.ContentType = "application/json";

        var (statusCode, response) = exception switch
        {
            ValidationException validationEx => (
                HttpStatusCode.BadRequest,
                new ErrorResponse("Validation Error", validationEx.Errors)),

            NotFoundException => (
                HttpStatusCode.NotFound,
                new ErrorResponse("Not Found", exception.Message)),

            ForbiddenException => (
                HttpStatusCode.Forbidden,
                new ErrorResponse("Forbidden", exception.Message)),

            ConflictException => (
                HttpStatusCode.Conflict,
                new ErrorResponse("Conflict", exception.Message)),

            Domain.Exceptions.DomainException => (
                HttpStatusCode.BadRequest,
                new ErrorResponse("Domain Error", exception.Message)),

            _ => (
                HttpStatusCode.InternalServerError,
                new ErrorResponse("Internal Server Error", "An unexpected error occurred."))
        };

        context.Response.StatusCode = (int)statusCode;

        var json = JsonSerializer.Serialize(response, new JsonSerializerOptions
        {
            PropertyNamingPolicy = JsonNamingPolicy.CamelCase
        });

        await context.Response.WriteAsync(json);
    }
}

public sealed record ErrorResponse(string Error, object Details);
