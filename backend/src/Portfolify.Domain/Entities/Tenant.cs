using Portfolify.Domain.Common;

namespace Portfolify.Domain.Entities;

public sealed class Tenant : AggregateRoot, IAuditableEntity
{
    public string Name { get; private set; } = null!;
    public string Slug { get; private set; } = null!;
    public string? Domain { get; private set; }
    public bool IsActive { get; private set; } = true;

    DateTime IAuditableEntity.CreatedAtUtc { get; set; }
    DateTime? IAuditableEntity.UpdatedAtUtc { get; set; }

    private readonly List<User> _users = [];
    public IReadOnlyCollection<User> Users => _users.AsReadOnly();

    private Tenant() { }

    public static Tenant Create(string name, string slug, string? domain = null)
    {
        if (string.IsNullOrWhiteSpace(name))
            throw new DomainException("Tenant name cannot be empty.");
        if (string.IsNullOrWhiteSpace(slug))
            throw new DomainException("Tenant slug cannot be empty.");

        return new Tenant
        {
            Id = Guid.NewGuid(),
            Name = name.Trim(),
            Slug = slug.Trim().ToLowerInvariant(),
            Domain = domain?.Trim().ToLowerInvariant(),
            CreatedAtUtc = DateTime.UtcNow
        };
    }

    public void Deactivate() => IsActive = false;

    public void Activate() => IsActive = true;

    public void Update(string name, string? domain)
    {
        Name = string.IsNullOrWhiteSpace(name) ? Name : name.Trim();
        Domain = domain?.Trim().ToLowerInvariant();
    }
}
