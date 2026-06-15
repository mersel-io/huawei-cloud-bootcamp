using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;
using Portfolify.Domain.Entities;

namespace Portfolify.Persistence.Configurations;

public sealed class SkillConfiguration : IEntityTypeConfiguration<Skill>
{
    public void Configure(EntityTypeBuilder<Skill> builder)
    {
        builder.HasKey(s => s.Id);

        builder.Property(s => s.ProfileId).IsRequired();
        builder.Property(s => s.Name).IsRequired().HasMaxLength(100);
        builder.Property(s => s.Level).IsRequired().HasConversion<string>();
        builder.Property(s => s.Category).HasMaxLength(100);
        builder.Property(s => s.DisplayOrder).IsRequired();
        builder.Property(s => s.IconUrl).HasMaxLength(500);

        builder.HasIndex(s => s.ProfileId);

        builder.Ignore(s => s.DomainEvents);
    }
}
