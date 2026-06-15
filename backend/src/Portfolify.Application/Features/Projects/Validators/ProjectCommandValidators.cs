using FluentValidation;
using Portfolify.Application.Features.Projects.Commands;

namespace Portfolify.Application.Features.Projects.Validators;

public sealed class CreateProjectCommandValidator : AbstractValidator<CreateProjectCommand>
{
    public CreateProjectCommandValidator()
    {
        RuleFor(x => x.ProfileId).NotEmpty();
        RuleFor(x => x.Title).NotEmpty().MaximumLength(200);
        RuleFor(x => x.Description).MaximumLength(5000);
        RuleFor(x => x.RepositoryUrl).MaximumLength(500);
        RuleFor(x => x.LiveUrl).MaximumLength(500);
        RuleFor(x => x.Technologies).MaximumLength(1000);
        RuleFor(x => x.Status)
            .NotEmpty()
            .Must(s => Enum.TryParse<Domain.Enums.ProjectStatus>(s, out _))
            .WithMessage("Invalid project status. Valid values: Active, Archived, Draft.");
    }
}

public sealed class UpdateProjectCommandValidator : AbstractValidator<UpdateProjectCommand>
{
    public UpdateProjectCommandValidator()
    {
        RuleFor(x => x.ProjectId).NotEmpty();
        RuleFor(x => x.Title).NotEmpty().MaximumLength(200);
        RuleFor(x => x.Description).MaximumLength(5000);
        RuleFor(x => x.Status)
            .NotEmpty()
            .Must(s => Enum.TryParse<Domain.Enums.ProjectStatus>(s, out _))
            .WithMessage("Invalid project status.");
    }
}
