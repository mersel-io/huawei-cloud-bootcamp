using AutoMapper;
using MediatR;
using Microsoft.EntityFrameworkCore;
using Portfolify.Application.Common;
using Portfolify.Application.DTOs;
using Portfolify.Application.Exceptions;
using Portfolify.Application.Interfaces;
using Portfolify.Domain.Entities;
using Portfolify.Domain.Enums;
using ProfileEntity = Portfolify.Domain.Entities.Profile;

namespace Portfolify.Application.Features.Profiles.Commands;

public sealed class CreateProfileCommandHandler(
    IApplicationDbContext context,
    IMapper mapper) : IRequestHandler<CreateProfileCommand, Response<ProfileDto>>
{
    public async Task<Response<ProfileDto>> Handle(CreateProfileCommand request, CancellationToken cancellationToken)
    {
        _ = await context.FindAsync<User>(request.UserId, cancellationToken)
            ?? throw new NotFoundException(nameof(User), request.UserId);

        if (!Enum.TryParse<ProfileVisibility>(request.Visibility, out var visibility))
            throw new BadRequestException("Invalid profile visibility.");

        if (await context.Profiles.AnyAsync(p => p.Slug == request.Slug, cancellationToken))
            throw new ConflictException($"Profile with slug '{request.Slug}' already exists.");

        var profile = ProfileEntity.Create(
            request.UserId,
            request.Slug,
            request.Title,
            visibility,
            request.Subtitle,
            request.Bio);

        context.Add(profile);
        await context.SaveChangesAsync(cancellationToken);

        var dto = mapper.Map<ProfileDto>(profile);
        return Response<ProfileDto>.Success(dto);
    }
}

public sealed class UpdateProfileCommandHandler(
    IApplicationDbContext context,
    IMapper mapper) : IRequestHandler<UpdateProfileCommand, Response<ProfileDto>>
{
    public async Task<Response<ProfileDto>> Handle(UpdateProfileCommand request, CancellationToken cancellationToken)
    {
        var profile = await context.FindAsync<Domain.Entities.Profile>(request.ProfileId, cancellationToken)
            ?? throw new NotFoundException("Profile", request.ProfileId);

        if (!Enum.TryParse<ProfileVisibility>(request.Visibility, out var visibility))
            throw new BadRequestException("Invalid profile visibility.");

        profile.Update(request.Title, request.Subtitle, request.Bio, visibility, request.Theme);

        await context.SaveChangesAsync(cancellationToken);

        var dto = mapper.Map<ProfileDto>(profile);
        return Response<ProfileDto>.Success(dto);
    }
}

public sealed class DeleteProfileCommandHandler(
    IApplicationDbContext context) : IRequestHandler<DeleteProfileCommand, Response<Unit>>
{
    public async Task<Response<Unit>> Handle(DeleteProfileCommand request, CancellationToken cancellationToken)
    {
        var profile = await context.FindAsync<Domain.Entities.Profile>(request.ProfileId, cancellationToken)
            ?? throw new NotFoundException("Profile", request.ProfileId);

        context.Remove(profile);
        await context.SaveChangesAsync(cancellationToken);

        return Response<Unit>.Success(Unit.Value);
    }
}
