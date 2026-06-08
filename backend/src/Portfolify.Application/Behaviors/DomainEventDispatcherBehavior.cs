using MediatR;
using Portfolify.Domain.Common;
using Portfolify.Domain.Interfaces;

namespace Portfolify.Application.Behaviors;

public sealed class DomainEventDispatcherBehavior<TRequest, TResponse> : IPipelineBehavior<TRequest, TResponse>
    where TRequest : IRequest<TResponse>
{
    private readonly IDomainEventDispatcher _domainEventDispatcher;

    public DomainEventDispatcherBehavior(IDomainEventDispatcher domainEventDispatcher) =>
        _domainEventDispatcher = domainEventDispatcher;

    public async Task<TResponse> Handle(TRequest request, RequestHandlerDelegate<TResponse> next,
        CancellationToken cancellationToken)
    {
        var response = await next();

        return response;
    }
}
