using Portfolify.Domain.Common;

namespace Portfolify.Domain.Entities;

public sealed class Experience : AggregateRoot, IAuditableEntity
{
    public Guid ProfileId { get; private set; }
    public string Company { get; private set; } = null!;
    public string Position { get; private set; } = null!;
    public string? Description { get; private set; }
    public string? Location { get; private set; }
    public DateOnly StartDate { get; private set; }
    public DateOnly? EndDate { get; private set; }
    public bool IsCurrent { get; private set; }
    public string? CompanyLogoUrl { get; private set; }
    public string? CompanyUrl { get; private set; }
    public int DisplayOrder { get; private set; }

    DateTime IAuditableEntity.CreatedAtUtc { get; set; }
    DateTime? IAuditableEntity.UpdatedAtUtc { get; set; }

    public Profile Profile { get; private set; } = null!;

    private Experience() { }

    public static Experience Create(
        Guid profileId,
        string company,
        string position,
        DateOnly startDate,
        string? description = null,
        string? location = null,
        DateOnly? endDate = null,
        bool isCurrent = false,
        string? companyLogoUrl = null,
        string? companyUrl = null,
        int displayOrder = 0)
    {
        if (string.IsNullOrWhiteSpace(company))
            throw new DomainException("Company name cannot be empty.");
        if (string.IsNullOrWhiteSpace(position))
            throw new DomainException("Position cannot be empty.");
        if (isCurrent && endDate.HasValue)
            throw new DomainException("Current position cannot have an end date.");
        if (endDate.HasValue && endDate.Value < startDate)
            throw new DomainException("End date cannot be before start date.");

        return new Experience
        {
            Id = Guid.NewGuid(),
            ProfileId = profileId,
            Company = company.Trim(),
            Position = position.Trim(),
            Description = description?.Trim(),
            Location = location?.Trim(),
            StartDate = startDate,
            EndDate = endDate,
            IsCurrent = isCurrent,
            CompanyLogoUrl = companyLogoUrl?.Trim(),
            CompanyUrl = companyUrl?.Trim(),
            DisplayOrder = displayOrder,
            CreatedAtUtc = DateTime.UtcNow
        };
    }

    public void Update(
        string company,
        string position,
        string? description,
        string? location,
        DateOnly startDate,
        DateOnly? endDate,
        bool isCurrent,
        string? companyLogoUrl,
        string? companyUrl,
        int displayOrder)
    {
        if (isCurrent && endDate.HasValue)
            throw new DomainException("Current position cannot have an end date.");
        if (endDate.HasValue && endDate.Value < startDate)
            throw new DomainException("End date cannot be before start date.");

        Company = string.IsNullOrWhiteSpace(company) ? Company : company.Trim();
        Position = string.IsNullOrWhiteSpace(position) ? Position : position.Trim();
        Description = description?.Trim();
        Location = location?.Trim();
        StartDate = startDate;
        EndDate = endDate;
        IsCurrent = isCurrent;
        CompanyLogoUrl = companyLogoUrl?.Trim();
        CompanyUrl = companyUrl?.Trim();
        DisplayOrder = displayOrder;
    }
}
