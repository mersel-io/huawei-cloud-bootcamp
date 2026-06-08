using Portfolify.Domain.Common;

namespace Portfolify.Domain.ValueObjects;

public sealed class Email : ValueObject
{
    public string Value { get; }

    private Email(string value) => Value = value;

    public static Email Create(string email)
    {
        if (string.IsNullOrWhiteSpace(email))
            throw new DomainException("Email cannot be empty.");

        email = email.Trim().ToLowerInvariant();

        if (email.Length > 256)
            throw new DomainException("Email is too long.");

        if (!System.Text.RegularExpressions.Regex.IsMatch(
                email,
                @"^[^@\s]+@[^@\s]+\.[^@\s]+$",
                System.Text.RegularExpressions.RegexOptions.IgnoreCase))
            throw new DomainException("Email is invalid.");

        return new Email(email);
    }

    protected override IEnumerable<object?> GetEqualityComponents() => [Value];

    public override string ToString() => Value;

    public static implicit operator string(Email email) => email.Value;
}
