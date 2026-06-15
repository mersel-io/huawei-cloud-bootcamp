namespace Portfolify.Application.DTOs;

public record UserDto(
    Guid Id,
    string FirstName,
    string LastName,
    string Email,
    string? Bio,
    string? AvatarUrl,
    string Role,
    string? GitHubUsername,
    DateTime CreatedAtUtc);

public record CreateUserRequest(
    string FirstName,
    string LastName,
    string Email,
    string Password,
    string Role);

public record UpdateUserRequest(
    string FirstName,
    string LastName,
    string? Bio,
    string? AvatarUrl);
