using Portfolify.Application.Common;
using Portfolify.Application.DTOs;

namespace Portfolify.Application.Features.Projects.Queries;

public sealed record GetProjectsByProfileIdQuery(Guid ProfileId) : IQuery<Response<IReadOnlyCollection<ProjectDto>>>;
