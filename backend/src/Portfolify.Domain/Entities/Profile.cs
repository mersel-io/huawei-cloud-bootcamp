using Portfolify.Domain.Common;
using Portfolify.Domain.Enums;

namespace Portfolify.Domain.Entities;

public sealed class Profile : AggregateRoot, IAuditableEntity
{
    public Guid UserId { get; private set; }
    public string Slug { get; private set; } = null!;
    public string Title { get; private set; } = null!;
    public string? Subtitle { get; private set; }
    public string? Bio { get; private set; }
    public ProfileVisibility Visibility { get; private set; }
    public string? Theme { get; private set; }
    public bool IsPrimary { get; private set; }

    DateTime IAuditableEntity.CreatedAtUtc { get; set; }
    DateTime? IAuditableEntity.UpdatedAtUtc { get; set; }

    public User User { get; private set; } = null!;

    private readonly List<ProfileLink> _links = [];
    public IReadOnlyCollection<ProfileLink> Links => _links.AsReadOnly();

    private readonly List<Skill> _skills = [];
    public IReadOnlyCollection<Skill> Skills => _skills.AsReadOnly();

    private readonly List<Experience> _experiences = [];
    public IReadOnlyCollection<Experience> Experiences => _experiences.AsReadOnly();

    private readonly List<Education> _education = [];
    public IReadOnlyCollection<Education> Education => _education.AsReadOnly();

    private readonly List<Project> _projects = [];
    public IReadOnlyCollection<Project> Projects => _projects.AsReadOnly();

    private Profile() { }

    public static Profile Create(
        Guid userId,
        string slug,
        string title,
        ProfileVisibility visibility = ProfileVisibility.Public,
        string? subtitle = null,
        string? bio = null)
    {
        if (string.IsNullOrWhiteSpace(slug))
            throw new DomainException("Profile slug cannot be empty.");
        if (string.IsNullOrWhiteSpace(title))
            throw new DomainException("Profile title cannot be empty.");

        if (!System.Text.RegularExpressions.Regex.IsMatch(
                slug,
                @"^[a-z0-9]+(?:-[a-z0-9]+)*$",
                System.Text.RegularExpressions.RegexOptions.None))
            throw new DomainException("Profile slug must be lowercase alphanumeric with hyphens.");

        return new Profile
        {
            Id = Guid.NewGuid(),
            UserId = userId,
            Slug = slug.Trim().ToLowerInvariant(),
            Title = title.Trim(),
            Subtitle = subtitle?.Trim(),
            Bio = bio?.Trim(),
            Visibility = visibility,
            CreatedAtUtc = DateTime.UtcNow
        };
    }

    public void Update(string title, string? subtitle, string? bio, ProfileVisibility visibility, string? theme)
    {
        Title = string.IsNullOrWhiteSpace(title) ? Title : title.Trim();
        Subtitle = subtitle?.Trim();
        Bio = bio?.Trim();
        Visibility = visibility;
        Theme = theme?.Trim();
    }

    public void AddLink(ProfileLink link) => _links.Add(link);

    public void RemoveLink(Guid linkId)
    {
        var link = _links.FirstOrDefault(l => l.Id == linkId);
        if (link is not null)
            _links.Remove(link);
    }

    public void AddSkill(Skill skill) => _skills.Add(skill);

    public void RemoveSkill(Guid skillId)
    {
        var skill = _skills.FirstOrDefault(s => s.Id == skillId);
        if (skill is not null)
            _skills.Remove(skill);
    }
}
