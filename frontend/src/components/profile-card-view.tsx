"use client";

import { ProfileDto, UserDto } from "@/lib/types";
import {
  ExternalLink,
  Mail,
  Globe,
  Code2,
  Briefcase,
  Send,
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
