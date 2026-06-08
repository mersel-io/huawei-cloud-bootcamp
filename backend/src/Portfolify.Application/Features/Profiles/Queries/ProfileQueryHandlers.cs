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

namespace Portfolify.Application.Features.Profiles.Queries;

public sealed class GetProfileByIdQueryHandler(
    IApplicationDbContext context,
    IMapper mapper) : IRequestHandler<GetProfileByIdQuery, Response<ProfileDto>>
{
    public async Task<Response<ProfileDto>> Handle(GetProfileByIdQuery request, CancellationToken cancellationToken)
    {
        var profile = await context.Profiles
            .Include(p => p.Links)
            .FirstOrDefaultAsync(p => p.Id == request.ProfileId, cancellationToken)
            ?? throw new NotFoundException("Profile", request.ProfileId);

        var dto = mapper.Map<ProfileDto>(profile);
        return Response<ProfileDto>.Success(dto);
    }
}

public sealed class GetProfileBySlugQueryHandler(
    IApplicationDbContext context,
    IMapper mapper) : IRequestHandler<GetProfileBySlugQuery, Response<ProfileDto>>
{
    public async Task<Response<ProfileDto>> Handle(GetProfileBySlugQuery request, CancellationToken cancellationToken)
    {
        var profile = await context.Profiles
            .Include(p => p.Links)
            .FirstOrDefaultAsync(p => p.Slug == request.Slug, cancellationToken)
            ?? throw new NotFoundException("Profile", request.Slug);

        var dto = mapper.Map<ProfileDto>(profile);
        return Response<ProfileDto>.Success(dto);
    }
}

public sealed class GetProfilesByUserIdQueryHandler(
    IApplicationDbContext context,
    IMapper mapper) : IRequestHandler<GetProfilesByUserIdQuery, PagedResponse<ProfileDto>>
{
    public async Task<PagedResponse<ProfileDto>> Handle(GetProfilesByUserIdQuery request, CancellationToken cancellationToken)
    {
        var query = context.Profiles
            .Include(p => p.Links)
            .Where(p => p.UserId == request.UserId);

        var totalCount = await query.CountAsync(cancellationToken);

        var profiles = await query
            .OrderBy(p => p.CreatedAtUtc)
            .Skip((request.PageNumber - 1) * request.PageSize)
            .Take(request.PageSize)
            .AsNoTracking()
            .ToListAsync(cancellationToken);

        var dtos = mapper.Map<IReadOnlyCollection<ProfileDto>>(profiles);

        return new PagedResponse<ProfileDto>(dtos, totalCount, request.PageNumber, request.PageSize);
    }
}
