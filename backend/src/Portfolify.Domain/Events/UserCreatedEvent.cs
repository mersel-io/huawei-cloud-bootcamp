using Portfolify.Domain.Common;

namespace Portfolify.Domain.Events;

public sealed record UserCreatedEvent(Guid UserId) : DomainEvent;
