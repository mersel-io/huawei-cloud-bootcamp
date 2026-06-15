using Portfolify.Domain.Entities;

namespace Portfolify.Application.Interfaces;

public interface IApplicationDbContext
{
    IQueryable<User> Users { get; }
    IQueryable<Profile> Profiles { get; }
    IQueryable<ProfileLink> ProfileLinks { get; }
    IQueryable<Project> Projects { get; }
    IQueryable<Skill> Skills { get; }
    IQueryable<Experience> Experiences { get; }
    IQueryable<Education> Educations { get; }
    IQueryable<Tag> Tags { get; }
    IQueryable<ProjectTag> ProjectTags { get; }
    IQueryable<ContactMessage> ContactMessages { get; }

    Task<int> SaveChangesAsync(CancellationToken cancellationToken = default);
    Task<TEntity?> FindAsync<TEntity>(Guid id, CancellationToken cancellationToken = default) where TEntity : class;
    void Add<TEntity>(TEntity entity) where TEntity : class;
    void Remove<TEntity>(TEntity entity) where TEntity : class;
}
