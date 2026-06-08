using Portfolify.Domain.Common;

namespace Portfolify.Domain.ValueObjects;

public sealed class SocialLink : ValueObject
{
    public Enums.SocialPlatform Platform { get; }
    public string Url { get; }
    public string? Username { get; }

    private SocialLink(Enums.SocialPlatform platform, string url, string? username)
    {
        Platform = platform;
        Url = url;
        Username = username;
    }

    public static SocialLink Create(Enums.SocialPlatform platform, string url, string? username = null)
    {
        if (string.IsNullOrWhiteSpace(url))
            throw new DomainException("Social link URL cannot be empty.");

        url = url.Trim();

        if (!Uri.TryCreate(url, UriKind.Absolute, out var uri) ||
            (uri.Scheme != "https" && uri.Scheme != "http"))
            throw new DomainException("Social link URL must be a valid HTTP/HTTPS URL.");

        return new SocialLink(platform, url, username?.Trim());
    }

    protected override IEnumerable<object?> GetEqualityComponents() => [Platform, Url];
}
