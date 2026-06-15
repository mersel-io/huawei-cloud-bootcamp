namespace Portfolify.Application.DTOs;

public record AuthResponseDto(
    string Token,
    UserDto User);

public record RegisterRequest(
    string FirstName,
    string LastName,
    string Email,
    string Password,
    string Role);

public record LoginRequest(
    string Email,
    string Password);
