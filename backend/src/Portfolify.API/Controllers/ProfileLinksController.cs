using MediatR;
using Microsoft.AspNetCore.Mvc;
using Portfolify.Application.Common;
using Portfolify.Application.DTOs;
using Portfolify.Application.Features.ProfileLinks.Commands;

namespace Portfolify.API.Controllers;

[ApiController]
[Route("api/profile-links")]
public sealed class ProfileLinksController : ControllerBase
{
    private readonly IMediator _mediator;

    public ProfileLinksController(IMediator mediator) => _mediator = mediator;

    [HttpPost]
    public async Task<ActionResult<Response<ProfileLinkDto>>> Create([FromBody] CreateProfileLinkRequest request)
    {
        var command = new CreateProfileLinkCommand(
            request.ProfileId,
            request.Label,
            request.Url,
            request.Icon);

        var result = await _mediator.Send(command);
        return Ok(result);
    }

    [HttpPut("{id:guid}")]
    public async Task<ActionResult<Response<ProfileLinkDto>>> Update(Guid id, [FromBody] UpdateProfileLinkRequest request)
    {
        var command = new UpdateProfileLinkCommand(
            id,
            request.Label,
            request.Url,
            request.Icon,
            request.DisplayOrder);

        var result = await _mediator.Send(command);
        return Ok(result);
    }

    [HttpDelete("{id:guid}")]
    public async Task<ActionResult<Response<Unit>>> Delete(Guid id)
    {
        var result = await _mediator.Send(new DeleteProfileLinkCommand(id));
        return Ok(result);
    }
}
