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

        builder.HasIndex(t => t.Name).IsUnique();

        builder.Ignore(t => t.DomainEvents);
    }
}
