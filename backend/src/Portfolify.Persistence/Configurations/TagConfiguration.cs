using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;
using Portfolify.Domain.Entities;

namespace Portfolify.Persistence.Configurations;

public sealed class TagConfiguration : IEntityTypeConfiguration<Tag>
{
    public void Configure(EntityTypeBuilder<Tag> builder)
    {
        builder.HasKey(t => t.Id);

        builder.Property(t => t.Name).IsRequired().HasMaxLength(100);
        builder.Property(t => t.Color).HasMaxLength(20);
        builder.Property(t => t.TenantId).IsRequired();

        builder.HasIndex(t => t.TenantId);
        builder.HasIndex(t => new { t.TenantId, t.Name }).IsUnique();

        builder.Ignore(t => t.DomainEvents);
    }
}
