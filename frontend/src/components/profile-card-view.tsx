"use client";

import {
  ProfileDto,
  UserDto,
  SkillDto,
  ExperienceDto,
  EducationDto,
  ProjectDto,
} from "@/lib/types";
import {
  ExternalLink,
  Mail,
  Globe,
  Code2,
  Briefcase,
  Send,
  Zap,
  GraduationCap,
  FolderGit2,
  MapPin,
  Calendar,
} from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";

function getLinkIcon(icon: string | null, label: string) {
  const lowerIcon = (icon || "").toLowerCase();
  const lowerLabel = label.toLowerCase();
  if (lowerIcon.includes("github") || lowerLabel.includes("github"))
    return <Code2 className="h-4 w-4" />;
  if (lowerIcon.includes("linkedin") || lowerLabel.includes("linkedin"))
    return <Briefcase className="h-4 w-4" />;
  if (lowerIcon.includes("twitter") || lowerLabel.includes("twitter"))
    return <Send className="h-4 w-4" />;
  if (
    lowerIcon.includes("globe") ||
    lowerIcon.includes("website") ||
    lowerLabel.includes("website") ||
    lowerLabel.includes("blog")
  )
    return <Globe className="h-4 w-4" />;
  if (lowerIcon.includes("mail") || lowerIcon.includes("email"))
    return <Mail className="h-4 w-4" />;
  return <ExternalLink className="h-4 w-4" />;
}

function getInitials(firstName: string, lastName: string) {
  return `${firstName.charAt(0)}${lastName.charAt(0)}`.toUpperCase();
}

const LEVEL_LABELS: Record<string, string> = {
  Beginner: "Başlangıç",
  Intermediate: "Orta",
  Advanced: "İleri",
  Expert: "Uzman",
};

function levelColor(level: string) {
  switch (level) {
    case "Expert":
      return "border-primary/40 bg-primary/10 text-primary";
    case "Advanced":
      return "border-blue-500/40 bg-blue-500/10 text-blue-600 dark:text-blue-400";
    case "Intermediate":
      return "border-emerald-500/40 bg-emerald-500/10 text-emerald-600 dark:text-emerald-400";
    default:
      return "border-muted-foreground/30 bg-muted text-muted-foreground";
  }
}

