using Portfolify.Domain.Common;

namespace Portfolify.Domain.Events;

public sealed record ContactMessageReceivedEvent(
    Guid MessageId,
    Guid ProfileId,
    string SenderName,
    string SenderEmail) : DomainEvent;
