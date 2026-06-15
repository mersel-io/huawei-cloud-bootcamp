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
    DateTime CreatedAtUtc);

public record ProfileLinkDto(
    Guid Id,
    string Label,
    string Url,
    string? Icon,
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
