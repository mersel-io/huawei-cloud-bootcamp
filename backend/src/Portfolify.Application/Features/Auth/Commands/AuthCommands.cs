using Portfolify.Application.Common;
using Portfolify.Application.DTOs;

namespace Portfolify.Application.Features.Auth.Commands;

public sealed record RegisterCommand(
    string FirstName,
    string LastName,
    string Email,
    string Password,
    string Role) : ICommand<Response<AuthResponseDto>>;

public sealed record LoginCommand(
    string Email,
    string Password) : ICommand<Response<AuthResponseDto>>;
