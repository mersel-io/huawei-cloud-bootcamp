using MediatR;
using Microsoft.AspNetCore.Mvc;
using Portfolify.Application.Common;
using Portfolify.Application.DTOs;
using Portfolify.Application.Features.Profiles.Commands;
using Portfolify.Application.Features.Profiles.Queries;

namespace Portfolify.API.Controllers;

[ApiController]
[Route("api/[controller]")]
public sealed class ProfilesController : ControllerBase
{
    private readonly IMediator _mediator;

    public ProfilesController(IMediator mediator) => _mediator = mediator;

    [HttpGet("{id:guid}")]
    public async Task<ActionResult<Response<ProfileDto>>> GetById(Guid id)
    {
        var result = await _mediator.Send(new GetProfileByIdQuery(id));
        return Ok(result);
    }

    [HttpGet("slug/{slug}")]
    public async Task<ActionResult<Response<ProfileDto>>> GetBySlug(string slug)
    {
        var result = await _mediator.Send(new GetProfileBySlugQuery(slug));
        return Ok(result);
    }

    [HttpGet("user/{userId:guid}")]
    public async Task<ActionResult<PagedResponse<ProfileDto>>> GetByUserId(
        Guid userId,
        [FromQuery] int pageNumber = 1,
        [FromQuery] int pageSize = 20)
    {
        var result = await _mediator.Send(new GetProfilesByUserIdQuery(userId, pageNumber, pageSize));
        return Ok(result);
    }

    [HttpPost]
    public async Task<ActionResult<Response<ProfileDto>>> Create([FromBody] CreateProfileRequest request)
    {
        var command = new CreateProfileCommand(
            request.UserId,
            request.Slug,
            request.Title,
            request.Subtitle,
            request.Bio,
            request.Visibility);

        var result = await _mediator.Send(command);
        return CreatedAtAction(nameof(GetById), new { id = result.Data!.Id }, result);
    }

    [HttpPut("{id:guid}")]
    public async Task<ActionResult<Response<ProfileDto>>> Update(Guid id, [FromBody] UpdateProfileRequest request)
    {
        var command = new UpdateProfileCommand(
            id,
            request.Title,
            request.Subtitle,
            request.Bio,
            request.Visibility,
            request.Theme);

        var result = await _mediator.Send(command);
        return Ok(result);
    }

    [HttpDelete("{id:guid}")]
    public async Task<ActionResult<Response<Unit>>> Delete(Guid id)
    {
        var result = await _mediator.Send(new DeleteProfileCommand(id));
        return Ok(result);
    }
}
