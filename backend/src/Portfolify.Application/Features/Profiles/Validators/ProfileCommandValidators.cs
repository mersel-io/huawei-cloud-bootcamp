using FluentValidation;
using Portfolify.Application.Features.Profiles.Commands;

namespace Portfolify.Application.Features.Profiles.Validators;

public sealed class CreateProfileCommandValidator : AbstractValidator<CreateProfileCommand>
{
    public CreateProfileCommandValidator()
    {
        RuleFor(x => x.UserId).NotEmpty();
        RuleFor(x => x.Slug)
            .NotEmpty().WithMessage("Slug is required.")
            .MaximumLength(100)
            .Matches(@"^[a-z0-9]+(?:-[a-z0-9]+)*$")
            .WithMessage("Slug must be lowercase alphanumeric with hyphens.");

        RuleFor(x => x.Title)
            .NotEmpty().WithMessage("Title is required.")
            .MaximumLength(200);

        RuleFor(x => x.Visibility)
            .NotEmpty()
            .Must(v => Enum.TryParse<Domain.Enums.ProfileVisibility>(v, out _))
            .WithMessage("Invalid visibility value.");
    }
}

public sealed class UpdateProfileCommandValidator : AbstractValidator<UpdateProfileCommand>
{
    public UpdateProfileCommandValidator()
    {
        RuleFor(x => x.ProfileId).NotEmpty();
        RuleFor(x => x.Title).NotEmpty().MaximumLength(200);
        RuleFor(x => x.Visibility)
            .NotEmpty()
            .Must(v => Enum.TryParse<Domain.Enums.ProfileVisibility>(v, out _))
            .WithMessage("Invalid visibility value.");
    }
}
