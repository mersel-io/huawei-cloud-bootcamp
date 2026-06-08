using Microsoft.Extensions.DependencyInjection;
using Portfolify.Domain.Interfaces;
using Portfolify.Infrastructure.Services;

namespace Portfolify.Infrastructure;

public static class DependencyInjection
{
    public static IServiceCollection AddInfrastructureServices(this IServiceCollection services)
    {
        services.AddSingleton<IDateTimeProvider, DateTimeProvider>();
        services.AddScoped<IDomainEventDispatcher, MediatRDomainEventDispatcher>();

        return services;
    }
}
