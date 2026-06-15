using FluentValidation;
using Portfolify.Application.Features.ProfileLinks.Commands;

namespace Portfolify.Application.Features.ProfileLinks.Validators;

public sealed class CreateProfileLinkCommandValidator : AbstractValidator<CreateProfileLinkCommand>
{
    public CreateProfileLinkCommandValidator()
    {
        RuleFor(x => x.ProfileId).NotEmpty();
        RuleFor(x => x.Label).NotEmpty().MaximumLength(200);
        RuleFor(x => x.Url).NotEmpty().MaximumLength(500);
        RuleFor(x => x.Icon).MaximumLength(100);
    }
}

public sealed class UpdateProfileLinkCommandValidator : AbstractValidator<UpdateProfileLinkCommand>
{
    public UpdateProfileLinkCommandValidator()
    {
        RuleFor(x => x.ProfileLinkId).NotEmpty();
        RuleFor(x => x.Label).NotEmpty().MaximumLength(200);
        RuleFor(x => x.Url).NotEmpty().MaximumLength(500);
    }
}
