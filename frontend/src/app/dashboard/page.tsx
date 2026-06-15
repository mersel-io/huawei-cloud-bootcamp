"use client";

import { useState, useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";
import { api } from "@/lib/api";
import { useAuth } from "@/context/auth-context";
import { ProfileDto } from "@/lib/types";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { Separator } from "@/components/ui/separator";
import {
  Plus,
  ExternalLink,
  Eye,
  Globe,
  Lock,
  EyeOff,
  Trash2,
  Pencil,
} from "lucide-react";
import Link from "next/link";
import { toast } from "sonner";
import { CreateProfileDialog } from "@/components/create-profile-dialog";

function visibilityIcon(visibility: string) {
  switch (visibility) {
    case "Public":
      return <Globe className="h-3.5 w-3.5" />;
    case "Private":
      return <Lock className="h-3.5 w-3.5" />;
    case "Unlisted":
      return <EyeOff className="h-3.5 w-3.5" />;
    default:
      return <Eye className="h-3.5 w-3.5" />;
  }
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
    if (!confirm("Bu profili silmek istediğinize emin misiniz?")) return;
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

  return (
    <div className="mx-auto max-w-6xl px-4 py-8">
      <div className="mb-8 flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Panel</h1>
          <p className="mt-1 text-muted-foreground">
            Hoş geldiniz, {user.firstName} {user.lastName}
          </p>
        </div>
        <Button className="gap-2" onClick={() => setShowCreateProfile(true)}>
          <Plus className="h-4 w-4" />
          Yeni Profil
        </Button>
      </div>

      <Card className="mb-8">
        <CardContent className="flex items-center gap-4 py-4">
          <div className="flex h-12 w-12 items-center justify-center rounded-full bg-primary/10 text-lg font-semibold text-primary">
            {user.firstName.charAt(0)}
            {user.lastName.charAt(0)}
          </div>
          <div className="flex-1">
            <p className="font-semibold">
              {user.firstName} {user.lastName}
            </p>
            <p className="text-sm text-muted-foreground">{user.email}</p>
          </div>
          <Badge variant="secondary">{user.role}</Badge>
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
            <Skeleton key={i} className="h-48 rounded-xl" />
          ))}
        </div>
      ) : profiles.length === 0 ? (
        <Card className="border-dashed">
          <CardContent className="flex flex-col items-center gap-4 py-12">
            <p className="text-muted-foreground">
              Henüz profil oluşturmadınız.
            </p>
            <Button
              className="gap-2"
              onClick={() => setShowCreateProfile(true)}
            >
              <Plus className="h-4 w-4" />
              İlk Profilini Oluştur
            </Button>
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {profiles.map((profile) => (
            <Card
              key={profile.id}
              className="group transition-all hover:shadow-md"
            >
              <CardHeader className="pb-3">
                <div className="flex items-start justify-between">
                  <CardTitle className="text-lg">{profile.title}</CardTitle>
                  <div className="flex items-center gap-1">
                    {profile.isPrimary && (
                      <Badge variant="default" className="text-xs">
                        Ana
                      </Badge>
                    )}
                    <Badge
                      variant="outline"
                      className="gap-1 text-xs"
                    >
                      {visibilityIcon(profile.visibility)}
                      {profile.visibility}
                    </Badge>
                  </div>
                </div>
                {profile.subtitle && (
                  <p className="text-sm text-muted-foreground">
                    {profile.subtitle}
                  </p>
                )}
              </CardHeader>
              <CardContent>
                {profile.bio && (
                  <p className="mb-4 line-clamp-2 text-sm text-muted-foreground">
                    {profile.bio}
                  </p>
                )}
                <div className="mb-4 flex items-center gap-2 text-xs text-muted-foreground">
                  <span>/{profile.slug}</span>
                  <span>&middot;</span>
                  <span>{profile.links?.length || 0} link</span>
                </div>
                <Separator className="mb-3" />
                <div className="flex gap-2">
                  <Link href={`/p/${profile.slug}`} className="flex-1">
                    <Button
                      variant="outline"
                      size="sm"
                      className="w-full gap-1"
                    >
                      <ExternalLink className="h-3.5 w-3.5" />
                      Görüntüle
                    </Button>
                  </Link>
                  <Link href={`/dashboard/profiles/${profile.id}/edit`} className="flex-1">
                    <Button
                      variant="outline"
                      size="sm"
                      className="w-full gap-1"
                    >
                      <Pencil className="h-3.5 w-3.5" />
                      Düzenle
                    </Button>
                  </Link>
                  <Button
                    variant="outline"
                    size="sm"
                    className="gap-1 text-destructive hover:text-destructive"
                    onClick={() => handleDeleteProfile(profile.id)}
                  >
                    <Trash2 className="h-3.5 w-3.5" />
                  </Button>
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
