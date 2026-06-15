using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;
using Portfolify.Domain.Entities;
using Portfolify.Domain.ValueObjects;

namespace Portfolify.Persistence.Configurations;

public sealed class UserConfiguration : IEntityTypeConfiguration<User>
{
    public void Configure(EntityTypeBuilder<User> builder)
    {
        builder.HasKey(u => u.Id);

        builder.Property(u => u.FirstName)
            .IsRequired()
            .HasMaxLength(100);

        builder.Property(u => u.LastName)
            .IsRequired()
            .HasMaxLength(100);

        builder.OwnsOne(u => u.Email, email =>
        {
            email.Property(e => e.Value)
                .HasColumnName("Email")
                .IsRequired()
                .HasMaxLength(256);

            email.HasIndex(e => e.Value).IsUnique();
        });

        builder.Property(u => u.Bio).HasMaxLength(1000);
        builder.Property(u => u.AvatarUrl).HasMaxLength(500);
        builder.Property(u => u.Role).IsRequired().HasConversion<string>();
        builder.Property(u => u.GitHubUsername).HasMaxLength(100);
        builder.Property(u => u.LinkedInUrl).HasMaxLength(500);

        builder.Property(u => u.IsDeleted).HasDefaultValue(false);
        builder.Property(u => u.CreatedAtUtc).IsRequired();
        builder.Property(u => u.UpdatedAtUtc);

        builder.HasMany(u => u.Profiles)
            .WithOne(p => p.User)
            .HasForeignKey(p => p.UserId)
            .OnDelete(DeleteBehavior.Cascade);

        builder.Ignore(u => u.DomainEvents);
        builder.Ignore(u => u.SocialLinks);
    }
}
