using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;
using Portfolify.Domain.Entities;

namespace Portfolify.Persistence.Configurations;

public sealed class ProjectConfiguration : IEntityTypeConfiguration<Project>
{
    public void Configure(EntityTypeBuilder<Project> builder)
    {
        builder.HasKey(p => p.Id);

        builder.Property(p => p.ProfileId).IsRequired();
        builder.Property(p => p.Title).IsRequired().HasMaxLength(200);
        builder.Property(p => p.Description).HasMaxLength(5000);
        builder.Property(p => p.RepositoryUrl).HasMaxLength(500);
        builder.Property(p => p.LiveUrl).HasMaxLength(500);
        builder.Property(p => p.ImageUrl).HasMaxLength(500);
        builder.Property(p => p.Status).IsRequired().HasConversion<string>();
        builder.Property(p => p.DisplayOrder).IsRequired();
        builder.Property(p => p.Technologies).HasMaxLength(1000);
        builder.Property(p => p.TenantId).IsRequired();
        builder.Property(p => p.CreatedAtUtc).IsRequired();
        builder.Property(p => p.UpdatedAtUtc);

        builder.HasIndex(p => p.ProfileId);
        builder.HasIndex(p => p.TenantId);

        builder.HasMany(p => p.ProjectTags)
            .WithOne(pt => pt.Project)
            .HasForeignKey(pt => pt.ProjectId)
            .OnDelete(DeleteBehavior.Cascade);

        builder.Ignore(p => p.DomainEvents);
    }
}
