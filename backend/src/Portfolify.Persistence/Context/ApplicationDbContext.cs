using Microsoft.EntityFrameworkCore;
using Portfolify.Application.Interfaces;
using Portfolify.Domain.Common;
using Portfolify.Domain.Entities;
using Portfolify.Domain.Interfaces;
using Portfolify.Persistence.Interceptors;

namespace Portfolify.Persistence.Context;

public sealed class ApplicationDbContext : DbContext, IApplicationDbContext, IUnitOfWork
{
    private readonly AuditableEntityInterceptor _auditableEntityInterceptor;
    private readonly IDomainEventDispatcher _domainEventDispatcher;

    public ApplicationDbContext(
        DbContextOptions<ApplicationDbContext> options,
        AuditableEntityInterceptor auditableEntityInterceptor,
        IDomainEventDispatcher domainEventDispatcher) : base(options)
    {
        _auditableEntityInterceptor = auditableEntityInterceptor;
        _domainEventDispatcher = domainEventDispatcher;
    }

    public DbSet<User> UsersSet { get; set; } = null!;
    public DbSet<Profile> ProfilesSet { get; set; } = null!;
    public DbSet<ProfileLink> ProfileLinksSet { get; set; } = null!;
    public DbSet<Tenant> TenantsSet { get; set; } = null!;
    public DbSet<Project> ProjectsSet { get; set; } = null!;
    public DbSet<Skill> SkillsSet { get; set; } = null!;
    public DbSet<Experience> ExperiencesSet { get; set; } = null!;
    public DbSet<Education> EducationsSet { get; set; } = null!;
    public DbSet<Tag> TagsSet { get; set; } = null!;
    public DbSet<ProjectTag> ProjectTagsSet { get; set; } = null!;
    public DbSet<ContactMessage> ContactMessagesSet { get; set; } = null!;

    public IQueryable<User> Users => UsersSet;
    public IQueryable<Profile> Profiles => ProfilesSet;
    public IQueryable<ProfileLink> ProfileLinks => ProfileLinksSet;
    public IQueryable<Tenant> Tenants => TenantsSet;
    public IQueryable<Project> Projects => ProjectsSet;
    public IQueryable<Skill> Skills => SkillsSet;
    public IQueryable<Experience> Experiences => ExperiencesSet;
    public IQueryable<Education> Educations => EducationsSet;
    public IQueryable<Tag> Tags => TagsSet;
    public IQueryable<ProjectTag> ProjectTags => ProjectTagsSet;
    public IQueryable<ContactMessage> ContactMessages => ContactMessagesSet;

    public async Task<TEntity?> FindAsync<TEntity>(Guid id, CancellationToken cancellationToken = default) where TEntity : class
        => await Set<TEntity>().FindAsync([id], cancellationToken);

    public void Add<TEntity>(TEntity entity) where TEntity : class
        => Set<TEntity>().Add(entity);

    public void Remove<TEntity>(TEntity entity) where TEntity : class
        => Set<TEntity>().Remove(entity);

    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        modelBuilder.ApplyConfigurationsFromAssembly(typeof(ApplicationDbContext).Assembly);

        foreach (var entity in modelBuilder.Model.GetEntityTypes())
        {
            var tableName = entity.GetTableName();
            if (tableName is not null && tableName.EndsWith("_set"))
                entity.SetTableName(tableName[..^4]);
        }

        base.OnModelCreating(modelBuilder);
    }

    protected override void OnConfiguring(DbContextOptionsBuilder optionsBuilder)
    {
        optionsBuilder.UseSnakeCaseNamingConvention();
        optionsBuilder.AddInterceptors(_auditableEntityInterceptor);
        base.OnConfiguring(optionsBuilder);
    }

    public override async Task<int> SaveChangesAsync(CancellationToken cancellationToken = default)
    {
        var entities = ChangeTracker
            .Entries<Entity>()
            .Where(e => e.Entity.DomainEvents.Count != 0)
            .Select(e => e.Entity)
            .ToList();

        var domainEvents = entities
            .SelectMany(e => e.DomainEvents)
            .ToList();

        entities.ForEach(e => e.ClearDomainEvents());

        await _domainEventDispatcher.DispatchAsync(domainEvents, cancellationToken);

        return await base.SaveChangesAsync(cancellationToken);
    }

    public async Task BeginTransactionAsync(CancellationToken cancellationToken = default)
    {
        if (Database.CurrentTransaction is null)
            await Database.BeginTransactionAsync(cancellationToken);
    }

    public async Task CommitTransactionAsync(CancellationToken cancellationToken = default)
    {
        if (Database.CurrentTransaction is not null)
            await Database.CurrentTransaction.CommitAsync(cancellationToken);
    }

    public async Task RollbackTransactionAsync(CancellationToken cancellationToken = default)
    {
        if (Database.CurrentTransaction is not null)
            await Database.CurrentTransaction.RollbackAsync(cancellationToken);
    }
}
