using MediatR;
using Microsoft.AspNetCore.Mvc;
using Portfolify.Application.Common;
using Portfolify.Application.DTOs;
using Portfolify.Application.Features.Profiles.Commands;
using Portfolify.Application.Features.Profiles.Queries;

namespace Portfolify.API.Controllers;

[ApiController]
[Route("api/health")]
public sealed class HealthController : ControllerBase
{
    [HttpGet]
    public IActionResult Get() => Ok(new { Status = "Healthy", Timestamp = DateTime.UtcNow });
}
