using System.Text.RegularExpressions;
using Portfolify.Domain.Common;

namespace Portfolify.Domain.ValueObjects;

public sealed class ContactInfo : ValueObject
{
    public string? PhoneNumber { get; }
    public string? Location { get; }
    public string? WebsiteUrl { get; }

    private ContactInfo(string? phoneNumber, string? location, string? websiteUrl)
    {
        PhoneNumber = phoneNumber;
        Location = location;
        WebsiteUrl = websiteUrl;
    }

    public static ContactInfo Create(string? phoneNumber, string? location, string? websiteUrl)
    {
        if (!string.IsNullOrWhiteSpace(phoneNumber))
        {
            phoneNumber = phoneNumber.Trim();
            if (!Regex.IsMatch(phoneNumber, @"^\+?[\d\s\-\(\)]{7,20}$"))
                throw new DomainException("Phone number is invalid.");
        }

        if (!string.IsNullOrWhiteSpace(websiteUrl))
        {
            websiteUrl = websiteUrl.Trim();
            if (!Uri.TryCreate(websiteUrl, UriKind.Absolute, out var uri) ||
                (uri.Scheme != "https" && uri.Scheme != "http"))
                throw new DomainException("Website URL must be a valid HTTP/HTTPS URL.");
        }

        return new ContactInfo(
            string.IsNullOrWhiteSpace(phoneNumber) ? null : phoneNumber.Trim(),
            string.IsNullOrWhiteSpace(location) ? null : location?.Trim(),
            string.IsNullOrWhiteSpace(websiteUrl) ? null : websiteUrl.Trim()
        );
    }

    protected override IEnumerable<object?> GetEqualityComponents() => [PhoneNumber, Location, WebsiteUrl];
}
