using AutoMapper;
using MediatR;
using Microsoft.EntityFrameworkCore;
using Portfolify.Application.Common;
using Portfolify.Application.DTOs;
using Portfolify.Application.Exceptions;
using Portfolify.Application.Features.Education.Commands;
using Portfolify.Application.Features.Education.Queries;
using Portfolify.Application.Interfaces;
using Portfolify.Domain.Entities;
using EducationEntity = Portfolify.Domain.Entities.Education;

namespace Portfolify.Application.Features.Education.CommandHandlers;

public sealed class CreateEducationCommandHandler(
    IApplicationDbContext context,
    IMapper mapper) : IRequestHandler<CreateEducationCommand, Response<EducationDto>>
{
    public async Task<Response<EducationDto>> Handle(CreateEducationCommand request, CancellationToken cancellationToken)
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

        var maxOrder = await context.Educations
            .Where(e => e.ProfileId == request.ProfileId)
            .MaxAsync(e => (int?)e.DisplayOrder, cancellationToken) ?? -1;

        var education = EducationEntity.Create(
            request.ProfileId,
            request.Institution,
            request.Degree,
            startDate,
            request.FieldOfStudy,
            request.Description,
            request.Grade,
            endDate,
            request.IsCurrent,
            null,
            maxOrder + 1);

        context.Add(education);
        await context.SaveChangesAsync(cancellationToken);

        var dto = mapper.Map<EducationDto>(education);
        return Response<EducationDto>.Success(dto);
    }
}

public sealed class UpdateEducationCommandHandler(
    IApplicationDbContext context,
    IMapper mapper) : IRequestHandler<UpdateEducationCommand, Response<EducationDto>>
{
    public async Task<Response<EducationDto>> Handle(UpdateEducationCommand request, CancellationToken cancellationToken)
    {
        var education = await context.Educations
            .FirstOrDefaultAsync(e => e.Id == request.EducationId, cancellationToken)
            ?? throw new NotFoundException("Education", request.EducationId);

        if (!DateOnly.TryParse(request.StartDate, out var startDate))
            throw new BadRequestException("Invalid start date format.");

        DateOnly? endDate = null;
        if (!string.IsNullOrWhiteSpace(request.EndDate) && DateOnly.TryParse(request.EndDate, out var parsed))
            endDate = parsed;

        education.Update(
            request.Institution,
            request.Degree,
            request.FieldOfStudy,
            request.Description,
            request.Grade,
            startDate,
            endDate,
            request.IsCurrent,
            null,
            request.DisplayOrder);

        await context.SaveChangesAsync(cancellationToken);

        var dto = mapper.Map<EducationDto>(education);
        return Response<EducationDto>.Success(dto);
    }
}

public sealed class DeleteEducationCommandHandler(
    IApplicationDbContext context) : IRequestHandler<DeleteEducationCommand, Response<Unit>>
{
    public async Task<Response<Unit>> Handle(DeleteEducationCommand request, CancellationToken cancellationToken)
    {
        var education = await context.Educations
            .FirstOrDefaultAsync(e => e.Id == request.EducationId, cancellationToken)
            ?? throw new NotFoundException("Education", request.EducationId);

        context.Remove(education);
        await context.SaveChangesAsync(cancellationToken);

        return Response<Unit>.Success(Unit.Value);
    }
}

public sealed class GetEducationByProfileIdQueryHandler(
    IApplicationDbContext context,
    IMapper mapper) : IRequestHandler<GetEducationByProfileIdQuery, Response<IReadOnlyCollection<EducationDto>>>
{
    public async Task<Response<IReadOnlyCollection<EducationDto>>> Handle(GetEducationByProfileIdQuery request, CancellationToken cancellationToken)
    {
        var education = await context.Educations
            .Where(e => e.ProfileId == request.ProfileId)
            .OrderBy(e => e.DisplayOrder)
            .AsNoTracking()
            .ToListAsync(cancellationToken);

        var dtos = mapper.Map<IReadOnlyCollection<EducationDto>>(education);
        return Response<IReadOnlyCollection<EducationDto>>.Success(dtos);
    }
}
