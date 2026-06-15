using MediatR;
using Portfolify.Application.Common;
using Portfolify.Application.DTOs;

namespace Portfolify.Application.Features.Experiences.Commands;

public sealed record CreateExperienceCommand(
    Guid ProfileId,
    string Company,
    string Position,
    string StartDate,
    string? EndDate,
    bool IsCurrent,
    string? Description,
    string? Location,
    string? CompanyUrl) : ICommand<Response<ExperienceDto>>;

public sealed record UpdateExperienceCommand(
    Guid ExperienceId,
    string Company,
    string Position,
    string StartDate,
    string? EndDate,
    bool IsCurrent,
    string? Description,
    string? Location,
    string? CompanyUrl,
    int DisplayOrder) : ICommand<Response<ExperienceDto>>;

public sealed record DeleteExperienceCommand(Guid ExperienceId) : ICommand<Response<Unit>>;
