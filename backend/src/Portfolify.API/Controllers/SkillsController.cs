using MediatR;
using Microsoft.AspNetCore.Mvc;
using Portfolify.Application.Common;
using Portfolify.Application.DTOs;
using Portfolify.Application.Features.Skills.Commands;
using Portfolify.Application.Features.Skills.Queries;

namespace Portfolify.API.Controllers;

[ApiController]
[Route("api/skills")]
public sealed class SkillsController : ControllerBase
{
    private readonly IMediator _mediator;

    public SkillsController(IMediator mediator) => _mediator = mediator;

    [HttpGet("profile/{profileId:guid}")]
    public async Task<ActionResult<Response<IReadOnlyCollection<SkillDto>>>> GetByProfileId(Guid profileId)
    {
        var result = await _mediator.Send(new GetSkillsByProfileIdQuery(profileId));
        return Ok(result);
    }

    [HttpPost]
    public async Task<ActionResult<Response<SkillDto>>> Create([FromBody] CreateSkillRequest request)
    {
        var command = new CreateSkillCommand(
            request.ProfileId,
            request.Name,
            request.Level,
            request.Category);

        var result = await _mediator.Send(command);
        return Ok(result);
    }

    [HttpPut("{id:guid}")]
    public async Task<ActionResult<Response<SkillDto>>> Update(Guid id, [FromBody] UpdateSkillRequest request)
    {
        var command = new UpdateSkillCommand(
            id,
            request.Name,
            request.Level,
            request.Category,
            request.DisplayOrder);

        var result = await _mediator.Send(command);
        return Ok(result);
    }

    [HttpDelete("{id:guid}")]
    public async Task<ActionResult<Response<Unit>>> Delete(Guid id)
    {
        var result = await _mediator.Send(new DeleteSkillCommand(id));
        return Ok(result);
    }
}
