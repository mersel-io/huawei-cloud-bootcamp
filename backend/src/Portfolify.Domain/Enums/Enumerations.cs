namespace Portfolify.Domain.Enums;

public enum UserRole
{
    Developer,
    Student,
    Admin
}

public enum ProfileVisibility
{
    Public,
    Private,
    Unlisted
}

public enum SocialPlatform
{
    GitHub,
    LinkedIn,
    Twitter,
    Blog,
    YouTube,
    Discord,
    StackOverflow,
    DevTo,
    Medium,
    Custom
}

public enum SkillLevel
{
    Beginner,
    Intermediate,
    Advanced,
    Expert
}

public enum ProjectStatus
{
    Active,
    Archived,
    Draft
}

public enum LinkType
{
    GitHub,
    LiveDemo,
    Documentation,
    Package,
    Other
}

public enum ContactStatus
{
    New,
    Read,
    Replied,
    Archived
}
