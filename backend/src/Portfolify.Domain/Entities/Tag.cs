using Portfolify.Domain.Common;

namespace Portfolify.Domain.Entities;

public sealed class Tag : Entity
{
    public string Name { get; private set; } = null!;
    public string? Color { get; private set; }

    private Tag() { }

    public static Tag Create(string name, string? color = null)
    {
        if (string.IsNullOrWhiteSpace(name))
            throw new DomainException("Tag name cannot be empty.");

        return new Tag
        {
            Id = Guid.NewGuid(),
            Name = name.Trim().ToLowerInvariant(),
            Color = color?.Trim()
        };
    }

    public void Update(string name, string? color)
    {
        Name = string.IsNullOrWhiteSpace(name) ? Name : name.Trim().ToLowerInvariant();
        Color = color?.Trim();
    }
}
