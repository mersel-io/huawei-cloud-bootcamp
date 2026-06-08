using Portfolify.Domain.Common;
using Portfolify.Domain.Enums;

namespace Portfolify.Domain.Entities;

public sealed class Skill : Entity, ITenantEntity
{
    public Guid ProfileId { get; private set; }
    public string Name { get; private set; } = null!;
    public SkillLevel Level { get; private set; }
    public string? Category { get; private set; }
    public int DisplayOrder { get; private set; }
    public string? IconUrl { get; private set; }

    public Guid TenantId { get; set; }

    public Profile Profile { get; private set; } = null!;

    private Skill() { }

    public static Skill Create(
        Guid profileId,
        string name,
        SkillLevel level,
        Guid tenantId,
        string? category = null,
        int displayOrder = 0,
        string? iconUrl = null)
    {
        if (string.IsNullOrWhiteSpace(name))
            throw new DomainException("Skill name cannot be empty.");

        return new Skill
        {
            Id = Guid.NewGuid(),
            ProfileId = profileId,
            Name = name.Trim(),
            Level = level,
            TenantId = tenantId,
            Category = category?.Trim(),
            DisplayOrder = displayOrder,
            IconUrl = iconUrl?.Trim()
        };
    }

    public void Update(SkillLevel level, string? category, int displayOrder, string? iconUrl)
    {
        Level = level;
        Category = category?.Trim();
        DisplayOrder = displayOrder;
        IconUrl = iconUrl?.Trim();
    }
}
