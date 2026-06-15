using MediatR;
using Microsoft.AspNetCore.Mvc;
using Portfolify.Application.Common;
using Portfolify.Application.DTOs;
using Portfolify.Application.Features.Experiences.Commands;
using Portfolify.Application.Features.Experiences.Queries;

namespace Portfolify.API.Controllers;

[ApiController]
[Route("api/experiences")]
public sealed class ExperiencesController : ControllerBase
{
    private readonly IMediator _mediator;

    public ExperiencesController(IMediator mediator) => _mediator = mediator;

    [HttpGet("profile/{profileId:guid}")]
    public async Task<ActionResult<Response<IReadOnlyCollection<ExperienceDto>>>> GetByProfileId(Guid profileId)
    {
        var result = await _mediator.Send(new GetExperiencesByProfileIdQuery(profileId));
        return Ok(result);
    }

    [HttpPost]
    public async Task<ActionResult<Response<ExperienceDto>>> Create([FromBody] CreateExperienceRequest request)
    {
        var command = new CreateExperienceCommand(
            request.ProfileId,
            request.Company,
            request.Position,
            request.StartDate,
            request.EndDate,
            request.IsCurrent,
            request.Description,
            request.Location,
            request.CompanyUrl);

        var result = await _mediator.Send(command);
        return Ok(result);
    }

    [HttpPut("{id:guid}")]
    public async Task<ActionResult<Response<ExperienceDto>>> Update(Guid id, [FromBody] UpdateExperienceRequest request)
    {
        var command = new UpdateExperienceCommand(
            id,
            request.Company,
            request.Position,
            request.StartDate,
            request.EndDate,
            request.IsCurrent,
            request.Description,
            request.Location,
            request.CompanyUrl,
            request.DisplayOrder);

        var result = await _mediator.Send(command);
        return Ok(result);
    }

    [HttpDelete("{id:guid}")]
    public async Task<ActionResult<Response<Unit>>> Delete(Guid id)
    {
        var result = await _mediator.Send(new DeleteExperienceCommand(id));
        return Ok(result);
    }
}
