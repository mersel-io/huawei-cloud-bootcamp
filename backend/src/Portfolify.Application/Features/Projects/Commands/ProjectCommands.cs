using MediatR;
using Portfolify.Application.Common;
using Portfolify.Application.DTOs;

namespace Portfolify.Application.Features.Projects.Commands;

public sealed record CreateProjectCommand(
    Guid ProfileId,
    string Title,
    string? Description,
    string? RepositoryUrl,
    string? LiveUrl,
    string? Technologies,
    string Status) : ICommand<Response<ProjectDto>>;

public sealed record UpdateProjectCommand(
    Guid ProjectId,
    string Title,
    string? Description,
    string? RepositoryUrl,
    string? LiveUrl,
    string? Technologies,
    string Status,
    int DisplayOrder) : ICommand<Response<ProjectDto>>;

public sealed record DeleteProjectCommand(Guid ProjectId) : ICommand<Response<Unit>>;
