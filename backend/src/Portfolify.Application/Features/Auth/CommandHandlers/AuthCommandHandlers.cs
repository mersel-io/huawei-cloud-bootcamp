using AutoMapper;
using MediatR;
using Microsoft.EntityFrameworkCore;
using Portfolify.Application.Common;
using Portfolify.Application.DTOs;
using Portfolify.Application.Exceptions;
using Portfolify.Application.Features.Auth.Commands;
using Portfolify.Application.Interfaces;
using Portfolify.Domain.Entities;
using Portfolify.Domain.Enums;
using Portfolify.Domain.ValueObjects;

namespace Portfolify.Application.Features.Auth.CommandHandlers;

public sealed class RegisterCommandHandler(
    IApplicationDbContext context,
    IMapper mapper,
    IPasswordHasher passwordHasher,
    ITokenService tokenService) : IRequestHandler<RegisterCommand, Response<AuthResponseDto>>
{
    public async Task<Response<AuthResponseDto>> Handle(RegisterCommand request, CancellationToken cancellationToken)
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

        var userDto = mapper.Map<UserDto>(user);
        var token = tokenService.GenerateToken(user);

        return Response<AuthResponseDto>.Success(new AuthResponseDto(token, userDto));
    }
}

public sealed class LoginCommandHandler(
    IApplicationDbContext context,
    IMapper mapper,
    IPasswordHasher passwordHasher,
    ITokenService tokenService) : IRequestHandler<LoginCommand, Response<AuthResponseDto>>
{
    public async Task<Response<AuthResponseDto>> Handle(LoginCommand request, CancellationToken cancellationToken)
    {
        var email = Email.Create(request.Email);

        var user = await context.Users.FirstOrDefaultAsync(u => u.Email == email, cancellationToken);

        if (user is null || !passwordHasher.Verify(request.Password, user.PasswordHash))
            throw new BadRequestException("Invalid email or password.");

        var userDto = mapper.Map<UserDto>(user);
        var token = tokenService.GenerateToken(user);

        return Response<AuthResponseDto>.Success(new AuthResponseDto(token, userDto));
    }
}
