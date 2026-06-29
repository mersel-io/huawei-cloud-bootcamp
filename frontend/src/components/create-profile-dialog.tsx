"use client";

import { useState } from "react";
import { api } from "@/lib/api";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { toast } from "sonner";

interface CreateProfileDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onCreated: () => void;
  userId: string | null;
}

export function CreateProfileDialog({
  open,
  onOpenChange,
  onCreated,
  userId,
}: CreateProfileDialogProps) {
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({
    slug: "",
    title: "",
    subtitle: "",
    bio: "",
    visibility: "Public",
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!userId) return;
    setLoading(true);
    try {
      const res = await api.profiles.create({
        userId,
        slug: form.slug || undefined,
        title: form.title || undefined,
        subtitle: form.subtitle || undefined,
        bio: form.bio || undefined,
        visibility: form.visibility,
      });
      if (res.isSuccess) {
        setForm({
          slug: "",
          title: "",
          subtitle: "",
          bio: "",
          visibility: "Public",
        });
        onCreated();
      } else {
        toast.error(res.errorMessage || "Bir hata oluştu.");
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
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Yeni Profil Oluştur</DialogTitle>
          <DialogDescription>
            Dijital kartvizitinizi oluşturun. Daha sonra detayları
            düzenleyebilirsiniz.
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="title">Başlık</Label>
            <Input
              id="title"
              placeholder="Örn: Full Stack Developer"
              value={form.title}
              onChange={(e) =>
                setForm((f) => ({ ...f, title: e.target.value }))
              }
              required
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="slug">URL Slug</Label>
            <div className="flex items-center gap-1 text-sm text-muted-foreground">
              <span className="font-mono">/p/</span>
              <Input
                id="slug"
                placeholder="kullanici-adi"
                value={form.slug}
                onChange={(e) =>
                  setForm((f) => ({
                    ...f,
                    slug: e.target.value
                      .toLowerCase()
                      .replace(/[^a-z0-9-]/g, "")
                      .replace(/-+/g, "-"),
                  }))
                }
                className="flex-1 font-mono"
              />
            </div>
          </div>
          <div className="space-y-2">
            <Label htmlFor="subtitle">Alt Başlık</Label>
            <Input
              id="subtitle"
              placeholder="Örn: React & Node.js Uzmanı"
              value={form.subtitle}
              onChange={(e) =>
                setForm((f) => ({ ...f, subtitle: e.target.value }))
              }
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="bio">Hakkımda</Label>
            <Textarea
              id="bio"
              placeholder="Kendinizi tanıtın..."
              rows={3}
              value={form.bio}
              onChange={(e) => setForm((f) => ({ ...f, bio: e.target.value }))}
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
              <SelectTrigger className="w-full">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Public">Herkese Açık</SelectItem>
                <SelectItem value="Unlisted">Listelenmemiş</SelectItem>
                <SelectItem value="Private">Gizli</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <Button type="submit" className="w-full" disabled={loading}>
            {loading ? "Oluşturuluyor..." : "Profil Oluştur"}
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
}
