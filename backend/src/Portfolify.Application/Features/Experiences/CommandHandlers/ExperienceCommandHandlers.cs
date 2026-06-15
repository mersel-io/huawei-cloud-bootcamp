using AutoMapper;
using MediatR;
using Microsoft.EntityFrameworkCore;
using Portfolify.Application.Common;
using Portfolify.Application.DTOs;
using Portfolify.Application.Exceptions;
using Portfolify.Application.Features.Experiences.Commands;
using Portfolify.Application.Features.Experiences.Queries;
using Portfolify.Application.Interfaces;
using Portfolify.Domain.Entities;

namespace Portfolify.Application.Features.Experiences.CommandHandlers;

public sealed class CreateExperienceCommandHandler(
    IApplicationDbContext context,
    IMapper mapper) : IRequestHandler<CreateExperienceCommand, Response<ExperienceDto>>
{
    public async Task<Response<ExperienceDto>> Handle(CreateExperienceCommand request, CancellationToken cancellationToken)
    {
        var profileExists = await context.Profiles
            .AnyAsync(p => p.Id == request.ProfileId, cancellationToken);

        if (!profileExists)
            throw new NotFoundException("Profile", request.ProfileId);

        if (!DateOnly.TryParse(request.StartDate, out var startDate))
            throw new BadRequestException("Invalid start date format. Use YYYY-MM-DD.");

        DateOnly? endDate = null;
        if (!string.IsNullOrWhiteSpace(request.EndDate))
        {
            if (!DateOnly.TryParse(request.EndDate, out var parsed))
                throw new BadRequestException("Invalid end date format. Use YYYY-MM-DD.");
            endDate = parsed;
        }

        var maxOrder = await context.Experiences
            .Where(e => e.ProfileId == request.ProfileId)
            .MaxAsync(e => (int?)e.DisplayOrder, cancellationToken) ?? -1;

        var experience = Experience.Create(
            request.ProfileId,
            request.Company,
            request.Position,
            startDate,
            request.Description,
            request.Location,
            endDate,
            request.IsCurrent,
            null,
            request.CompanyUrl,
            maxOrder + 1);

        context.Add(experience);
        await context.SaveChangesAsync(cancellationToken);

        var dto = mapper.Map<ExperienceDto>(experience);
        return Response<ExperienceDto>.Success(dto);
    }
}

public sealed class UpdateExperienceCommandHandler(
    IApplicationDbContext context,
    IMapper mapper) : IRequestHandler<UpdateExperienceCommand, Response<ExperienceDto>>
{
    public async Task<Response<ExperienceDto>> Handle(UpdateExperienceCommand request, CancellationToken cancellationToken)
    {
        var experience = await context.Experiences
            .FirstOrDefaultAsync(e => e.Id == request.ExperienceId, cancellationToken)
            ?? throw new NotFoundException("Experience", request.ExperienceId);

        if (!DateOnly.TryParse(request.StartDate, out var startDate))
            throw new BadRequestException("Invalid start date format.");

        DateOnly? endDate = null;
        if (!string.IsNullOrWhiteSpace(request.EndDate) && DateOnly.TryParse(request.EndDate, out var parsed))
            endDate = parsed;

        experience.Update(
            request.Company,
            request.Position,
            request.Description,
            request.Location,
            startDate,
            endDate,
            request.IsCurrent,
            null,
            request.CompanyUrl,
            request.DisplayOrder);

        await context.SaveChangesAsync(cancellationToken);

        var dto = mapper.Map<ExperienceDto>(experience);
        return Response<ExperienceDto>.Success(dto);
    }
}

public sealed class DeleteExperienceCommandHandler(
    IApplicationDbContext context) : IRequestHandler<DeleteExperienceCommand, Response<Unit>>
{
    public async Task<Response<Unit>> Handle(DeleteExperienceCommand request, CancellationToken cancellationToken)
    {
        var experience = await context.Experiences
            .FirstOrDefaultAsync(e => e.Id == request.ExperienceId, cancellationToken)
            ?? throw new NotFoundException("Experience", request.ExperienceId);

        context.Remove(experience);
        await context.SaveChangesAsync(cancellationToken);

        return Response<Unit>.Success(Unit.Value);
    }
}

public sealed class GetExperiencesByProfileIdQueryHandler(
    IApplicationDbContext context,
    IMapper mapper) : IRequestHandler<GetExperiencesByProfileIdQuery, Response<IReadOnlyCollection<ExperienceDto>>>
{
    public async Task<Response<IReadOnlyCollection<ExperienceDto>>> Handle(GetExperiencesByProfileIdQuery request, CancellationToken cancellationToken)
    {
        var experiences = await context.Experiences
            .Where(e => e.ProfileId == request.ProfileId)
            .OrderBy(e => e.DisplayOrder)
            .AsNoTracking()
            .ToListAsync(cancellationToken);

        var dtos = mapper.Map<IReadOnlyCollection<ExperienceDto>>(experiences);
        return Response<IReadOnlyCollection<ExperienceDto>>.Success(dtos);
    }
}
