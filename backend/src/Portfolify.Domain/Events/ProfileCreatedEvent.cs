using Portfolify.Domain.Common;

namespace Portfolify.Domain.Events;

public sealed record ProfileCreatedEvent(Guid ProfileId, Guid UserId, Guid TenantId) : DomainEvent;
