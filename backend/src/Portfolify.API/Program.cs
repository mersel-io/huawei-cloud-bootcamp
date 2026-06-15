using Portfolify.API.Conventions;
using Portfolify.API.Middleware;
using Portfolify.Application;
using Portfolify.Infrastructure;
using Portfolify.Persistence;
using Serilog;

Log.Logger = new LoggerConfiguration()
    .WriteTo.Console()
    .CreateBootstrapLogger();

try
{
    var builder = WebApplication.CreateBuilder(args);

    builder.Host.UseSerilog((context, configuration) =>
        configuration.ReadFrom.Configuration(context.Configuration));

    builder.Services.AddControllers(options =>
    {
        options.Conventions.Add(new KebabCaseRouteConvention());
    });
    builder.Services.AddEndpointsApiExplorer();
    builder.Services.AddSwaggerGen(c =>
    {
        c.SwaggerDoc("v1", new() { Title = "Portfolify API", Version = "v1" });
    });

    builder.Services.AddApplicationServices();
    builder.Services.AddInfrastructureServices();
    builder.Services.AddPersistenceServices(builder.Configuration);

    builder.Services.AddCors(options =>
    {
        options.AddDefaultPolicy(policy =>
        {
            policy.WithOrigins("http://localhost:3002")
                  .AllowAnyHeader()
                  .AllowAnyMethod();
        });
    });

    builder.Services.AddHealthChecks()
        .AddNpgSql(builder.Configuration.GetConnectionString("DefaultConnection")!);

    var app = builder.Build();

    if (app.Environment.IsDevelopment())
    {
        app.UseSwagger();
        app.UseSwaggerUI(c => c.SwaggerEndpoint("/swagger/v1/swagger.json", "Portfolify API v1"));
    }

    app.UseMiddleware<GlobalExceptionHandlerMiddleware>();

    app.UseHttpsRedirection();
    app.UseCors();
    app.UseAuthorization();
    app.MapControllers();
    app.MapHealthChecks("/health");

    app.Run();
}
catch (Exception ex)
{
    Log.Fatal(ex, "Application terminated unexpectedly");
}
finally
{
    Log.CloseAndFlush();
}
