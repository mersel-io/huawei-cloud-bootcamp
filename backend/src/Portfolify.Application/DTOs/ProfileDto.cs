namespace Portfolify.Application.DTOs;

public record ProfileDto(
    Guid Id,
    Guid UserId,
    string Slug,
    string Title,
    string? Subtitle,
    string? Bio,
    string Visibility,
    string? Theme,
    bool IsPrimary,
    IReadOnlyCollection<ProfileLinkDto> Links,
    IReadOnlyCollection<SkillDto> Skills,
    IReadOnlyCollection<ExperienceDto> Experiences,
    IReadOnlyCollection<EducationDto> Education,
    IReadOnlyCollection<ProjectDto> Projects,
    DateTime CreatedAtUtc);

public record ProfileLinkDto(
    Guid Id,
    Guid ProfileId,
    string Label,
    string Url,
    string? Icon,
    int DisplayOrder);

public record SkillDto(
    Guid Id,
    Guid ProfileId,
    string Name,
    string Level,
    string? Category,
    int DisplayOrder);

public record ExperienceDto(
    Guid Id,
    Guid ProfileId,
    string Company,
    string Position,
    string? Description,
    string? Location,
    DateOnly StartDate,
    DateOnly? EndDate,
    bool IsCurrent,
    string? CompanyUrl,
    int DisplayOrder);

public record EducationDto(
    Guid Id,
    Guid ProfileId,
    string Institution,
    string Degree,
    string? FieldOfStudy,
    string? Description,
    string? Grade,
    DateOnly StartDate,
    DateOnly? EndDate,
    bool IsCurrent,
    int DisplayOrder);

public record ProjectDto(
    Guid Id,
    Guid ProfileId,
    string Title,
    string? Description,
    string? RepositoryUrl,
    string? LiveUrl,
    string? ImageUrl,
    string Status,
    string? Technologies,
    int DisplayOrder);

public record CreateProfileRequest(
    Guid UserId,
    string Slug,
    string Title,
    string? Subtitle,
    string? Bio,
    string Visibility);

public record UpdateProfileRequest(
    string Title,
    string? Subtitle,
    string? Bio,
    string Visibility,
    string? Theme);

public record CreateSkillRequest(
    Guid ProfileId,
    string Name,
    string Level,
    string? Category);

public record UpdateSkillRequest(
    string Name,
    string Level,
    string? Category,
    int DisplayOrder);

public record CreateProfileLinkRequest(
    Guid ProfileId,
    string Label,
    string Url,
    string? Icon);

public record UpdateProfileLinkRequest(
    string Label,
    string Url,
    string? Icon,
    int DisplayOrder);

public record CreateExperienceRequest(
    Guid ProfileId,
    string Company,
    string Position,
    string StartDate,
    string? EndDate,
    bool IsCurrent,
    string? Description,
    string? Location,
    string? CompanyUrl);

public record UpdateExperienceRequest(
    string Company,
    string Position,
    string StartDate,
    string? EndDate,
    bool IsCurrent,
    string? Description,
    string? Location,
    string? CompanyUrl,
    int DisplayOrder);

public record CreateEducationRequest(
    Guid ProfileId,
    string Institution,
    string Degree,
    string StartDate,
    string? EndDate,
    bool IsCurrent,
    string? FieldOfStudy,
    string? Description,
    string? Grade);

public record UpdateEducationRequest(
    string Institution,
    string Degree,
    string StartDate,
    string? EndDate,
    bool IsCurrent,
    string? FieldOfStudy,
    string? Description,
    string? Grade,
    int DisplayOrder);

public record CreateProjectRequest(
    Guid ProfileId,
    string Title,
    string? Description,
    string? RepositoryUrl,
    string? LiveUrl,
    string? Technologies,
    string Status);

public record UpdateProjectRequest(
    string Title,
    string? Description,
    string? RepositoryUrl,
    string? LiveUrl,
    string? Technologies,
    string Status,
    int DisplayOrder);
