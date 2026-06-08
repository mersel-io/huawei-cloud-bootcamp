using Portfolify.Domain.Common;
using Portfolify.Domain.Enums;

namespace Portfolify.Domain.Entities;

public sealed class ContactMessage : AggregateRoot, IAuditableEntity, ITenantEntity
{
    public Guid ProfileId { get; private set; }
    public string SenderName { get; private set; } = null!;
    public string SenderEmail { get; private set; } = null!;
    public string Subject { get; private set; } = null!;
    public string Message { get; private set; } = null!;
    public ContactStatus Status { get; private set; }
    public string? SenderIpAddress { get; private set; }
    public DateTime? ReadAtUtc { get; private set; }
    public DateTime? RepliedAtUtc { get; private set; }

    public Guid TenantId { get; set; }
    DateTime IAuditableEntity.CreatedAtUtc { get; set; }
    DateTime? IAuditableEntity.UpdatedAtUtc { get; set; }

    public Profile Profile { get; private set; } = null!;

    private ContactMessage() { }

    public static ContactMessage Create(
        Guid profileId,
        string senderName,
        string senderEmail,
        string subject,
        string message,
        Guid tenantId,
        string? senderIpAddress = null)
    {
        if (string.IsNullOrWhiteSpace(senderName))
            throw new DomainException("Sender name cannot be empty.");
        if (string.IsNullOrWhiteSpace(senderEmail))
            throw new DomainException("Sender email cannot be empty.");
        if (string.IsNullOrWhiteSpace(subject))
            throw new DomainException("Subject cannot be empty.");
        if (string.IsNullOrWhiteSpace(message))
            throw new DomainException("Message cannot be empty.");

        senderEmail = senderEmail.Trim().ToLowerInvariant();
        if (!System.Text.RegularExpressions.Regex.IsMatch(
                senderEmail,
                @"^[^@\s]+@[^@\s]+\.[^@\s]+$",
                System.Text.RegularExpressions.RegexOptions.IgnoreCase))
            throw new DomainException("Sender email is invalid.");

        if (message.Trim().Length > 5000)
            throw new DomainException("Message is too long. Maximum length is 5000 characters.");

        return new ContactMessage
        {
            Id = Guid.NewGuid(),
            ProfileId = profileId,
            SenderName = senderName.Trim(),
            SenderEmail = senderEmail,
            Subject = subject.Trim(),
            Message = message.Trim(),
            Status = ContactStatus.New,
            SenderIpAddress = senderIpAddress?.Trim(),
            TenantId = tenantId,
            CreatedAtUtc = DateTime.UtcNow
        };
    }

    public void MarkAsRead()
    {
        if (Status == ContactStatus.New)
        {
            Status = ContactStatus.Read;
            ReadAtUtc = DateTime.UtcNow;
        }
    }

    public void MarkAsReplied()
    {
        Status = ContactStatus.Replied;
        RepliedAtUtc = DateTime.UtcNow;
    }

    public void Archive()
    {
        Status = ContactStatus.Archived;
    }
}
