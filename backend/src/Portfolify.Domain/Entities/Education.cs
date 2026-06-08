using Portfolify.Domain.Common;

namespace Portfolify.Domain.Entities;

public sealed class Education : AggregateRoot, IAuditableEntity, ITenantEntity
{
    public Guid ProfileId { get; private set; }
    public string Institution { get; private set; } = null!;
    public string Degree { get; private set; } = null!;
    public string? FieldOfStudy { get; private set; }
    public string? Description { get; private set; }
    public string? Grade { get; private set; }
    public DateOnly StartDate { get; private set; }
    public DateOnly? EndDate { get; private set; }
    public bool IsCurrent { get; private set; }
    public string? LogoUrl { get; private set; }
    public int DisplayOrder { get; private set; }

    public Guid TenantId { get; set; }
    DateTime IAuditableEntity.CreatedAtUtc { get; set; }
    DateTime? IAuditableEntity.UpdatedAtUtc { get; set; }

    public Profile Profile { get; private set; } = null!;

    private Education() { }

    public static Education Create(
        Guid profileId,
        string institution,
        string degree,
        DateOnly startDate,
        Guid tenantId,
        string? fieldOfStudy = null,
        string? description = null,
        string? grade = null,
        DateOnly? endDate = null,
        bool isCurrent = false,
        string? logoUrl = null,
        int displayOrder = 0)
    {
        if (string.IsNullOrWhiteSpace(institution))
            throw new DomainException("Institution name cannot be empty.");
        if (string.IsNullOrWhiteSpace(degree))
            throw new DomainException("Degree cannot be empty.");
        if (isCurrent && endDate.HasValue)
            throw new DomainException("Current education cannot have an end date.");
        if (endDate.HasValue && endDate.Value < startDate)
            throw new DomainException("End date cannot be before start date.");

        return new Education
        {
            Id = Guid.NewGuid(),
            ProfileId = profileId,
            Institution = institution.Trim(),
            Degree = degree.Trim(),
            FieldOfStudy = fieldOfStudy?.Trim(),
            Description = description?.Trim(),
            Grade = grade?.Trim(),
            StartDate = startDate,
            EndDate = endDate,
            IsCurrent = isCurrent,
            LogoUrl = logoUrl?.Trim(),
            DisplayOrder = displayOrder,
            TenantId = tenantId,
            CreatedAtUtc = DateTime.UtcNow
        };
    }

    public void Update(
        string institution,
        string degree,
        string? fieldOfStudy,
        string? description,
        string? grade,
        DateOnly startDate,
        DateOnly? endDate,
        bool isCurrent,
        string? logoUrl,
        int displayOrder)
    {
        if (isCurrent && endDate.HasValue)
            throw new DomainException("Current education cannot have an end date.");
        if (endDate.HasValue && endDate.Value < startDate)
            throw new DomainException("End date cannot be before start date.");

        Institution = string.IsNullOrWhiteSpace(institution) ? Institution : institution.Trim();
        Degree = string.IsNullOrWhiteSpace(degree) ? Degree : degree.Trim();
        FieldOfStudy = fieldOfStudy?.Trim();
        Description = description?.Trim();
        Grade = grade?.Trim();
        StartDate = startDate;
        EndDate = endDate;
        IsCurrent = isCurrent;
        LogoUrl = logoUrl?.Trim();
        DisplayOrder = displayOrder;
    }
}
