"use client";

import { useState, useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";
import { api } from "@/lib/api";
import { useAuth } from "@/context/auth-context";
import { ProfileDto } from "@/lib/types";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import {
  Plus,
  ExternalLink,
  Eye,
  Globe,
  Lock,
  EyeOff,
  Trash2,
  Pencil,
  Link2,
  Zap,
  FolderGit2,
  Briefcase,
  Sparkles,
} from "lucide-react";
import Link from "next/link";
import { toast } from "sonner";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { CreateProfileDialog } from "@/components/create-profile-dialog";

function visibilityIcon(visibility: string) {
  switch (visibility) {
    case "Public":
      return <Globe className="size-3.5" />;
    case "Private":
      return <Lock className="size-3.5" />;
    case "Unlisted":
      return <EyeOff className="size-3.5" />;
    default:
      return <Eye className="size-3.5" />;
  }
}

function getInitials(firstName: string, lastName: string) {
  return `${firstName.charAt(0)}${lastName.charAt(0)}`.toUpperCase();
}

export default function DashboardPage() {
  const router = useRouter();
  const { user, isAuthenticated, loading: authLoading } = useAuth();
  const [profiles, setProfiles] = useState<ProfileDto[]>([]);
  const [loading, setLoading] = useState(true);
  const [showCreateProfile, setShowCreateProfile] = useState(false);

  const loadProfiles = useCallback(async (uid: string) => {
    try {
      const res = await api.profiles.getByUserId(uid);
      setProfiles(res.items || []);
    } catch {
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    if (!authLoading && !isAuthenticated) {
      router.push("/login");
      return;
    }
    if (authLoading || !user) return;

    // eslint-disable-next-line react-hooks/set-state-in-effect
    loadProfiles(user.id);
  }, [authLoading, isAuthenticated, user, router, loadProfiles]);

  const refreshProfiles = useCallback(async () => {
    if (!user) return;
    await loadProfiles(user.id);
  }, [user, loadProfiles]);

  const handleProfileCreated = () => {
    setShowCreateProfile(false);
    refreshProfiles();
    toast.success("Profil başarıyla oluşturuldu!");
  };

  const handleDeleteProfile = async (id: string) => {
    try {
      await api.profiles.delete(id);
      setProfiles((prev) => prev.filter((p) => p.id !== id));
      toast.success("Profil silindi.");
    } catch {
      toast.error("Profil silinirken bir hata oluştu.");
    }
  };

  if (authLoading || (!isAuthenticated && !authLoading)) {
    return (
      <div className="mx-auto max-w-6xl px-4 py-8">
        <Skeleton className="h-8 w-48" />
      </div>
    );
  }

  if (!user) return null;

  const totalSkills = profiles.reduce(
    (acc, p) => acc + (p.skills?.length || 0),
    0
  );
  const totalLinks = profiles.reduce(
    (acc, p) => acc + (p.links?.length || 0),
    0
  );
  const totalProjects = profiles.reduce(
    (acc, p) => acc + (p.projects?.length || 0),
    0
  );

  const stats = [
    { label: "Profil", value: profiles.length, icon: Briefcase },
    { label: "Yetenek", value: totalSkills, icon: Zap },
    { label: "Proje", value: totalProjects, icon: FolderGit2 },
    { label: "Bağlantı", value: totalLinks, icon: Link2 },
  ];

  return (
    <div className="mx-auto max-w-6xl px-4 py-8">
      <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Panel</h1>
          <p className="mt-1 text-muted-foreground">
            Hoş geldiniz, {user.firstName} {user.lastName}
          </p>
        </div>
        <Button
          className="gap-2"
          onClick={() => setShowCreateProfile(true)}
        >
          <Plus className="size-4" />
          Yeni Profil
        </Button>
      </div>

      <div className="mb-8 grid grid-cols-2 gap-4 lg:grid-cols-4">
        {stats.map((stat) => (
          <Card key={stat.label}>
            <CardContent className="flex items-center gap-3 py-4">
              <div className="flex size-10 items-center justify-center rounded-lg bg-primary/10 text-primary">
                <stat.icon className="size-5" />
              </div>
              <div>
                <p className="text-2xl font-bold leading-none">{stat.value}</p>
                <p className="mt-1 text-xs text-muted-foreground">{stat.label}</p>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <Card className="mb-8">
        <CardContent className="flex items-center gap-4 py-4">
          <Avatar size="lg">
            <AvatarFallback className="bg-primary/10 text-base font-semibold text-primary">
              {getInitials(user.firstName, user.lastName)}
            </AvatarFallback>
          </Avatar>
          <div className="flex-1 min-w-0">
            <p className="font-semibold">
              {user.firstName} {user.lastName}
            </p>
            <p className="text-sm text-muted-foreground truncate">{user.email}</p>
          </div>
          <Badge variant="secondary">
            {user.role === "Developer"
              ? "Geliştirici"
              : user.role === "Student"
              ? "Öğrenci"
              : user.role}
          </Badge>
        </CardContent>
      </Card>

      <div className="mb-4 flex items-center justify-between">
        <h2 className="text-xl font-semibold">Profillerim</h2>
        <p className="text-sm text-muted-foreground">
          {profiles.length} profil
        </p>
      </div>

      {loading ? (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {[1, 2, 3].map((i) => (
            <Skeleton key={i} className="h-56 rounded-xl" />
          ))}
        </div>
      ) : profiles.length === 0 ? (
        <Card className="border-dashed">
          <CardContent className="flex flex-col items-center gap-4 py-16 text-center">
            <div className="flex size-16 items-center justify-center rounded-2xl bg-primary/10 text-primary">
              <Sparkles className="size-7" />
            </div>
            <div>
              <p className="text-lg font-medium">Henüz profil oluşturmadınız</p>
              <p className="mt-1 text-sm text-muted-foreground">
                İlk dijital kartvizitinizi oluşturarak başlayın.
              </p>
            </div>
            <Button
              className="gap-2"
              onClick={() => setShowCreateProfile(true)}
            >
              <Plus className="size-4" />
              İlk Profilini Oluştur
            </Button>
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {profiles.map((profile) => (
            <Card
              key={profile.id}
              className="group relative gap-0 transition-all hover:shadow-lg hover:shadow-primary/5 hover:-translate-y-0.5"
            >
              <div className="h-24 bg-gradient-to-br from-primary/80 via-primary/50 to-violet-500/40" />
              <CardContent className="-mt-10 px-5 pb-5">
                <div className="mb-3 flex items-start justify-between">
                  <div className="flex size-12 items-center justify-center rounded-xl border-4 border-background bg-card text-lg font-bold text-primary shadow-sm">
                    {profile.title.charAt(0).toUpperCase()}
                  </div>
                  <div className="flex items-center gap-1">
                    {profile.isPrimary && (
                      <Badge variant="default" className="text-xs">
                        Ana
                      </Badge>
                    )}
                    <Badge variant="outline" className="gap-1 text-xs">
                      {visibilityIcon(profile.visibility)}
                      {profile.visibility}
                    </Badge>
                  </div>
                </div>

                <h3 className="font-semibold leading-tight">{profile.title}</h3>
                {profile.subtitle && (
                  <p className="mt-0.5 text-sm text-muted-foreground line-clamp-1">
                    {profile.subtitle}
                  </p>
                )}
                {profile.bio && (
                  <p className="mt-2 text-sm text-muted-foreground line-clamp-2">
                    {profile.bio}
                  </p>
                )}

                <div className="mt-3 flex items-center gap-3 text-xs text-muted-foreground">
                  <span className="font-mono">/{profile.slug}</span>
                  <span>&middot;</span>
                  <span>{profile.links?.length || 0} link</span>
                  <span>&middot;</span>
                  <span>{profile.skills?.length || 0} yetenek</span>
                </div>

                <div className="mt-4 flex gap-2">
                  <Link href={`/p/${profile.slug}`} className="flex-1">
                    <Button variant="outline" size="sm" className="w-full gap-1.5">
                      <ExternalLink className="size-3.5" />
                      Görüntüle
                    </Button>
                  </Link>
                  <Link
                    href={`/dashboard/profiles/${profile.id}/edit`}
                    className="flex-1"
                  >
                    <Button variant="outline" size="sm" className="w-full gap-1.5">
                      <Pencil className="size-3.5" />
                      Düzenle
                    </Button>
                  </Link>
                  <AlertDialog>
                    <AlertDialogTrigger
                      render={
                        <Button
                          variant="outline"
                          size="icon-sm"
                          className="text-destructive hover:text-destructive"
                        />
                      }
                    >
                      <Trash2 className="size-3.5" />
                    </AlertDialogTrigger>
                    <AlertDialogContent>
                      <AlertDialogHeader>
                        <AlertDialogTitle>Profili sil</AlertDialogTitle>
                        <AlertDialogDescription>
                          Bu profili silmek istediğinize emin misiniz? Bu
                          işlem geri alınamaz.
                        </AlertDialogDescription>
                      </AlertDialogHeader>
                      <AlertDialogFooter>
                        <AlertDialogCancel>İptal</AlertDialogCancel>
                        <AlertDialogAction
                          variant="destructive"
                          onClick={() => handleDeleteProfile(profile.id)}
                        >
                          Sil
                        </AlertDialogAction>
                      </AlertDialogFooter>
                    </AlertDialogContent>
                  </AlertDialog>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      <CreateProfileDialog
        open={showCreateProfile}
        onOpenChange={setShowCreateProfile}
        onCreated={handleProfileCreated}
        userId={user.id}
      />
    </div>
  );
}
