using MediatR;
using Microsoft.AspNetCore.Mvc;
using Portfolify.Application.Common;
using Portfolify.Application.DTOs;
using Portfolify.Application.Features.Education.Commands;
using Portfolify.Application.Features.Education.Queries;

namespace Portfolify.API.Controllers;

[ApiController]
[Route("api/education")]
public sealed class EducationController : ControllerBase
{
    private readonly IMediator _mediator;

    public EducationController(IMediator mediator) => _mediator = mediator;

    [HttpGet("profile/{profileId:guid}")]
    public async Task<ActionResult<Response<IReadOnlyCollection<EducationDto>>>> GetByProfileId(Guid profileId)
    {
        var result = await _mediator.Send(new GetEducationByProfileIdQuery(profileId));
        return Ok(result);
    }

    [HttpPost]
    public async Task<ActionResult<Response<EducationDto>>> Create([FromBody] CreateEducationRequest request)
    {
        var command = new CreateEducationCommand(
            request.ProfileId,
            request.Institution,
            request.Degree,
            request.StartDate,
            request.EndDate,
            request.IsCurrent,
            request.FieldOfStudy,
            request.Description,
            request.Grade);

        var result = await _mediator.Send(command);
        return Ok(result);
    }

    [HttpPut("{id:guid}")]
    public async Task<ActionResult<Response<EducationDto>>> Update(Guid id, [FromBody] UpdateEducationRequest request)
    {
        var command = new UpdateEducationCommand(
            id,
            request.Institution,
            request.Degree,
            request.StartDate,
            request.EndDate,
            request.IsCurrent,
            request.FieldOfStudy,
            request.Description,
            request.Grade,
            request.DisplayOrder);

        var result = await _mediator.Send(command);
        return Ok(result);
    }

    [HttpDelete("{id:guid}")]
    public async Task<ActionResult<Response<Unit>>> Delete(Guid id)
    {
        var result = await _mediator.Send(new DeleteEducationCommand(id));
        return Ok(result);
    }
}
