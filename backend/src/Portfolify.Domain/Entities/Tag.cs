using Portfolify.Domain.Common;

namespace Portfolify.Domain.Entities;

public sealed class Tag : Entity, ITenantEntity
{
    public string Name { get; private set; } = null!;
    public string? Color { get; private set; }

    public Guid TenantId { get; set; }

    private Tag() { }

    public static Tag Create(string name, Guid tenantId, string? color = null)
    {
        if (string.IsNullOrWhiteSpace(name))
            throw new DomainException("Tag name cannot be empty.");

        return new Tag
        {
            Id = Guid.NewGuid(),
            Name = name.Trim().ToLowerInvariant(),
            TenantId = tenantId,
            Color = color?.Trim()
        };
    }

    public void Update(string name, string? color)
    {
        Name = string.IsNullOrWhiteSpace(name) ? Name : name.Trim().ToLowerInvariant();
        Color = color?.Trim();
    }
}
