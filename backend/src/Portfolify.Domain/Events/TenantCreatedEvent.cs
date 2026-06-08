using Portfolify.Domain.Common;

namespace Portfolify.Domain.Events;

public sealed record TenantCreatedEvent(Guid TenantId, string Name, string Slug) : DomainEvent;
