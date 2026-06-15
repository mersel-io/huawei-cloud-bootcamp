using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;
using Portfolify.Domain.Entities;

namespace Portfolify.Persistence.Configurations;

public sealed class ProfileConfiguration : IEntityTypeConfiguration<Profile>
{
    public void Configure(EntityTypeBuilder<Profile> builder)
    {
        builder.HasKey(p => p.Id);

        builder.Property(p => p.UserId).IsRequired();
        builder.Property(p => p.Slug).IsRequired().HasMaxLength(100);
        builder.Property(p => p.Title).IsRequired().HasMaxLength(200);
        builder.Property(p => p.Subtitle).HasMaxLength(300);
        builder.Property(p => p.Bio).HasMaxLength(2000);
        builder.Property(p => p.Visibility).IsRequired().HasConversion<string>();
        builder.Property(p => p.Theme).HasMaxLength(50);
        builder.Property(p => p.IsPrimary).HasDefaultValue(false);
        builder.Property(p => p.CreatedAtUtc).IsRequired();
        builder.Property(p => p.UpdatedAtUtc);

        builder.HasIndex(p => p.Slug).IsUnique();
        builder.HasIndex(p => p.UserId);

        builder.HasMany(p => p.Links)
            .WithOne(l => l.Profile)
            .HasForeignKey(l => l.ProfileId)
            .OnDelete(DeleteBehavior.Cascade);

        builder.HasMany(p => p.Skills)
            .WithOne(s => s.Profile)
            .HasForeignKey(s => s.ProfileId)
            .OnDelete(DeleteBehavior.Cascade);

        builder.HasMany(p => p.Experiences)
            .WithOne(e => e.Profile)
            .HasForeignKey(e => e.ProfileId)
            .OnDelete(DeleteBehavior.Cascade);

        builder.HasMany(p => p.Education)
            .WithOne(e => e.Profile)
            .HasForeignKey(e => e.ProfileId)
            .OnDelete(DeleteBehavior.Cascade);

        builder.HasMany(p => p.Projects)
            .WithOne(pr => pr.Profile)
            .HasForeignKey(pr => pr.ProfileId)
            .OnDelete(DeleteBehavior.Cascade);

        builder.Ignore(p => p.DomainEvents);
    }
}
