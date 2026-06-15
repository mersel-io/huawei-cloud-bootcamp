using AutoMapper;
using MediatR;
using Microsoft.EntityFrameworkCore;
using Portfolify.Application.Common;
using Portfolify.Application.DTOs;
using Portfolify.Application.Exceptions;
using Portfolify.Application.Interfaces;
using Portfolify.Domain.Entities;
using Portfolify.Domain.Enums;
using Portfolify.Domain.ValueObjects;

namespace Portfolify.Application.Features.Users.Commands;

public sealed class CreateUserCommandHandler(
    IApplicationDbContext context,
    IMapper mapper,
    IPasswordHasher passwordHasher) : IRequestHandler<CreateUserCommand, Response<UserDto>>
{
    public async Task<Response<UserDto>> Handle(CreateUserCommand request, CancellationToken cancellationToken)
    {
        var email = Email.Create(request.Email);

        if (await context.Users.AnyAsync(u => u.Email == email, cancellationToken))
            throw new ConflictException($"User with email '{request.Email}' already exists.");

        if (!Enum.TryParse<UserRole>(request.Role, out var role))
            throw new BadRequestException("Invalid user role.");

        var passwordHash = passwordHasher.Hash(request.Password);

        var user = User.Create(
            request.FirstName,
            request.LastName,
            email,
            role,
            passwordHash);

        context.Add(user);
        await context.SaveChangesAsync(cancellationToken);

        var dto = mapper.Map<UserDto>(user);
        return Response<UserDto>.Success(dto);
    }
}

public sealed class UpdateUserCommandHandler(
    IApplicationDbContext context,
    IMapper mapper) : IRequestHandler<UpdateUserCommand, Response<UserDto>>
{
    public async Task<Response<UserDto>> Handle(UpdateUserCommand request, CancellationToken cancellationToken)
    {
        var user = await context.FindAsync<User>(request.UserId, cancellationToken)
            ?? throw new NotFoundException(nameof(User), request.UserId);

        user.UpdateProfile(request.FirstName, request.LastName, request.Bio, request.AvatarUrl);

        await context.SaveChangesAsync(cancellationToken);

        var dto = mapper.Map<UserDto>(user);
        return Response<UserDto>.Success(dto);
    }
}

public sealed class DeleteUserCommandHandler(
    IApplicationDbContext context) : IRequestHandler<DeleteUserCommand, Response<Unit>>
{
    public async Task<Response<Unit>> Handle(DeleteUserCommand request, CancellationToken cancellationToken)
    {
        var user = await context.FindAsync<User>(request.UserId, cancellationToken)
            ?? throw new NotFoundException(nameof(User), request.UserId);

        context.Remove(user);
        await context.SaveChangesAsync(cancellationToken);

        return Response<Unit>.Success(Unit.Value);
    }
}
