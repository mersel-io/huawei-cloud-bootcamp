using System.Text.RegularExpressions;
using Portfolify.Domain.Common;

namespace Portfolify.Domain.ValueObjects;

public sealed class Slug : ValueObject
{
    public string Value { get; }

    private Slug(string value) => Value = value;

    public static Slug Create(string value)
    {
        if (string.IsNullOrWhiteSpace(value))
            throw new DomainException("Slug cannot be empty.");

        value = value.Trim().ToLowerInvariant();

        if (value.Length > 100)
            throw new DomainException("Slug is too long. Maximum length is 100 characters.");

        if (!Regex.IsMatch(value, @"^[a-z0-9]+(?:-[a-z0-9]+)*$"))
            throw new DomainException("Slug must be lowercase alphanumeric with hyphens.");

        return new Slug(value);
    }

    public static Slug FromTitle(string title)
    {
        if (string.IsNullOrWhiteSpace(title))
            throw new DomainException("Title cannot be empty for slug generation.");

        var slug = title.Trim().ToLowerInvariant();
        slug = Regex.Replace(slug, @"[^a-z0-9\s-]", "");
        slug = Regex.Replace(slug, @"[\s]+", "-");
        slug = Regex.Replace(slug, @"-+", "-");
        slug = slug.Trim('-');

        return new Slug(slug);
    }

    protected override IEnumerable<object?> GetEqualityComponents() => [Value];

    public override string ToString() => Value;

    public static implicit operator string(Slug slug) => slug.Value;
}
