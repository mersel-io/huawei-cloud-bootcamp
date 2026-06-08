namespace Portfolify.Domain.Common;

public abstract class AggregateRoot : Entity
{
    public DateTime CreatedAtUtc { get; protected set; } = DateTime.UtcNow;
    public DateTime? UpdatedAtUtc { get; protected set; }
}
