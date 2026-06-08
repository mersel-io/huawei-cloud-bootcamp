using MediatR;

namespace Portfolify.Application.Common;

public interface IQuery<out TResponse> : IRequest<TResponse>;
