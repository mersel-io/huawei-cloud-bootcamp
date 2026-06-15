using FluentValidation;
using Portfolify.Application.Features.Education.Commands;

namespace Portfolify.Application.Features.Education.Validators;

public sealed class CreateEducationCommandValidator : AbstractValidator<CreateEducationCommand>
{
    public CreateEducationCommandValidator()
    {
        RuleFor(x => x.ProfileId).NotEmpty();
        RuleFor(x => x.Institution).NotEmpty().MaximumLength(200);
        RuleFor(x => x.Degree).NotEmpty().MaximumLength(200);
        RuleFor(x => x.StartDate).NotEmpty();
        RuleFor(x => x.FieldOfStudy).MaximumLength(200);
        RuleFor(x => x.Description).MaximumLength(3000);
        RuleFor(x => x.Grade).MaximumLength(50);
    }
}

public sealed class UpdateEducationCommandValidator : AbstractValidator<UpdateEducationCommand>
{
    public UpdateEducationCommandValidator()
    {
        RuleFor(x => x.EducationId).NotEmpty();
        RuleFor(x => x.Institution).NotEmpty().MaximumLength(200);
        RuleFor(x => x.Degree).NotEmpty().MaximumLength(200);
        RuleFor(x => x.StartDate).NotEmpty();
    }
}
