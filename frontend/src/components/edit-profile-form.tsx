"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { api } from "@/lib/api";
import { ProfileDto, UserDto } from "@/lib/types";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { ArrowLeft, Save } from "lucide-react";
import Link from "next/link";
import { toast } from "sonner";

export function EditProfileForm({
  profile,
  user,
}: {
  profile: ProfileDto;
  user: UserDto | null;
}) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({
    title: profile.title || "",
    subtitle: profile.subtitle || "",
    bio: profile.bio || "",
    visibility: profile.visibility || "Public",
    theme: profile.theme || "",
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await api.profiles.update(profile.id, {
        title: form.title || undefined,
        subtitle: form.subtitle || undefined,
        bio: form.bio || undefined,
        visibility: form.visibility,
        theme: form.theme || undefined,
      });
      if (res.isSuccess) {
        toast.success("Profil güncellendi!");
        router.push("/dashboard");
        router.refresh();
      } else {
        toast.error(res.errorMessage || "Güncelleme başarısız.");
      }
    } catch (err) {
      toast.error(
        "Bir hata oluştu: " + (err instanceof Error ? err.message : "")
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="mx-auto max-w-2xl px-4 py-8">
      <div className="mb-6">
        <Link
          href="/dashboard"
          className="inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground"
        >
          <ArrowLeft className="h-4 w-4" />
          Panele Dön
        </Link>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Profil Düzenle</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-2">
              <Label>Başlık</Label>
              <Input
                value={form.title}
                onChange={(e) =>
                  setForm((f) => ({ ...f, title: e.target.value }))
                }
                required
              />
            </div>

            <div className="space-y-2">
              <Label>Alt Başlık</Label>
              <Input
                value={form.subtitle}
                onChange={(e) =>
                  setForm((f) => ({ ...f, subtitle: e.target.value }))
                }
              />
            </div>

            <div className="space-y-2">
              <Label>Hakkımda</Label>
              <Textarea
                rows={4}
                value={form.bio}
                onChange={(e) =>
                  setForm((f) => ({ ...f, bio: e.target.value }))
                }
              />
            </div>

            <div className="space-y-2">
              <Label>Görünürlük</Label>
              <Select
                value={form.visibility}
                onValueChange={(v) =>
                  setForm((f) => ({ ...f, visibility: v ?? "Public" }))
                }
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Public">Herkese Açık</SelectItem>
                  <SelectItem value="Unlisted">Listelenmemiş</SelectItem>
                  <SelectItem value="Private">Gizli</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label>Tema</Label>
              <Select
                value={form.theme || "default"}
                onValueChange={(v) =>
                  setForm((f) => ({ ...f, theme: (v ?? "default") === "default" ? "" : (v ?? "") }))
                }
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="default">Varsayılan</SelectItem>
                  <SelectItem value="dark">Koyu</SelectItem>
                  <SelectItem value="minimal">Minimal</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="rounded-lg border bg-muted/30 p-4">
              <p className="text-sm text-muted-foreground">
                <strong>Slug:</strong> /p/{profile.slug}
              </p>
              {user && (
                <p className="mt-1 text-sm text-muted-foreground">
                  <strong>Kullanıcı:</strong> {user.firstName} {user.lastName}
                </p>
              )}
              <p className="mt-1 text-sm text-muted-foreground">
                <strong>Link sayısı:</strong> {profile.links?.length || 0}
              </p>
            </div>

            <Button type="submit" className="w-full gap-2" disabled={loading}>
              <Save className="h-4 w-4" />
              {loading ? "Kaydediliyor..." : "Kaydet"}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
