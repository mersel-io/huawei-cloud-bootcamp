using Portfolify.Domain.Common;

namespace Portfolify.Domain.Events;

public sealed record ProfilePublishedEvent(Guid ProfileId, string Slug) : DomainEvent;
