using Portfolify.Domain.Common;

namespace Portfolify.Domain.Entities;

public sealed class ProfileLink : Entity
{
    public Guid ProfileId { get; private set; }
    public string Label { get; private set; } = null!;
    public string Url { get; private set; } = null!;
    public string? Icon { get; private set; }
    public int DisplayOrder { get; private set; }

    public Profile Profile { get; private set; } = null!;

    private ProfileLink() { }

    public static ProfileLink Create(
        Guid profileId,
        string label,
        string url,
        int displayOrder,
        string? icon = null)
    {
        if (string.IsNullOrWhiteSpace(label))
            throw new DomainException("Link label cannot be empty.");
        if (string.IsNullOrWhiteSpace(url))
            throw new DomainException("Link URL cannot be empty.");

        if (!Uri.TryCreate(url.Trim(), UriKind.Absolute, out var uri) ||
            (uri.Scheme != "https" && uri.Scheme != "http"))
            throw new DomainException("Link URL must be a valid HTTP/HTTPS URL.");

        return new ProfileLink
        {
            Id = Guid.NewGuid(),
            ProfileId = profileId,
            Label = label.Trim(),
            Url = url.Trim(),
            Icon = icon?.Trim(),
            DisplayOrder = displayOrder
        };
    }

    public void Update(string label, string url, int displayOrder, string? icon = null)
    {
        if (string.IsNullOrWhiteSpace(label))
            throw new DomainException("Link label cannot be empty.");
        if (string.IsNullOrWhiteSpace(url))
            throw new DomainException("Link URL cannot be empty.");

        if (!Uri.TryCreate(url.Trim(), UriKind.Absolute, out var uri) ||
            (uri.Scheme != "https" && uri.Scheme != "http"))
            throw new DomainException("Link URL must be a valid HTTP/HTTPS URL.");

        Label = label.Trim();
        Url = url.Trim();
        Icon = icon?.Trim();
        DisplayOrder = displayOrder;
    }
}
