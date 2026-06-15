using Portfolify.Application.Common;
using Portfolify.Application.DTOs;

namespace Portfolify.Application.Features.Experiences.Queries;

public sealed record GetExperiencesByProfileIdQuery(Guid ProfileId) : IQuery<Response<IReadOnlyCollection<ExperienceDto>>>;
