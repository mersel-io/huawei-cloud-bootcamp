using MediatR;
using Microsoft.AspNetCore.Mvc;
using Portfolify.Application.Common;
using Portfolify.Application.DTOs;
using Portfolify.Application.Features.Projects.Commands;
using Portfolify.Application.Features.Projects.Queries;

namespace Portfolify.API.Controllers;

[ApiController]
[Route("api/projects")]
public sealed class ProjectsController : ControllerBase
{
    private readonly IMediator _mediator;

    public ProjectsController(IMediator mediator) => _mediator = mediator;

    [HttpGet("profile/{profileId:guid}")]
    public async Task<ActionResult<Response<IReadOnlyCollection<ProjectDto>>>> GetByProfileId(Guid profileId)
    {
        var result = await _mediator.Send(new GetProjectsByProfileIdQuery(profileId));
        return Ok(result);
    }

    [HttpPost]
    public async Task<ActionResult<Response<ProjectDto>>> Create([FromBody] CreateProjectRequest request)
    {
        var command = new CreateProjectCommand(
            request.ProfileId,
            request.Title,
            request.Description,
            request.RepositoryUrl,
            request.LiveUrl,
            request.Technologies,
            request.Status);

        var result = await _mediator.Send(command);
        return Ok(result);
    }

    [HttpPut("{id:guid}")]
    public async Task<ActionResult<Response<ProjectDto>>> Update(Guid id, [FromBody] UpdateProjectRequest request)
    {
        var command = new UpdateProjectCommand(
            id,
            request.Title,
            request.Description,
            request.RepositoryUrl,
            request.LiveUrl,
            request.Technologies,
            request.Status,
            request.DisplayOrder);

        var result = await _mediator.Send(command);
        return Ok(result);
    }

    [HttpDelete("{id:guid}")]
    public async Task<ActionResult<Response<Unit>>> Delete(Guid id)
    {
        var result = await _mediator.Send(new DeleteProjectCommand(id));
        return Ok(result);
    }
}
