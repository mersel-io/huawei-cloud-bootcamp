using MediatR;
using Portfolify.Application.Common;
using Portfolify.Application.DTOs;

namespace Portfolify.Application.Features.Skills.Commands;

public sealed record CreateSkillCommand(
    Guid ProfileId,
    string Name,
    string Level,
    string? Category) : ICommand<Response<SkillDto>>;

public sealed record UpdateSkillCommand(
    Guid SkillId,
    string Name,
    string Level,
    string? Category,
    int DisplayOrder) : ICommand<Response<SkillDto>>;

public sealed record DeleteSkillCommand(Guid SkillId) : ICommand<Response<Unit>>;