function SkillsSection({ skills }: { skills: SkillDto[] }) {
  const sorted = [...skills].sort((a, b) => a.displayOrder - b.displayOrder);
  const grouped = sorted.reduce<Record<string, SkillDto[]>>((acc, s) => {
    const cat = s.category || "Diğer";
    (acc[cat] ??= []).push(s);
    return acc;
  }, {});

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-center gap-2">
        <Zap className="h-4 w-4 text-primary" />
        <h2 className="text-sm font-semibold uppercase tracking-wide text-muted-foreground">
          Yetenekler
        </h2>
      </div>
      {Object.entries(grouped).map(([category, items]) => (
        <div key={category}>
          <p className="mb-2 text-center text-xs font-medium text-muted-foreground">
            {category}
          </p>
          <div className="flex flex-wrap justify-center gap-2">
            {items.map((skill) => (
              <span
                key={skill.id}
                className={`inline-flex items-center gap-1.5 rounded-full border px-3 py-1 text-sm font-medium ${levelColor(
                  skill.level
                )}`}
              >
                {skill.name}
                <span className="text-xs opacity-70">
                  {LEVEL_LABELS[skill.level] || skill.level}
                </span>
              </span>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}

function formatDate(dateStr: string | null) {
  if (!dateStr) return null;
  const d = new Date(dateStr);
  if (isNaN(d.getTime())) return dateStr;
  return d.toLocaleDateString("tr-TR", { month: "short", year: "numeric" });
}

function ExperiencesSection({ experiences }: { experiences: ExperienceDto[] }) {
  const sorted = [...experiences].sort((a, b) => a.displayOrder - b.displayOrder);
  return (
    <div className="space-y-4">
      <div className="flex items-center justify-center gap-2">
        <Briefcase className="h-4 w-4 text-primary" />
        <h2 className="text-sm font-semibold uppercase tracking-wide text-muted-foreground">
          Deneyim
        </h2>
      </div>
      <div className="space-y-4">
        {sorted.map((exp) => (
          <div key={exp.id} className="text-center sm:text-left">
            <p className="font-semibold">{exp.position}</p>
            <p className="text-sm text-muted-foreground">
              {exp.companyUrl ? (
                <a
                  href={exp.companyUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-primary hover:underline"
                >
                  {exp.company}
                </a>
              ) : (
                exp.company
              )}
            </p>
            <div className="mt-0.5 flex flex-wrap items-center justify-center gap-x-3 gap-y-0.5 text-xs text-muted-foreground">
              <span className="inline-flex items-center gap-0.5">
                <Calendar className="h-3 w-3" />
                {formatDate(exp.startDate)}
                {" — "}
                {exp.isCurrent ? "Devam ediyor" : formatDate(exp.endDate) || ""}
              </span>
              {exp.location && (
                <span className="inline-flex items-center gap-0.5">
                  <MapPin className="h-3 w-3" />
                  {exp.location}
                </span>
              )}
            </div>
            {exp.description && (
              <p className="mt-1 text-sm leading-relaxed text-muted-foreground">
                {exp.description}
              </p>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}

function EducationSection({ education }: { education: EducationDto[] }) {
  const sorted = [...education].sort((a, b) => a.displayOrder - b.displayOrder);
  return (
    <div className="space-y-4">
      <div className="flex items-center justify-center gap-2">
        <GraduationCap className="h-4 w-4 text-primary" />
        <h2 className="text-sm font-semibold uppercase tracking-wide text-muted-foreground">
          Eğitim
        </h2>
      </div>
      <div className="space-y-4">
        {sorted.map((edu) => (
          <div key={edu.id} className="text-center sm:text-left">
            <p className="font-semibold">{edu.institution}</p>
            <p className="text-sm text-muted-foreground">
              {edu.degree}
              {edu.fieldOfStudy ? ` · ${edu.fieldOfStudy}` : ""}
            </p>
            <div className="mt-0.5 flex items-center justify-center gap-x-3 text-xs text-muted-foreground sm:justify-start">
              <span className="inline-flex items-center gap-0.5">
                <Calendar className="h-3 w-3" />
                {formatDate(edu.startDate)}
                {" — "}
                {edu.isCurrent ? "Devam ediyor" : formatDate(edu.endDate) || ""}
              </span>
            </div>
            {edu.description && (
              <p className="mt-1 text-sm leading-relaxed text-muted-foreground">
                {edu.description}
              </p>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}

function ProjectsSection({ projects }: { projects: ProjectDto[] }) {
  const sorted = [...projects].sort((a, b) => a.displayOrder - b.displayOrder);
  return (
    <div className="space-y-4">
      <div className="flex items-center justify-center gap-2">
        <FolderGit2 className="h-4 w-4 text-primary" />
        <h2 className="text-sm font-semibold uppercase tracking-wide text-muted-foreground">
          Projeler
        </h2>
      </div>
      <div className="space-y-4">
        {sorted.map((proj) => (
          <div key={proj.id} className="text-center sm:text-left">
            <div className="flex items-center justify-center gap-2 sm:justify-start">
              <p className="font-semibold">{proj.title}</p>
              {proj.status !== "Active" && (
                <Badge variant="outline" className="text-xs">
                  {proj.status === "Archived" ? "Arşivlendi" : "Taslak"}
                </Badge>
              )}
            </div>
            {proj.description && (
              <p className="mt-1 text-sm leading-relaxed text-muted-foreground">
                {proj.description}
              </p>
            )}
            {proj.technologies && (
              <div className="mt-1.5 flex flex-wrap justify-center gap-1 sm:justify-start">
                {proj.technologies.split(",").map((tech, i) => (
                  <Badge key={i} variant="secondary" className="text-xs">
                    {tech.trim()}
                  </Badge>
                ))}
              </div>
            )}
            <div className="mt-1.5 flex items-center justify-center gap-3 sm:justify-start">
              {proj.repositoryUrl && (
                <a
                  href={proj.repositoryUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1 text-xs text-primary hover:underline"
                >
                  <Code2 className="h-3 w-3" />
                  Kod
                </a>
              )}
              {proj.liveUrl && (
                <a
                  href={proj.liveUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1 text-xs text-primary hover:underline"
                >
                  <ExternalLink className="h-3 w-3" />
                  Canlı
                </a>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export function ProfileCardView({
  profile,
  user,
}: {
  profile: ProfileDto;
  user: UserDto | null;
}) {
  const sortedLinks = [...(profile.links || [])].sort(
    (a, b) => a.displayOrder - b.displayOrder
  );

  return (
    <div className="min-h-[calc(100vh-8rem)] flex items-center justify-center p-4 sm:p-8">
      <Card className="w-full max-w-lg overflow-hidden">
        <div className="h-32 bg-gradient-to-br from-primary/80 to-primary/40" />
        <CardContent className="relative px-6 pb-8 pt-0">
          <div className="-mt-16 mb-4 flex flex-col items-center">
            <Avatar className="h-28 w-28 border-4 border-background shadow-lg">
              {user?.avatarUrl ? (
                <AvatarImage src={user.avatarUrl} alt={user.firstName} />
              ) : null}
              <AvatarFallback className="text-2xl font-semibold bg-primary/10 text-primary">
                {user
                  ? getInitials(user.firstName, user.lastName)
                  : profile.title.charAt(0).toUpperCase()}
              </AvatarFallback>
            </Avatar>
          </div>

          <div className="text-center">
            <h1 className="text-2xl font-bold">
              {user
                ? `${user.firstName} ${user.lastName}`
                : profile.title}
            </h1>
            {profile.subtitle && (
              <p className="mt-1 text-muted-foreground">{profile.subtitle}</p>
            )}
            {user?.role && (
              <Badge variant="secondary" className="mt-2">
                {user.role === "Developer"
                  ? "Geliştirici"
                  : user.role === "Student"
                  ? "Öğrenci"
                  : user.role}
              </Badge>
            )}
          </div>

          {(profile.bio || user?.bio) && (
            <>
              <Separator className="my-5" />
              <p className="text-center text-sm leading-relaxed text-muted-foreground">
                {profile.bio || user?.bio}
              </p>
            </>
          )}

          {profile.skills && profile.skills.length > 0 && (
            <>
              <Separator className="my-5" />
              <SkillsSection skills={profile.skills} />
            </>
          )}

          {profile.experiences && profile.experiences.length > 0 && (
            <>
              <Separator className="my-5" />
              <ExperiencesSection experiences={profile.experiences} />
            </>
          )}

          {profile.education && profile.education.length > 0 && (
            <>
              <Separator className="my-5" />
              <EducationSection education={profile.education} />
            </>
          )}

          {profile.projects && profile.projects.length > 0 && (
            <>
              <Separator className="my-5" />
              <ProjectsSection projects={profile.projects} />
            </>
          )}

          {sortedLinks.length > 0 && (
            <>
              <Separator className="my-5" />
              <div className="flex flex-col gap-2">
                {sortedLinks.map((link) => (
                  <a
                    key={link.id}
                    href={link.url}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <Button
                      variant="outline"
                      className="w-full justify-start gap-3"
                    >
                      {getLinkIcon(link.icon, link.label)}
                      <span className="flex-1 text-left">{link.label}</span>
                      <ExternalLink className="h-3 w-3 text-muted-foreground" />
                    </Button>
                  </a>
                ))}
              </div>
            </>
          )}

          <Separator className="my-5" />
          <p className="text-center text-xs text-muted-foreground">
            Powered by{" "}
            <span className="font-semibold text-primary">Portfolify</span>
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
