using AutoMapper;
using MediatR;
using Microsoft.EntityFrameworkCore;
using Portfolify.Application.Common;
using Portfolify.Application.DTOs;
using Portfolify.Application.Exceptions;
using Portfolify.Application.Features.Skills.Commands;
using Portfolify.Application.Features.Skills.Queries;
using Portfolify.Application.Interfaces;
using Portfolify.Domain.Entities;
using Portfolify.Domain.Enums;

namespace Portfolify.Application.Features.Skills.CommandHandlers;

public sealed class CreateSkillCommandHandler(
    IApplicationDbContext context,
    IMapper mapper) : IRequestHandler<CreateSkillCommand, Response<SkillDto>>
{
    public async Task<Response<SkillDto>> Handle(CreateSkillCommand request, CancellationToken cancellationToken)
    {
        var profileExists = await context.Profiles
            .AnyAsync(p => p.Id == request.ProfileId, cancellationToken);

        if (!profileExists)
            throw new NotFoundException("Profile", request.ProfileId);

        if (!Enum.TryParse<SkillLevel>(request.Level, out var level))
            throw new BadRequestException("Invalid skill level.");

        var maxDisplayOrder = await context.Skills
            .Where(s => s.ProfileId == request.ProfileId)
            .MaxAsync(s => (int?)s.DisplayOrder, cancellationToken) ?? -1;

        var skill = Skill.Create(
            request.ProfileId,
            request.Name,
            level,
            request.Category,
            maxDisplayOrder + 1);

        context.Add(skill);
        await context.SaveChangesAsync(cancellationToken);

        var dto = mapper.Map<SkillDto>(skill);
        return Response<SkillDto>.Success(dto);
    }
}

public sealed class UpdateSkillCommandHandler(
    IApplicationDbContext context,
    IMapper mapper) : IRequestHandler<UpdateSkillCommand, Response<SkillDto>>
{
    public async Task<Response<SkillDto>> Handle(UpdateSkillCommand request, CancellationToken cancellationToken)
    {
        var skill = await context.Skills
            .FirstOrDefaultAsync(s => s.Id == request.SkillId, cancellationToken)
            ?? throw new NotFoundException("Skill", request.SkillId);

        if (!Enum.TryParse<SkillLevel>(request.Level, out var level))
            throw new BadRequestException("Invalid skill level.");

        skill.Update(request.Name, level, request.Category, request.DisplayOrder, null);
        await context.SaveChangesAsync(cancellationToken);

        var dto = mapper.Map<SkillDto>(skill);
        return Response<SkillDto>.Success(dto);
    }
}

public sealed class DeleteSkillCommandHandler(
    IApplicationDbContext context) : IRequestHandler<DeleteSkillCommand, Response<Unit>>
{
    public async Task<Response<Unit>> Handle(DeleteSkillCommand request, CancellationToken cancellationToken)
    {
        var skill = await context.Skills
            .FirstOrDefaultAsync(s => s.Id == request.SkillId, cancellationToken)
            ?? throw new NotFoundException("Skill", request.SkillId);

        context.Remove(skill);
        await context.SaveChangesAsync(cancellationToken);

        return Response<Unit>.Success(Unit.Value);
    }
}

public sealed class GetSkillsByProfileIdQueryHandler(
    IApplicationDbContext context,
    IMapper mapper) : IRequestHandler<GetSkillsByProfileIdQuery, Response<IReadOnlyCollection<SkillDto>>>
{
    public async Task<Response<IReadOnlyCollection<SkillDto>>> Handle(GetSkillsByProfileIdQuery request, CancellationToken cancellationToken)
    {
        var skills = await context.Skills
            .Where(s => s.ProfileId == request.ProfileId)
            .OrderBy(s => s.DisplayOrder)
            .AsNoTracking()
            .ToListAsync(cancellationToken);

        var dtos = mapper.Map<IReadOnlyCollection<SkillDto>>(skills);
        return Response<IReadOnlyCollection<SkillDto>>.Success(dtos);
    }
}
