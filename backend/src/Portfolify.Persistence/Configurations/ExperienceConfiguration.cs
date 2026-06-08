using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;
using Portfolify.Domain.Entities;

namespace Portfolify.Persistence.Configurations;

public sealed class ExperienceConfiguration : IEntityTypeConfiguration<Experience>
{
    public void Configure(EntityTypeBuilder<Experience> builder)
    {
        builder.HasKey(e => e.Id);

        builder.Property(e => e.ProfileId).IsRequired();
        builder.Property(e => e.Company).IsRequired().HasMaxLength(200);
        builder.Property(e => e.Position).IsRequired().HasMaxLength(200);
        builder.Property(e => e.Description).HasMaxLength(3000);
        builder.Property(e => e.Location).HasMaxLength(200);
        builder.Property(e => e.StartDate).IsRequired();
        builder.Property(e => e.EndDate);
        builder.Property(e => e.IsCurrent).HasDefaultValue(false);
        builder.Property(e => e.CompanyLogoUrl).HasMaxLength(500);
        builder.Property(e => e.CompanyUrl).HasMaxLength(500);
        builder.Property(e => e.DisplayOrder).IsRequired();
        builder.Property(e => e.TenantId).IsRequired();
        builder.Property(e => e.CreatedAtUtc).IsRequired();
        builder.Property(e => e.UpdatedAtUtc);

        builder.HasIndex(e => e.ProfileId);
        builder.HasIndex(e => e.TenantId);

        builder.Ignore(e => e.DomainEvents);
    }
}
