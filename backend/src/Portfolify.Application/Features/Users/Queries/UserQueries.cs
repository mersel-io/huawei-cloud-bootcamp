using Portfolify.Application.Common;
using Portfolify.Application.DTOs;

namespace Portfolify.Application.Features.Users.Queries;

public sealed record GetUserByIdQuery(Guid UserId) : IQuery<Response<UserDto>>;

public sealed record GetUserByEmailQuery(string Email) : IQuery<Response<UserDto>>;
