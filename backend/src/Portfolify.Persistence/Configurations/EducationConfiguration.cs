using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;
using Portfolify.Domain.Entities;

namespace Portfolify.Persistence.Configurations;

public sealed class EducationConfiguration : IEntityTypeConfiguration<Education>
{
    public void Configure(EntityTypeBuilder<Education> builder)
    {
        builder.HasKey(e => e.Id);

        builder.Property(e => e.ProfileId).IsRequired();
        builder.Property(e => e.Institution).IsRequired().HasMaxLength(200);
        builder.Property(e => e.Degree).IsRequired().HasMaxLength(200);
        builder.Property(e => e.FieldOfStudy).HasMaxLength(200);
        builder.Property(e => e.Description).HasMaxLength(3000);
        builder.Property(e => e.Grade).HasMaxLength(50);
        builder.Property(e => e.StartDate).IsRequired();
        builder.Property(e => e.EndDate);
        builder.Property(e => e.IsCurrent).HasDefaultValue(false);
        builder.Property(e => e.LogoUrl).HasMaxLength(500);
        builder.Property(e => e.DisplayOrder).IsRequired();
        builder.Property(e => e.CreatedAtUtc).IsRequired();
        builder.Property(e => e.UpdatedAtUtc);

        builder.HasIndex(e => e.ProfileId);

        builder.Ignore(e => e.DomainEvents);
    }
}
