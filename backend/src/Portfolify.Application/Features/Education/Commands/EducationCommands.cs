using MediatR;
using Portfolify.Application.Common;
using Portfolify.Application.DTOs;

namespace Portfolify.Application.Features.Education.Commands;

public sealed record CreateEducationCommand(
    Guid ProfileId,
    string Institution,
    string Degree,
    string StartDate,
    string? EndDate,
    bool IsCurrent,
    string? FieldOfStudy,
    string? Description,
    string? Grade) : ICommand<Response<EducationDto>>;

public sealed record UpdateEducationCommand(
    Guid EducationId,
    string Institution,
    string Degree,
    string StartDate,
    string? EndDate,
    bool IsCurrent,
    string? FieldOfStudy,
    string? Description,
    string? Grade,
    int DisplayOrder) : ICommand<Response<EducationDto>>;

public sealed record DeleteEducationCommand(Guid EducationId) : ICommand<Response<Unit>>;
