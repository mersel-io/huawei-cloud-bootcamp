using Portfolify.Domain.Common;
using Portfolify.Domain.Enums;

namespace Portfolify.Domain.Entities;

public sealed class Project : AggregateRoot, IAuditableEntity
{
    public Guid ProfileId { get; private set; }
    public string Title { get; private set; } = null!;
    public string? Description { get; private set; }
    public string? RepositoryUrl { get; private set; }
    public string? LiveUrl { get; private set; }
    public string? ImageUrl { get; private set; }
    public ProjectStatus Status { get; private set; }
    public int DisplayOrder { get; private set; }
    public string? Technologies { get; private set; }

    DateTime IAuditableEntity.CreatedAtUtc { get; set; }
    DateTime? IAuditableEntity.UpdatedAtUtc { get; set; }

    public Profile Profile { get; private set; } = null!;

    private readonly List<ProjectTag> _projectTags = [];
    public IReadOnlyCollection<ProjectTag> ProjectTags => _projectTags.AsReadOnly();

    private Project() { }

    public static Project Create(
        Guid profileId,
        string title,
        string? description = null,
        string? repositoryUrl = null,
        string? liveUrl = null,
        string? imageUrl = null,
        ProjectStatus status = ProjectStatus.Active,
        int displayOrder = 0,
        string? technologies = null)
    {
        if (string.IsNullOrWhiteSpace(title))
            throw new DomainException("Project title cannot be empty.");

        if (!string.IsNullOrWhiteSpace(repositoryUrl))
        {
            if (!Uri.TryCreate(repositoryUrl.Trim(), UriKind.Absolute, out var uri) ||
                (uri.Scheme != "https" && uri.Scheme != "http"))
                throw new DomainException("Repository URL must be a valid HTTP/HTTPS URL.");
        }

        if (!string.IsNullOrWhiteSpace(liveUrl))
        {
            if (!Uri.TryCreate(liveUrl.Trim(), UriKind.Absolute, out var uri) ||
                (uri.Scheme != "https" && uri.Scheme != "http"))
                throw new DomainException("Live URL must be a valid HTTP/HTTPS URL.");
        }

        return new Project
        {
            Id = Guid.NewGuid(),
            ProfileId = profileId,
            Title = title.Trim(),
            Description = description?.Trim(),
            RepositoryUrl = repositoryUrl?.Trim(),
            LiveUrl = liveUrl?.Trim(),
            ImageUrl = imageUrl?.Trim(),
            Status = status,
            DisplayOrder = displayOrder,
            Technologies = technologies?.Trim(),
            CreatedAtUtc = DateTime.UtcNow
        };
    }

    public void Update(
        string title,
        string? description,
        string? repositoryUrl,
        string? liveUrl,
        string? imageUrl,
        ProjectStatus status,
        int displayOrder,
        string? technologies)
    {
        Title = string.IsNullOrWhiteSpace(title) ? Title : title.Trim();
        Description = description?.Trim();
        RepositoryUrl = repositoryUrl?.Trim();
        LiveUrl = liveUrl?.Trim();
        ImageUrl = imageUrl?.Trim();
        Status = status;
        DisplayOrder = displayOrder;
        Technologies = technologies?.Trim();
    }

    public void AddTag(ProjectTag tag) => _projectTags.Add(tag);

    public void RemoveTag(Guid tagId)
    {
        var tag = _projectTags.FirstOrDefault(t => t.Id == tagId);
        if (tag is not null)
            _projectTags.Remove(tag);
    }
}
