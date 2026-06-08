using Portfolify.Application.Common;
using Portfolify.Application.DTOs;

namespace Portfolify.Application.Features.Profiles.Queries;

public sealed record GetProfileByIdQuery(Guid ProfileId) : IQuery<Response<ProfileDto>>;

public sealed record GetProfileBySlugQuery(string Slug) : IQuery<Response<ProfileDto>>;

public sealed record GetProfilesByUserIdQuery(Guid UserId, int PageNumber = 1, int PageSize = 20)
    : IQuery<PagedResponse<ProfileDto>>;
