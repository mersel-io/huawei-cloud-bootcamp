using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;
using Portfolify.Domain.Entities;

namespace Portfolify.Persistence.Configurations;

public sealed class ProfileLinkConfiguration : IEntityTypeConfiguration<ProfileLink>
{
    public void Configure(EntityTypeBuilder<ProfileLink> builder)
    {
        builder.HasKey(l => l.Id);

        builder.Property(l => l.ProfileId).IsRequired();
        builder.Property(l => l.Label).IsRequired().HasMaxLength(200);
        builder.Property(l => l.Url).IsRequired().HasMaxLength(500);
        builder.Property(l => l.Icon).HasMaxLength(100);
        builder.Property(l => l.DisplayOrder).IsRequired();

        builder.HasIndex(l => new { l.ProfileId, l.DisplayOrder });

        builder.Ignore(l => l.DomainEvents);
    }
}
