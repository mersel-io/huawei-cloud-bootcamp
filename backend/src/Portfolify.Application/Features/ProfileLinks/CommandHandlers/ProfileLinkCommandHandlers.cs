using AutoMapper;
using MediatR;
using Microsoft.EntityFrameworkCore;
using Portfolify.Application.Common;
using Portfolify.Application.DTOs;
using Portfolify.Application.Exceptions;
using Portfolify.Application.Features.ProfileLinks.Commands;
using Portfolify.Application.Interfaces;
using Portfolify.Domain.Entities;

namespace Portfolify.Application.Features.ProfileLinks.CommandHandlers;

public sealed class CreateProfileLinkCommandHandler(
    IApplicationDbContext context,
    IMapper mapper) : IRequestHandler<CreateProfileLinkCommand, Response<ProfileLinkDto>>
{
    public async Task<Response<ProfileLinkDto>> Handle(CreateProfileLinkCommand request, CancellationToken cancellationToken)
    {
        var profileExists = await context.Profiles
            .AnyAsync(p => p.Id == request.ProfileId, cancellationToken);

        if (!profileExists)
            throw new NotFoundException("Profile", request.ProfileId);

        var maxOrder = await context.ProfileLinks
            .Where(l => l.ProfileId == request.ProfileId)
            .MaxAsync(l => (int?)l.DisplayOrder, cancellationToken) ?? -1;

        var link = ProfileLink.Create(
            request.ProfileId,
            request.Label,
            request.Url,
            maxOrder + 1,
            request.Icon);

        context.Add(link);
        await context.SaveChangesAsync(cancellationToken);

        var dto = mapper.Map<ProfileLinkDto>(link);
        return Response<ProfileLinkDto>.Success(dto);
    }
}

public sealed class UpdateProfileLinkCommandHandler(
    IApplicationDbContext context,
    IMapper mapper) : IRequestHandler<UpdateProfileLinkCommand, Response<ProfileLinkDto>>
{
    public async Task<Response<ProfileLinkDto>> Handle(UpdateProfileLinkCommand request, CancellationToken cancellationToken)
    {
        var link = await context.ProfileLinks
            .FirstOrDefaultAsync(l => l.Id == request.ProfileLinkId, cancellationToken)
            ?? throw new NotFoundException("ProfileLink", request.ProfileLinkId);

        link.Update(request.Label, request.Url, request.DisplayOrder, request.Icon);

        await context.SaveChangesAsync(cancellationToken);

        var dto = mapper.Map<ProfileLinkDto>(link);
        return Response<ProfileLinkDto>.Success(dto);
    }
}

public sealed class DeleteProfileLinkCommandHandler(
    IApplicationDbContext context) : IRequestHandler<DeleteProfileLinkCommand, Response<Unit>>
{
    public async Task<Response<Unit>> Handle(DeleteProfileLinkCommand request, CancellationToken cancellationToken)
    {
        var link = await context.ProfileLinks
            .FirstOrDefaultAsync(l => l.Id == request.ProfileLinkId, cancellationToken)
            ?? throw new NotFoundException("ProfileLink", request.ProfileLinkId);

        context.Remove(link);
        await context.SaveChangesAsync(cancellationToken);

        return Response<Unit>.Success(Unit.Value);
    }
}
