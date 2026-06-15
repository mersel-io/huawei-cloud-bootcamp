"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import { api } from "@/lib/api";
import { UserDto, ProfileDto } from "@/lib/types";
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
  UserPlus,
} from "lucide-react";
import Link from "next/link";
import { toast } from "sonner";
import { CreateUserDialog } from "@/components/create-user-dialog";
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
  const [userId, setUserId] = useState<string | null>(null);
  const [user, setUser] = useState<UserDto | null>(null);
  const [profiles, setProfiles] = useState<ProfileDto[]>([]);
  const [loading, setLoading] = useState(true);
  const [showCreateUser, setShowCreateUser] = useState(false);
  const [showCreateProfile, setShowCreateProfile] = useState(false);
  const initialized = useRef(false);

  const loadUserData = useCallback(async (uid: string) => {
    try {
      const userRes = await api.users.getById(uid);
      if (userRes.isSuccess) setUser(userRes.data);
    } catch {}
  }, []);

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
    if (initialized.current) return;
    initialized.current = true;
    const stored = localStorage.getItem("portfolify_user_id");
    if (stored) {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setUserId(stored);
      loadUserData(stored);
      loadProfiles(stored);
    } else {
      setLoading(false);
    }
  }, [loadUserData, loadProfiles]);

  const refreshProfiles = useCallback(async () => {
    if (!userId) return;
    await loadProfiles(userId);
  }, [userId, loadProfiles]);

  const handleUserCreated = (id: string) => {
    localStorage.setItem("portfolify_user_id", id);
    setUserId(id);
    loadUserData(id);
    loadProfiles(id);
    setShowCreateUser(false);
    toast.success("Kullanıcı başarıyla oluşturuldu!");
  };

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

  if (!userId && !loading) {
    return (
      <div className="mx-auto max-w-6xl px-4 py-16">
        <div className="mx-auto max-w-md text-center">
          <h1 className="text-3xl font-bold">Hoş Geldiniz</h1>
          <p className="mt-4 text-muted-foreground">
            Portfolify kullanmaya başlamak için önce bir kullanıcı profili
            oluşturun.
          </p>
          <Button
            size="lg"
            className="mt-8 gap-2"
            onClick={() => setShowCreateUser(true)}
          >
            <UserPlus className="h-4 w-4" />
            Kullanıcı Oluştur
          </Button>
        </div>
        <CreateUserDialog
          open={showCreateUser}
          onOpenChange={setShowCreateUser}
          onCreated={handleUserCreated}
        />
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-6xl px-4 py-8">
      <div className="mb-8 flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Panel</h1>
          {user && (
            <p className="mt-1 text-muted-foreground">
              Hoş geldiniz, {user.firstName} {user.lastName}
            </p>
          )}
        </div>
        <div className="flex gap-2">
          <Button
            variant="outline"
            className="gap-2"
            onClick={() => {
              localStorage.removeItem("portfolify_user_id");
              setUserId(null);
              setUser(null);
              setProfiles([]);
            }}
          >
            Çıkış
          </Button>
          {userId && (
            <Button className="gap-2" onClick={() => setShowCreateProfile(true)}>
              <Plus className="h-4 w-4" />
              Yeni Profil
            </Button>
          )}
        </div>
      </div>

      {user && (
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
      )}

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

      <CreateUserDialog
        open={showCreateUser}
        onOpenChange={setShowCreateUser}
        onCreated={handleUserCreated}
      />
      <CreateProfileDialog
        open={showCreateProfile}
        onOpenChange={setShowCreateProfile}
        onCreated={handleProfileCreated}
        userId={userId}
      />
    </div>
  );
}
