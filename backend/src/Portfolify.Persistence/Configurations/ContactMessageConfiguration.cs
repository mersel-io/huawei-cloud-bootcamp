using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;
using Portfolify.Domain.Entities;

namespace Portfolify.Persistence.Configurations;

public sealed class ContactMessageConfiguration : IEntityTypeConfiguration<ContactMessage>
{
    public void Configure(EntityTypeBuilder<ContactMessage> builder)
    {
        builder.HasKey(c => c.Id);

        builder.Property(c => c.ProfileId).IsRequired();
        builder.Property(c => c.SenderName).IsRequired().HasMaxLength(200);
        builder.Property(c => c.SenderEmail).IsRequired().HasMaxLength(256);
        builder.Property(c => c.Subject).IsRequired().HasMaxLength(500);
        builder.Property(c => c.Message).IsRequired().HasMaxLength(5000);
        builder.Property(c => c.Status).IsRequired().HasConversion<string>();
        builder.Property(c => c.SenderIpAddress).HasMaxLength(50);
        builder.Property(c => c.ReadAtUtc);
        builder.Property(c => c.RepliedAtUtc);
        builder.Property(c => c.TenantId).IsRequired();
        builder.Property(c => c.CreatedAtUtc).IsRequired();
        builder.Property(c => c.UpdatedAtUtc);

        builder.HasIndex(c => c.ProfileId);
        builder.HasIndex(c => c.TenantId);
        builder.HasIndex(c => c.Status);

        builder.Ignore(c => c.DomainEvents);
    }
}
