using AutoMapper;
using MediatR;
using Microsoft.EntityFrameworkCore;
using Portfolify.Application.Common;
using Portfolify.Application.DTOs;
using Portfolify.Application.Exceptions;
using Portfolify.Application.Features.Projects.Commands;
using Portfolify.Application.Features.Projects.Queries;
using Portfolify.Application.Interfaces;
using Portfolify.Domain.Entities;
using Portfolify.Domain.Enums;

namespace Portfolify.Application.Features.Projects.CommandHandlers;

public sealed class CreateProjectCommandHandler(
    IApplicationDbContext context,
    IMapper mapper) : IRequestHandler<CreateProjectCommand, Response<ProjectDto>>
{
    public async Task<Response<ProjectDto>> Handle(CreateProjectCommand request, CancellationToken cancellationToken)
    {
        var profileExists = await context.Profiles
            .AnyAsync(p => p.Id == request.ProfileId, cancellationToken);

        if (!profileExists)
            throw new NotFoundException("Profile", request.ProfileId);

        if (!Enum.TryParse<ProjectStatus>(request.Status, out var status))
            throw new BadRequestException("Invalid project status.");

        var maxOrder = await context.Projects
            .Where(p => p.ProfileId == request.ProfileId)
            .MaxAsync(p => (int?)p.DisplayOrder, cancellationToken) ?? -1;

        var project = Project.Create(
            request.ProfileId,
            request.Title,
            request.Description,
            request.RepositoryUrl,
            request.LiveUrl,
            null,
            status,
            maxOrder + 1,
            request.Technologies);

        context.Add(project);
        await context.SaveChangesAsync(cancellationToken);

        var dto = mapper.Map<ProjectDto>(project);
        return Response<ProjectDto>.Success(dto);
    }
}

public sealed class UpdateProjectCommandHandler(
    IApplicationDbContext context,
    IMapper mapper) : IRequestHandler<UpdateProjectCommand, Response<ProjectDto>>
{
    public async Task<Response<ProjectDto>> Handle(UpdateProjectCommand request, CancellationToken cancellationToken)
    {
        var project = await context.Projects
            .FirstOrDefaultAsync(p => p.Id == request.ProjectId, cancellationToken)
            ?? throw new NotFoundException("Project", request.ProjectId);

        if (!Enum.TryParse<ProjectStatus>(request.Status, out var status))
            throw new BadRequestException("Invalid project status.");

        project.Update(
            request.Title,
            request.Description,
            request.RepositoryUrl,
            request.LiveUrl,
            null,
            status,
            request.DisplayOrder,
            request.Technologies);

        await context.SaveChangesAsync(cancellationToken);

        var dto = mapper.Map<ProjectDto>(project);
        return Response<ProjectDto>.Success(dto);
    }
}

public sealed class DeleteProjectCommandHandler(
    IApplicationDbContext context) : IRequestHandler<DeleteProjectCommand, Response<Unit>>
{
    public async Task<Response<Unit>> Handle(DeleteProjectCommand request, CancellationToken cancellationToken)
    {
        var project = await context.Projects
            .FirstOrDefaultAsync(p => p.Id == request.ProjectId, cancellationToken)
            ?? throw new NotFoundException("Project", request.ProjectId);

        context.Remove(project);
        await context.SaveChangesAsync(cancellationToken);

        return Response<Unit>.Success(Unit.Value);
    }
}

public sealed class GetProjectsByProfileIdQueryHandler(
    IApplicationDbContext context,
    IMapper mapper) : IRequestHandler<GetProjectsByProfileIdQuery, Response<IReadOnlyCollection<ProjectDto>>>
{
    public async Task<Response<IReadOnlyCollection<ProjectDto>>> Handle(GetProjectsByProfileIdQuery request, CancellationToken cancellationToken)
    {
        var projects = await context.Projects
            .Where(p => p.ProfileId == request.ProfileId)
            .OrderBy(p => p.DisplayOrder)
            .AsNoTracking()
            .ToListAsync(cancellationToken);

        var dtos = mapper.Map<IReadOnlyCollection<ProjectDto>>(projects);
        return Response<IReadOnlyCollection<ProjectDto>>.Success(dtos);
    }
}
