namespace Portfolify.Domain.Common;

public interface IAuditableEntity
{
    DateTime CreatedAtUtc { get; set; }
    DateTime? UpdatedAtUtc { get; set; }
}

public interface ISoftDeletableEntity
{
    bool IsDeleted { get; set; }
    DateTime? DeletedAtUtc { get; set; }
}


