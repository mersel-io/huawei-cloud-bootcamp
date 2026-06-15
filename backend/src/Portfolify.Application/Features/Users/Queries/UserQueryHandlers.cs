using AutoMapper;
using MediatR;
using Microsoft.EntityFrameworkCore;
using Portfolify.Application.Common;
using Portfolify.Application.DTOs;
using Portfolify.Application.Exceptions;
using Portfolify.Application.Interfaces;
using Portfolify.Domain.Entities;
using Portfolify.Domain.ValueObjects;

namespace Portfolify.Application.Features.Users.Queries;

public sealed class GetUserByIdQueryHandler(
    IApplicationDbContext context,
    IMapper mapper) : IRequestHandler<GetUserByIdQuery, Response<UserDto>>
{
    public async Task<Response<UserDto>> Handle(GetUserByIdQuery request, CancellationToken cancellationToken)
    {
        var user = await context.FindAsync<User>(request.UserId, cancellationToken)
            ?? throw new NotFoundException(nameof(User), request.UserId);

        var dto = mapper.Map<UserDto>(user);
        return Response<UserDto>.Success(dto);
    }
}

public sealed class GetUserByEmailQueryHandler(
    IApplicationDbContext context,
    IMapper mapper) : IRequestHandler<GetUserByEmailQuery, Response<UserDto>>
{
    public async Task<Response<UserDto>> Handle(GetUserByEmailQuery request, CancellationToken cancellationToken)
    {
        var email = Email.Create(request.Email);
        var user = await context.Users.FirstOrDefaultAsync(u => u.Email == email, cancellationToken)
            ?? throw new NotFoundException(nameof(User), request.Email);

        var dto = mapper.Map<UserDto>(user);
        return Response<UserDto>.Success(dto);
    }
}
