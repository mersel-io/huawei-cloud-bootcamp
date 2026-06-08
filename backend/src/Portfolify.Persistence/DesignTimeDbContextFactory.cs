using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Design;
using Portfolify.Domain.Interfaces;
using Portfolify.Persistence.Context;

namespace Portfolify.Persistence;

public sealed class DesignTimeDbContextFactory : IDesignTimeDbContextFactory<ApplicationDbContext>
{
    public ApplicationDbContext CreateDbContext(string[] args)
    {
        var optionsBuilder = new DbContextOptionsBuilder<ApplicationDbContext>();
        optionsBuilder.UseNpgsql("Host=localhost;Port=5432;Database=portfolify;Username=postgres;Password=postgres");
        optionsBuilder.UseSnakeCaseNamingConvention();

        var dateTimeProvider = new FakeDateTimeProvider();
        var domainEventDispatcher = new FakeDomainEventDispatcher();

        return new ApplicationDbContext(
            optionsBuilder.Options,
            new Interceptors.AuditableEntityInterceptor(),
            domainEventDispatcher);
    }

    private sealed class FakeDateTimeProvider : IDateTimeProvider
    {
        public DateTime UtcNow => DateTime.UtcNow;
    }

    private sealed class FakeDomainEventDispatcher : IDomainEventDispatcher
    {
        public Task DispatchAsync(IEnumerable<Domain.Common.DomainEvent> domainEvents, CancellationToken cancellationToken = default)
            => Task.CompletedTask;
    }
}
