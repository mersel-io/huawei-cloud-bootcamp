using Portfolify.Domain.Common;
using Portfolify.Domain.Enums;
using Portfolify.Domain.ValueObjects;

namespace Portfolify.Domain.Entities;

public sealed class User : AggregateRoot, IAuditableEntity, ISoftDeletableEntity, ITenantEntity
{
    public string FirstName { get; private set; } = null!;
    public string LastName { get; private set; } = null!;
    public Email Email { get; private set; } = null!;
    public string? Bio { get; private set; }
    public string? AvatarUrl { get; private set; }
    public UserRole Role { get; private set; }
    public string? GitHubUsername { get; private set; }
    public string? LinkedInUrl { get; private set; }

    public Guid TenantId { get; set; }
    public bool IsDeleted { get; set; }
    public DateTime? DeletedAtUtc { get; set; }
    DateTime IAuditableEntity.CreatedAtUtc { get; set; }
    DateTime? IAuditableEntity.UpdatedAtUtc { get; set; }

    private readonly List<Profile> _profiles = [];
    public IReadOnlyCollection<Profile> Profiles => _profiles.AsReadOnly();

    private readonly List<SocialLink> _socialLinks = [];
    public IReadOnlyCollection<SocialLink> SocialLinks => _socialLinks.AsReadOnly();

    private User() { }

    public static User Create(
        string firstName,
        string lastName,
        Email email,
        UserRole role,
        Guid tenantId)
    {
        if (string.IsNullOrWhiteSpace(firstName))
            throw new DomainException("First name cannot be empty.");
        if (string.IsNullOrWhiteSpace(lastName))
            throw new DomainException("Last name cannot be empty.");

        var user = new User
        {
            Id = Guid.NewGuid(),
            FirstName = firstName.Trim(),
            LastName = lastName.Trim(),
            Email = email,
            Role = role,
            TenantId = tenantId,
            CreatedAtUtc = DateTime.UtcNow
        };

        user.RaiseDomainEvent(new Events.UserCreatedEvent(user.Id, tenantId));

        return user;
    }

    public void UpdateProfile(string firstName, string lastName, string? bio, string? avatarUrl)
    {
        FirstName = string.IsNullOrWhiteSpace(firstName) ? FirstName : firstName.Trim();
        LastName = string.IsNullOrWhiteSpace(lastName) ? LastName : lastName.Trim();
        Bio = bio?.Trim();
        AvatarUrl = avatarUrl?.Trim();
    }

    public void AddSocialLink(SocialLink link)
    {
        if (_socialLinks.Any(sl => sl.Platform == link.Platform))
            throw new DomainException($"Social link for {link.Platform} already exists.");

        _socialLinks.Add(link);
    }

    public void RemoveSocialLink(Enums.SocialPlatform platform)
    {
        var link = _socialLinks.FirstOrDefault(sl => sl.Platform == platform);
        if (link is not null)
            _socialLinks.Remove(link);
    }
}
