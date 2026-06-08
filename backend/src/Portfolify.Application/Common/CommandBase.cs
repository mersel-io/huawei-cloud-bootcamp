using MediatR;

namespace Portfolify.Application.Common;

public interface ICommand<out TResponse> : IRequest<TResponse>;

public interface ICommand : IRequest<Unit>;
