using Portfolify.Application.Common;
using Portfolify.Application.DTOs;

namespace Portfolify.Application.Features.Skills.Queries;

public sealed record GetSkillsByProfileIdQuery(Guid ProfileId) : IQuery<Response<IReadOnlyCollection<SkillDto>>>;
