using FluentValidation;
using Portfolify.Application.Features.Skills.Commands;

namespace Portfolify.Application.Features.Skills.Validators;

public sealed class CreateSkillCommandValidator : AbstractValidator<CreateSkillCommand>
{
    public CreateSkillCommandValidator()
    {
        RuleFor(x => x.ProfileId).NotEmpty();
        RuleFor(x => x.Name)
            .NotEmpty().WithMessage("Skill name is required.")
            .MaximumLength(100);
        RuleFor(x => x.Level)
            .NotEmpty().WithMessage("Skill level is required.")
            .Must(l => Enum.TryParse<Domain.Enums.SkillLevel>(l, out _))
            .WithMessage("Invalid skill level. Valid values: Beginner, Intermediate, Advanced, Expert.");
        RuleFor(x => x.Category).MaximumLength(100);
    }
}

public sealed class UpdateSkillCommandValidator : AbstractValidator<UpdateSkillCommand>
{
    public UpdateSkillCommandValidator()
    {
        RuleFor(x => x.SkillId).NotEmpty();
        RuleFor(x => x.Name)
            .NotEmpty().WithMessage("Skill name is required.")
            .MaximumLength(100);
        RuleFor(x => x.Level)
            .NotEmpty().WithMessage("Skill level is required.")
            .Must(l => Enum.TryParse<Domain.Enums.SkillLevel>(l, out _))
            .WithMessage("Invalid skill level. Valid values: Beginner, Intermediate, Advanced, Expert.");
        RuleFor(x => x.Category).MaximumLength(100);
    }
}
