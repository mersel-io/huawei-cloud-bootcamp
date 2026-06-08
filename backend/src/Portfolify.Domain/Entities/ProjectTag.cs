using Portfolify.Domain.Common;
using Portfolify.Domain.Enums;

namespace Portfolify.Domain.Entities;

public sealed class ProjectTag : Entity
{
    public Guid ProjectId { get; private set; }
    public Guid TagId { get; private set; }

    public Project Project { get; private set; } = null!;
    public Tag Tag { get; private set; } = null!;

    private ProjectTag() { }

    public static ProjectTag Create(Guid projectId, Guid tagId)
    {
        return new ProjectTag
        {
            Id = Guid.NewGuid(),
            ProjectId = projectId,
            TagId = tagId
        };
    }
}
