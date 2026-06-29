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
  Share2,
  ArrowUpRight,
  Link2,
} from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { toast } from "sonner";
import { cn } from "@/lib/utils";

function getLinkIcon(icon: string | null, label: string) {
  const lowerIcon = (icon || "").toLowerCase();
  const lowerLabel = label.toLowerCase();
  if (lowerIcon.includes("github") || lowerLabel.includes("github"))
    return <Code2 className="size-4" />;
  if (lowerIcon.includes("linkedin") || lowerLabel.includes("linkedin"))
    return <Briefcase className="size-4" />;
  if (lowerIcon.includes("twitter") || lowerLabel.includes("twitter"))
    return <Send className="size-4" />;
  if (
    lowerIcon.includes("globe") ||
    lowerIcon.includes("website") ||
    lowerLabel.includes("website") ||
    lowerLabel.includes("blog")
  )
    return <Globe className="size-4" />;
  if (lowerIcon.includes("mail") || lowerIcon.includes("email"))
    return <Mail className="size-4" />;
  return <ExternalLink className="size-4" />;
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
      return "border-primary/30 bg-primary/10 text-primary";
    case "Advanced":
      return "border-blue-500/30 bg-blue-500/10 text-blue-600 dark:text-blue-400";
    case "Intermediate":
      return "border-emerald-500/30 bg-emerald-500/10 text-emerald-600 dark:text-emerald-400";
    default:
      return "border-border bg-muted text-muted-foreground";
  }
}

function formatDate(dateStr: string | null) {
  if (!dateStr) return null;
  const d = new Date(dateStr);
  if (isNaN(d.getTime())) return dateStr;
  return d.toLocaleDateString("tr-TR", { month: "short", year: "numeric" });
}

function Reveal({
  delay = "delay-0",
  className,
  children,
}: {
  delay?: string;
  className?: string;
  children: React.ReactNode;
}) {
  return (
    <div
      className={cn(
        "animate-in fade-in-0 slide-in-from-bottom-4 animation-duration-500 fill-mode-both",
        delay,
        className
      )}
    >
      {children}
    </div>
  );
}

