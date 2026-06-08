using Microsoft.AspNetCore.Mvc.ApplicationModels;

namespace Portfolify.API.Conventions;

public sealed class KebabCaseRouteConvention : IApplicationModelConvention
{
    public void Apply(ApplicationModel application)
    {
        foreach (var controller in application.Controllers)
        {
            foreach (var selector in controller.Selectors)
            {
                var template = selector.AttributeRouteModel?.Template;
                if (template is not null && template.Contains("[controller]"))
                {
                    selector.AttributeRouteModel.Template =
                        template.Replace("[controller]", ToKebabCase(controller.ControllerName));
                }
            }
        }
    }

    private static string ToKebabCase(string name)
    {
        if (string.IsNullOrEmpty(name)) return name;

        var span = name.AsSpan();
        var result = new System.Text.StringBuilder(name.Length + 4);

        for (var i = 0; i < span.Length; i++)
        {
            var c = span[i];
            if (char.IsUpper(c))
            {
                if (i > 0) result.Append('-');
                result.Append(char.ToLowerInvariant(c));
            }
            else
            {
                result.Append(c);
            }
        }

        return result.ToString();
    }
}
