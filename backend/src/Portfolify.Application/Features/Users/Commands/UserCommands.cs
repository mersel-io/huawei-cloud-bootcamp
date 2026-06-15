using MediatR;
using Portfolify.Application.Common;
using Portfolify.Application.DTOs;

namespace Portfolify.Application.Features.Users.Commands;

public sealed record CreateUserCommand(
    string FirstName,
    string LastName,
    string Email,
    string Role) : ICommand<Response<UserDto>>;

public sealed record UpdateUserCommand(
    Guid UserId,
    string FirstName,
    string LastName,
    string? Bio,
    string? AvatarUrl) : ICommand<Response<UserDto>>;

public sealed record DeleteUserCommand(Guid UserId) : ICommand<Response<Unit>>;
