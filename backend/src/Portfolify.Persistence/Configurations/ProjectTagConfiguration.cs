using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;
using Portfolify.Domain.Entities;

namespace Portfolify.Persistence.Configurations;

public sealed class ProjectTagConfiguration : IEntityTypeConfiguration<ProjectTag>
{
    public void Configure(EntityTypeBuilder<ProjectTag> builder)
    {
        builder.HasKey(pt => pt.Id);

        builder.Property(pt => pt.ProjectId).IsRequired();
        builder.Property(pt => pt.TagId).IsRequired();

        builder.HasIndex(pt => new { pt.ProjectId, pt.TagId }).IsUnique();

        builder.HasOne(pt => pt.Tag)
            .WithMany()
            .HasForeignKey(pt => pt.TagId)
            .OnDelete(DeleteBehavior.Restrict);

        builder.Ignore(pt => pt.DomainEvents);
    }
}