function SectionHeader({
  icon,
  title,
}: {
  icon: React.ReactNode;
  title: string;
}) {
  return (
    <div className="flex items-center gap-2.5">
      <span className="flex size-9 shrink-0 items-center justify-center rounded-xl bg-primary/10 text-primary ring-1 ring-inset ring-primary/20">
        {icon}
      </span>
      <CardTitle className="text-base font-semibold">{title}</CardTitle>
    </div>
  );
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
      {Object.entries(grouped).map(([category, items]) => (
        <div key={category}>
          <p className="mb-2.5 text-xs font-medium uppercase tracking-wide text-muted-foreground">
            {category}
          </p>
          <div className="flex flex-wrap gap-2">
            {items.map((skill) => (
              <span
                key={skill.id}
                className={cn(
                  "inline-flex items-center gap-1.5 rounded-full border px-2.5 py-1 text-sm font-medium",
                  levelColor(skill.level)
                )}
              >
                {skill.name}
                <span className="text-[10px] font-normal opacity-70">
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

function Timeline({ children }: { children: React.ReactNode }) {
  return (
    <div className="relative space-y-6">
      <span
        className="absolute left-[5px] top-2 bottom-2 w-px bg-border"
        aria-hidden
      />
      {children}
    </div>
  );
}

function ExperiencesSection({ experiences }: { experiences: ExperienceDto[] }) {
  const sorted = [...experiences].sort((a, b) => a.displayOrder - b.displayOrder);
  return (
    <Timeline>
      {sorted.map((exp) => (
        <div key={exp.id} className="relative flex gap-4">
          <span className="relative z-10 mt-1 size-[11px] shrink-0 rounded-full bg-primary ring-4 ring-background" />
          <div className="min-w-0 flex-1">
            <div className="flex flex-wrap items-center justify-between gap-x-2 gap-y-1">
              <p className="font-semibold leading-snug">{exp.position}</p>
              {exp.isCurrent && (
                <Badge className="border-transparent bg-emerald-500/15 text-emerald-600 dark:text-emerald-400">
                  Devam ediyor
                </Badge>
              )}
            </div>
            <p className="text-sm text-muted-foreground">
              {exp.companyUrl ? (
                <a
                  href={exp.companyUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1 hover:text-primary hover:underline"
                >
                  {exp.company}
                  <ArrowUpRight className="size-3" />
                </a>
              ) : (
                exp.company
              )}
            </p>
            <div className="mt-1 flex flex-wrap items-center gap-x-3 gap-y-1 text-xs text-muted-foreground">
              <span className="inline-flex items-center gap-1">
                <Calendar className="size-3" />
                {formatDate(exp.startDate)}
                {" — "}
                {exp.isCurrent ? "Devam ediyor" : formatDate(exp.endDate) || ""}
              </span>
              {exp.location && (
                <span className="inline-flex items-center gap-1">
                  <MapPin className="size-3" />
                  {exp.location}
                </span>
              )}
            </div>
            {exp.description && (
              <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
                {exp.description}
              </p>
            )}
          </div>
        </div>
      ))}
    </Timeline>
  );
}

function EducationSection({ education }: { education: EducationDto[] }) {
  const sorted = [...education].sort((a, b) => a.displayOrder - b.displayOrder);
  return (
    <Timeline>
      {sorted.map((edu) => (
        <div key={edu.id} className="relative flex gap-4">
          <span className="relative z-10 mt-1 size-[11px] shrink-0 rounded-full bg-primary ring-4 ring-background" />
          <div className="min-w-0 flex-1">
            <p className="font-semibold leading-snug">{edu.institution}</p>
            <p className="text-sm text-muted-foreground">
              {edu.degree}
              {edu.fieldOfStudy ? ` · ${edu.fieldOfStudy}` : ""}
            </p>
            <div className="mt-1 flex items-center gap-1 text-xs text-muted-foreground">
              <Calendar className="size-3" />
              {formatDate(edu.startDate)}
              {" — "}
              {edu.isCurrent ? "Devam ediyor" : formatDate(edu.endDate) || ""}
            </div>
            {edu.description && (
              <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
                {edu.description}
              </p>
            )}
          </div>
        </div>
      ))}
    </Timeline>
  );
}

function ProjectsSection({ projects }: { projects: ProjectDto[] }) {
  const sorted = [...projects].sort((a, b) => a.displayOrder - b.displayOrder);
  return (
    <div className="grid gap-4 sm:grid-cols-2">
      {sorted.map((proj) => {
        const techs = proj.technologies
          ?.split(",")
          .map((t) => t.trim())
          .filter(Boolean);
        return (
          <div
            key={proj.id}
            className="group flex flex-col overflow-hidden rounded-xl border bg-card transition-all hover:-translate-y-0.5 hover:border-primary/30 hover:shadow-lg hover:shadow-primary/10"
          >
            <div className="aspect-video overflow-hidden bg-muted">
              {proj.imageUrl ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  src={proj.imageUrl}
                  alt={proj.title}
                  loading="lazy"
                  className="size-full object-cover transition-transform duration-300 group-hover:scale-105"
                />
              ) : (
                <div className="flex size-full items-center justify-center bg-gradient-to-br from-primary/15 via-primary/5 to-transparent">
                  <FolderGit2 className="size-8 text-primary/40" />
                </div>
              )}
            </div>
            <div className="flex flex-1 flex-col p-4">
              <div className="flex items-start justify-between gap-2">
                <p className="font-semibold leading-snug">{proj.title}</p>
                {proj.status !== "Active" && (
                  <Badge variant="outline" className="shrink-0">
                    {proj.status === "Archived" ? "Arşivlendi" : "Taslak"}
                  </Badge>
                )}
              </div>
              {proj.description && (
                <p className="mt-1 text-sm leading-relaxed text-muted-foreground">
                  {proj.description}
                </p>
              )}
              {techs && techs.length > 0 && (
                <div className="mt-3 flex flex-wrap gap-1.5">
                  {techs.map((tech, i) => (
                    <Badge key={i} variant="secondary" className="font-normal">
                      {tech}
                    </Badge>
                  ))}
                </div>
              )}
              <div className="mt-auto flex items-center gap-4 pt-4">
                {proj.repositoryUrl && (
                  <a
                    href={proj.repositoryUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1 text-xs font-medium text-muted-foreground transition-colors hover:text-primary"
                  >
                    <Code2 className="size-3.5" />
                    Kaynak Kod
                  </a>
                )}
                {proj.liveUrl && (
                  <a
                    href={proj.liveUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1 text-xs font-medium text-muted-foreground transition-colors hover:text-primary"
                  >
                    <ArrowUpRight className="size-3.5" />
                    Canlı Demo
                  </a>
                )}
              </div>
            </div>
          </div>
        );
      })}
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

  const handleShare = () => {
    if (typeof window !== "undefined") {
      navigator.clipboard.writeText(window.location.href);
      toast.success("Profil linki kopyalandı!");
    }
  };

  const displayName = user
    ? `${user.firstName} ${user.lastName}`
    : profile.title;

  return (
    <div className="relative min-h-[calc(100vh-4rem)]">
      <div className="pointer-events-none absolute inset-0 -z-10 overflow-hidden">
        <div className="absolute -top-40 left-1/2 h-[32rem] w-[32rem] -translate-x-1/2 rounded-full bg-primary/15 blur-[130px] dark:bg-primary/10" />
        <div className="absolute top-1/3 -right-32 h-96 w-96 rounded-full bg-violet-500/10 blur-[120px]" />
        <div className="absolute -bottom-20 -left-32 h-96 w-96 rounded-full bg-fuchsia-500/10 blur-[120px]" />
      </div>

      <div className="mx-auto max-w-5xl px-4 py-8 sm:px-6 lg:py-12">
        {/* Hero */}
        <Reveal>
          <div className="overflow-hidden rounded-3xl bg-card text-card-foreground shadow-xl shadow-primary/5 ring-1 ring-foreground/10">
            <div className="relative h-32 bg-gradient-to-br from-primary via-primary/80 to-violet-500 sm:h-40">
              <div
                className="absolute inset-0 opacity-20"
                style={{
                  backgroundImage:
                    "radial-gradient(circle at 1px 1px, white 1px, transparent 0)",
                  backgroundSize: "24px 24px",
                }}
              />
              <Button
                variant="secondary"
                size="icon-sm"
                className="absolute top-3 right-3 backdrop-blur-sm"
                onClick={handleShare}
              >
                <Share2 className="size-4" />
              </Button>
            </div>
            <div className="px-5 pb-6 sm:px-7">
              <div className="-mt-14 flex flex-col gap-4 sm:-mt-16 sm:flex-row sm:items-end">
                <Avatar className="size-24 border-4 border-card shadow-lg sm:size-28">
                  {user?.avatarUrl ? (
                    <AvatarImage src={user.avatarUrl} alt={user.firstName} />
                  ) : null}
                  <AvatarFallback className="bg-primary/10 text-2xl font-semibold text-primary">
                    {user
                      ? getInitials(user.firstName, user.lastName)
                      : profile.title.charAt(0).toUpperCase()}
                  </AvatarFallback>
                </Avatar>
                <div className="flex-1 pb-1">
                  <div className="flex flex-wrap items-center gap-2">
                    <h1 className="text-2xl font-bold tracking-tight sm:text-3xl">
                      {displayName}
                    </h1>
                    {user?.role && (
                      <Badge variant="secondary">
                        {user.role === "Developer"
                          ? "Geliştirici"
                          : user.role === "Student"
                          ? "Öğrenci"
                          : user.role}
                      </Badge>
                    )}
                  </div>
                  {profile.subtitle && (
                    <p className="mt-1 text-muted-foreground">
                      {profile.subtitle}
                    </p>
                  )}
                </div>
              </div>
              {(profile.bio || user?.bio) && (
                <p className="mt-5 max-w-2xl text-sm leading-relaxed text-muted-foreground">
                  {profile.bio || user?.bio}
                </p>
              )}
            </div>
          </div>
        </Reveal>

        {/* Content */}
        <div className="mt-6 grid gap-6 lg:grid-cols-[300px_minmax(0,1fr)] lg:items-start">
          {/* Sidebar */}
          <aside className="space-y-6 lg:sticky lg:top-20">
            {sortedLinks.length > 0 && (
              <Reveal delay="delay-75">
                <Card>
                  <CardHeader>
                    <SectionHeader
                      icon={<Link2 className="size-4" />}
                      title="İletişim"
                    />
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-2">
                      {sortedLinks.map((link) => (
                        <a
                          key={link.id}
                          href={link.url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="group flex items-center gap-3 rounded-xl border bg-card p-3 transition-all hover:border-primary/40 hover:bg-primary/[0.04] hover:shadow-sm"
                        >
                          <span className="flex size-9 shrink-0 items-center justify-center rounded-lg bg-muted text-muted-foreground transition-colors group-hover:bg-primary group-hover:text-primary-foreground">
                            {getLinkIcon(link.icon, link.label)}
                          </span>
                          <span className="flex-1 truncate text-sm font-medium">
                            {link.label}
                          </span>
                          <ArrowUpRight className="size-4 shrink-0 text-muted-foreground transition-all group-hover:translate-x-0.5 group-hover:text-primary" />
                        </a>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </Reveal>
            )}

            {profile.skills && profile.skills.length > 0 && (
              <Reveal delay="delay-150">
                <Card>
                  <CardHeader>
                    <SectionHeader
                      icon={<Zap className="size-4" />}
                      title="Yetenekler"
                    />
                  </CardHeader>
                  <CardContent>
                    <SkillsSection skills={profile.skills} />
                  </CardContent>
                </Card>
              </Reveal>
            )}
          </aside>

          {/* Main */}
          <div className="space-y-8">
            {profile.experiences && profile.experiences.length > 0 && (
              <Reveal delay="delay-100">
                <section>
                  <div className="mb-5">
                    <SectionHeader
                      icon={<Briefcase className="size-4" />}
                      title="Deneyim"
                    />
                  </div>
                  <ExperiencesSection experiences={profile.experiences} />
                </section>
              </Reveal>
            )}

            {profile.projects && profile.projects.length > 0 && (
              <Reveal delay="delay-200">
                <section>
                  <div className="mb-5">
                    <SectionHeader
                      icon={<FolderGit2 className="size-4" />}
                      title="Projeler"
                    />
                  </div>
                  <ProjectsSection projects={profile.projects} />
                </section>
              </Reveal>
            )}

            {profile.education && profile.education.length > 0 && (
              <Reveal delay="delay-300">
                <section>
                  <div className="mb-5">
                    <SectionHeader
                      icon={<GraduationCap className="size-4" />}
                      title="Eğitim"
                    />
                  </div>
                  <EducationSection education={profile.education} />
                </section>
              </Reveal>
            )}
          </div>
        </div>

        <p className="mt-10 text-center text-xs text-muted-foreground">
          Powered by{" "}
          <span className="font-semibold text-primary">Portfolify</span>
        </p>
      </div>
    </div>
  );
}
