using Portfolify.Domain.Common;

namespace Portfolify.Domain.ValueObjects;

public sealed class Url : ValueObject
{
    public string Value { get; }

    private Url(string value) => Value = value;

    public static Url Create(string value)
    {
        if (string.IsNullOrWhiteSpace(value))
            throw new DomainException("URL cannot be empty.");

        value = value.Trim();

        if (value.Length > 500)
            throw new DomainException("URL is too long. Maximum length is 500 characters.");

        if (!Uri.TryCreate(value, UriKind.Absolute, out var uri) ||
            (uri.Scheme != "https" && uri.Scheme != "http"))
            throw new DomainException("URL must be a valid HTTP/HTTPS URL.");

        return new Url(value);
    }

    protected override IEnumerable<object?> GetEqualityComponents() => [Value];

    public override string ToString() => Value;

    public static implicit operator string(Url url) => url.Value;
}
