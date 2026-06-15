using Portfolify.Application.Common;
using Portfolify.Application.DTOs;

namespace Portfolify.Application.Features.Education.Queries;

public sealed record GetEducationByProfileIdQuery(Guid ProfileId) : IQuery<Response<IReadOnlyCollection<EducationDto>>>;
