using MediatR;
using Portfolify.Application.Common;
using Portfolify.Application.DTOs;

namespace Portfolify.Application.Features.ProfileLinks.Commands;

public sealed record CreateProfileLinkCommand(
    Guid ProfileId,
    string Label,
    string Url,
    string? Icon) : ICommand<Response<ProfileLinkDto>>;

public sealed record UpdateProfileLinkCommand(
    Guid ProfileLinkId,
    string Label,
    string Url,
    string? Icon,
    int DisplayOrder) : ICommand<Response<ProfileLinkDto>>;

public sealed record DeleteProfileLinkCommand(Guid ProfileLinkId) : ICommand<Response<Unit>>;
