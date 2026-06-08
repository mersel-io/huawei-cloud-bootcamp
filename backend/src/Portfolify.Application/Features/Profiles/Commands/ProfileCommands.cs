using MediatR;
using Portfolify.Application.Common;
using Portfolify.Application.DTOs;

namespace Portfolify.Application.Features.Profiles.Commands;

public sealed record CreateProfileCommand(
    Guid UserId,
    string Slug,
    string Title,
    string? Subtitle,
    string? Bio,
    string Visibility,
    Guid TenantId) : ICommand<Response<ProfileDto>>;

public sealed record UpdateProfileCommand(
    Guid ProfileId,
    string Title,
    string? Subtitle,
    string? Bio,
    string Visibility,
    string? Theme) : ICommand<Response<ProfileDto>>;

public sealed record DeleteProfileCommand(Guid ProfileId) : ICommand<Response<Unit>>;
