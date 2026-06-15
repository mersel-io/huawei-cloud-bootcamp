"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { api } from "@/lib/api";
import { ProfileDto, SkillDto, ExperienceDto, EducationDto, ProjectDto, ProfileLinkDto } from "@/lib/types";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { ArrowLeft, Save, Plus, Trash2, Zap, Pencil, X, Check, Briefcase, GraduationCap, FolderGit2, Link2 } from "lucide-react";
import Link from "next/link";
import { toast } from "sonner";

const LEVEL_LABELS: Record<string, string> = {
  Beginner: "Başlangıç",
  Intermediate: "Orta",
  Advanced: "İleri",
  Expert: "Uzman",
};

function levelBadgeVariant(level: string) {
  switch (level) {
    case "Expert":
      return "default" as const;
    case "Advanced":
      return "secondary" as const;
    default:
      return "outline" as const;
  }
}

export function EditProfileForm({
  profile,
}: {
  profile: ProfileDto;
}) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [skills, setSkills] = useState<SkillDto[]>(profile.skills || []);
  const [skillLoading, setSkillLoading] = useState(false);
  const [newSkill, setNewSkill] = useState({
    name: "",
    level: "Intermediate",
    category: "",
  });
  const [editingSkillId, setEditingSkillId] = useState<string | null>(null);
  const [editSkillLoading, setEditSkillLoading] = useState(false);
  const [editSkill, setEditSkill] = useState({
    name: "",
    level: "Intermediate",
    category: "",
    displayOrder: 0,
  });
  const [form, setForm] = useState({
    title: profile.title || "",
    subtitle: profile.subtitle || "",
    bio: profile.bio || "",
    visibility: profile.visibility || "Public",
    theme: profile.theme || "",
  });

  // Experiences
  const [experiences, setExperiences] = useState<ExperienceDto[]>(profile.experiences || []);
  const [expLoading, setExpLoading] = useState(false);
  const [newExp, setNewExp] = useState({
    company: "", position: "", startDate: "", endDate: "",
    isCurrent: false, description: "", location: "", companyUrl: "",
  });
  const [editingExpId, setEditingExpId] = useState<string | null>(null);
  const [editExpLoading, setEditExpLoading] = useState(false);
  const [editExp, setEditExp] = useState({
    company: "", position: "", startDate: "", endDate: "",
    isCurrent: false, description: "", location: "", companyUrl: "",
    displayOrder: 0,
  });

  // Education
  const [educationList, setEducationList] = useState<EducationDto[]>(profile.education || []);
  const [eduLoading, setEduLoading] = useState(false);
  const [newEdu, setNewEdu] = useState({
    institution: "", degree: "", startDate: "", endDate: "",
    isCurrent: false, fieldOfStudy: "", description: "", grade: "",
  });
  const [editingEduId, setEditingEduId] = useState<string | null>(null);
  const [editEduLoading, setEditEduLoading] = useState(false);
  const [editEdu, setEditEdu] = useState({
    institution: "", degree: "", startDate: "", endDate: "",
    isCurrent: false, fieldOfStudy: "", description: "", grade: "",
    displayOrder: 0,
  });

  // Projects
  const [projects, setProjects] = useState<ProjectDto[]>(profile.projects || []);
  const [projLoading, setProjLoading] = useState(false);
  const [newProj, setNewProj] = useState({
    title: "", description: "", repositoryUrl: "", liveUrl: "",
    technologies: "", status: "Active",
  });
  const [editingProjId, setEditingProjId] = useState<string | null>(null);
  const [editProjLoading, setEditProjLoading] = useState(false);
  const [editProj, setEditProj] = useState({
    title: "", description: "", repositoryUrl: "", liveUrl: "",
    technologies: "", status: "Active", displayOrder: 0,
  });

  // Profile Links
  const [links, setLinks] = useState<ProfileLinkDto[]>(profile.links || []);
  const [linkLoading, setLinkLoading] = useState(false);
  const [newLink, setNewLink] = useState({ label: "", url: "", icon: "" });
  const [editingLinkId, setEditingLinkId] = useState<string | null>(null);
  const [editLinkLoading, setEditLinkLoading] = useState(false);
  const [editLink, setEditLink] = useState({ label: "", url: "", icon: "", displayOrder: 0 });

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

  const handleAddSkill = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newSkill.name.trim()) return;
    setSkillLoading(true);
    try {
      const res = await api.skills.create({
        profileId: profile.id,
        name: newSkill.name.trim(),
        level: newSkill.level,
        category: newSkill.category.trim() || undefined,
      });
      if (res.isSuccess && res.data) {
        setSkills((prev) => [...prev, res.data]);
        setNewSkill({ name: "", level: "Intermediate", category: "" });
        toast.success("Yetenek eklendi!");
      } else {
        toast.error(res.errorMessage || "Yetenek eklenemedi.");
      }
    } catch (err) {
      toast.error(
        "Bir hata oluştu: " + (err instanceof Error ? err.message : "")
      );
    } finally {
      setSkillLoading(false);
    }
  };

  const handleStartEdit = (skill: SkillDto) => {
    setEditingSkillId(skill.id);
    setEditSkill({
      name: skill.name,
      level: skill.level,
      category: skill.category || "",
      displayOrder: skill.displayOrder,
    });
  };

  const handleCancelEdit = () => {
    setEditingSkillId(null);
    setEditSkill({
      name: "",
      level: "Intermediate",
      category: "",
      displayOrder: 0,
    });
  };

  const handleEditSkill = async (id: string) => {
    if (!editSkill.name.trim()) return;
    setEditSkillLoading(true);
    try {
      const res = await api.skills.update(id, {
        name: editSkill.name.trim(),
        level: editSkill.level,
        category: editSkill.category.trim() || undefined,
        displayOrder: editSkill.displayOrder,
      });
      if (res.isSuccess && res.data) {
        setSkills((prev) =>
          prev.map((s) => (s.id === id ? res.data : s))
        );
        handleCancelEdit();
        toast.success("Yetenek güncellendi!");
      } else {
        toast.error(res.errorMessage || "Yetenek güncellenemedi.");
      }
    } catch (err) {
      toast.error(
        "Bir hata oluştu: " + (err instanceof Error ? err.message : "")
      );
    } finally {
      setEditSkillLoading(false);
    }
  };

  const handleDeleteSkill = async (id: string) => {
    try {
      await api.skills.delete(id);
      setSkills((prev) => prev.filter((s) => s.id !== id));
      toast.success("Yetenek silindi.");
    } catch {
      toast.error("Yetenek silinirken bir hata oluştu.");
    }
  };

  // ============ EXPERIENCES ============
  const handleAddExp = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newExp.company.trim() || !newExp.position.trim()) return;
    setExpLoading(true);
    try {
      const res = await api.experiences.create({
        profileId: profile.id,
        company: newExp.company.trim(),
        position: newExp.position.trim(),
        startDate: newExp.startDate,
        endDate: newExp.endDate || undefined,
        isCurrent: newExp.isCurrent,
        description: newExp.description || undefined,
        location: newExp.location || undefined,
        companyUrl: newExp.companyUrl || undefined,
      });
      if (res.isSuccess && res.data) {
        setExperiences((prev) => [...prev, res.data]);
        setNewExp({ company: "", position: "", startDate: "", endDate: "", isCurrent: false, description: "", location: "", companyUrl: "" });
        toast.success("Deneyim eklendi!");
      } else {
        toast.error(res.errorMessage || "Deneyim eklenemedi.");
      }
    } catch (err) {
      toast.error("Bir hata oluştu: " + (err instanceof Error ? err.message : ""));
    } finally {
      setExpLoading(false);
    }
  };

  const handleStartEditExp = (exp: ExperienceDto) => {
    setEditingExpId(exp.id);
    setEditExp({
      company: exp.company, position: exp.position,
      startDate: exp.startDate, endDate: exp.endDate || "",
      isCurrent: exp.isCurrent, description: exp.description || "",
      location: exp.location || "", companyUrl: exp.companyUrl || "",
      displayOrder: exp.displayOrder,
    });
  };

  const handleCancelEditExp = () => {
    setEditingExpId(null);
    setEditExp({ company: "", position: "", startDate: "", endDate: "", isCurrent: false, description: "", location: "", companyUrl: "", displayOrder: 0 });
  };

  const handleEditExp = async (id: string) => {
    setEditExpLoading(true);
    try {
      const res = await api.experiences.update(id, {
        company: editExp.company.trim(),
        position: editExp.position.trim(),
        startDate: editExp.startDate,
        endDate: editExp.endDate || undefined,
        isCurrent: editExp.isCurrent,
        description: editExp.description || undefined,
        location: editExp.location || undefined,
        companyUrl: editExp.companyUrl || undefined,
        displayOrder: editExp.displayOrder,
      });
      if (res.isSuccess && res.data) {
        setExperiences((prev) => prev.map((e) => (e.id === id ? res.data : e)));
        handleCancelEditExp();
        toast.success("Deneyim güncellendi!");
      } else {
        toast.error(res.errorMessage || "Deneyim güncellenemedi.");
      }
    } catch (err) {
      toast.error("Bir hata oluştu: " + (err instanceof Error ? err.message : ""));
    } finally {
      setEditExpLoading(false);
    }
  };

  const handleDeleteExp = async (id: string) => {
    try {
      await api.experiences.delete(id);
      setExperiences((prev) => prev.filter((e) => e.id !== id));
      toast.success("Deneyim silindi.");
    } catch {
      toast.error("Deneyim silinirken bir hata oluştu.");
    }
  };

  // ============ EDUCATION ============
  const handleAddEdu = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newEdu.institution.trim() || !newEdu.degree.trim()) return;
    setEduLoading(true);
    try {
      const res = await api.education.create({
        profileId: profile.id,
        institution: newEdu.institution.trim(),
        degree: newEdu.degree.trim(),
        startDate: newEdu.startDate,
        endDate: newEdu.endDate || undefined,
        isCurrent: newEdu.isCurrent,
        fieldOfStudy: newEdu.fieldOfStudy || undefined,
        description: newEdu.description || undefined,
        grade: newEdu.grade || undefined,
      });
      if (res.isSuccess && res.data) {
        setEducationList((prev) => [...prev, res.data]);
        setNewEdu({ institution: "", degree: "", startDate: "", endDate: "", isCurrent: false, fieldOfStudy: "", description: "", grade: "" });
        toast.success("Eğitim eklendi!");
      } else {
        toast.error(res.errorMessage || "Eğitim eklenemedi.");
      }
    } catch (err) {
      toast.error("Bir hata oluştu: " + (err instanceof Error ? err.message : ""));
    } finally {
      setEduLoading(false);
    }
  };

  const handleStartEditEdu = (edu: EducationDto) => {
    setEditingEduId(edu.id);
    setEditEdu({
      institution: edu.institution, degree: edu.degree,
      startDate: edu.startDate, endDate: edu.endDate || "",
      isCurrent: edu.isCurrent, fieldOfStudy: edu.fieldOfStudy || "",
      description: edu.description || "", grade: edu.grade || "",
      displayOrder: edu.displayOrder,
    });
  };

  const handleCancelEditEdu = () => {
    setEditingEduId(null);
    setEditEdu({ institution: "", degree: "", startDate: "", endDate: "", isCurrent: false, fieldOfStudy: "", description: "", grade: "", displayOrder: 0 });
  };

  const handleEditEdu = async (id: string) => {
    setEditEduLoading(true);
    try {
      const res = await api.education.update(id, {
        institution: editEdu.institution.trim(),
        degree: editEdu.degree.trim(),
        startDate: editEdu.startDate,
        endDate: editEdu.endDate || undefined,
        isCurrent: editEdu.isCurrent,
        fieldOfStudy: editEdu.fieldOfStudy || undefined,
        description: editEdu.description || undefined,
        grade: editEdu.grade || undefined,
        displayOrder: editEdu.displayOrder,
      });
      if (res.isSuccess && res.data) {
        setEducationList((prev) => prev.map((e) => (e.id === id ? res.data : e)));
        handleCancelEditEdu();
        toast.success("Eğitim güncellendi!");
      } else {
        toast.error(res.errorMessage || "Eğitim güncellenemedi.");
      }
    } catch (err) {
      toast.error("Bir hata oluştu: " + (err instanceof Error ? err.message : ""));
    } finally {
      setEditEduLoading(false);
    }
  };

  const handleDeleteEdu = async (id: string) => {
    try {
      await api.education.delete(id);
      setEducationList((prev) => prev.filter((e) => e.id !== id));
      toast.success("Eğitim silindi.");
    } catch {
      toast.error("Eğitim silinirken bir hata oluştu.");
    }
  };

  // ============ PROJECTS ============
  const handleAddProj = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newProj.title.trim()) return;
    setProjLoading(true);
    try {
      const res = await api.projects.create({
        profileId: profile.id,
        title: newProj.title.trim(),
        description: newProj.description || undefined,
        repositoryUrl: newProj.repositoryUrl || undefined,
        liveUrl: newProj.liveUrl || undefined,
        technologies: newProj.technologies || undefined,
        status: newProj.status,
      });
      if (res.isSuccess && res.data) {
        setProjects((prev) => [...prev, res.data]);
        setNewProj({ title: "", description: "", repositoryUrl: "", liveUrl: "", technologies: "", status: "Active" });
        toast.success("Proje eklendi!");
      } else {
        toast.error(res.errorMessage || "Proje eklenemedi.");
      }
    } catch (err) {
      toast.error("Bir hata oluştu: " + (err instanceof Error ? err.message : ""));
    } finally {
      setProjLoading(false);
    }
  };

  const handleStartEditProj = (proj: ProjectDto) => {
    setEditingProjId(proj.id);
    setEditProj({
      title: proj.title, description: proj.description || "",
      repositoryUrl: proj.repositoryUrl || "", liveUrl: proj.liveUrl || "",
      technologies: proj.technologies || "", status: proj.status,
      displayOrder: proj.displayOrder,
    });
  };

  const handleCancelEditProj = () => {
    setEditingProjId(null);
    setEditProj({ title: "", description: "", repositoryUrl: "", liveUrl: "", technologies: "", status: "Active", displayOrder: 0 });
  };

  const handleEditProj = async (id: string) => {
    setEditProjLoading(true);
    try {
      const res = await api.projects.update(id, {
        title: editProj.title.trim(),
        description: editProj.description || undefined,
        repositoryUrl: editProj.repositoryUrl || undefined,
        liveUrl: editProj.liveUrl || undefined,
        technologies: editProj.technologies || undefined,
        status: editProj.status,
        displayOrder: editProj.displayOrder,
      });
      if (res.isSuccess && res.data) {
        setProjects((prev) => prev.map((p) => (p.id === id ? res.data : p)));
        handleCancelEditProj();
        toast.success("Proje güncellendi!");
      } else {
        toast.error(res.errorMessage || "Proje güncellenemedi.");
      }
    } catch (err) {
      toast.error("Bir hata oluştu: " + (err instanceof Error ? err.message : ""));
    } finally {
      setEditProjLoading(false);
    }
  };

  const handleDeleteProj = async (id: string) => {
    try {
      await api.projects.delete(id);
      setProjects((prev) => prev.filter((p) => p.id !== id));
      toast.success("Proje silindi.");
    } catch {
      toast.error("Proje silinirken bir hata oluştu.");
    }
  };

  // ============ PROFILE LINKS ============
  const handleAddLink = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newLink.label.trim() || !newLink.url.trim()) return;
    setLinkLoading(true);
    try {
      const res = await api.profileLinks.create({
        profileId: profile.id,
        label: newLink.label.trim(),
        url: newLink.url.trim(),
        icon: newLink.icon.trim() || undefined,
      });
      if (res.isSuccess && res.data) {
        setLinks((prev) => [...prev, res.data]);
        setNewLink({ label: "", url: "", icon: "" });
        toast.success("Bağlantı eklendi!");
      } else {
        toast.error(res.errorMessage || "Bağlantı eklenemedi.");
      }
    } catch (err) {
      toast.error("Bir hata oluştu: " + (err instanceof Error ? err.message : ""));
    } finally {
      setLinkLoading(false);
    }
  };

  const handleStartEditLink = (link: ProfileLinkDto) => {
    setEditingLinkId(link.id);
    setEditLink({ label: link.label, url: link.url, icon: link.icon || "", displayOrder: link.displayOrder });
  };

  const handleCancelEditLink = () => {
    setEditingLinkId(null);
    setEditLink({ label: "", url: "", icon: "", displayOrder: 0 });
  };

  const handleEditLink = async (id: string) => {
    setEditLinkLoading(true);
    try {
      const res = await api.profileLinks.update(id, {
        label: editLink.label.trim(),
        url: editLink.url.trim(),
        icon: editLink.icon.trim() || undefined,
        displayOrder: editLink.displayOrder,
      });
      if (res.isSuccess && res.data) {
        setLinks((prev) => prev.map((l) => (l.id === id ? res.data : l)));
        handleCancelEditLink();
        toast.success("Bağlantı güncellendi!");
      } else {
        toast.error(res.errorMessage || "Bağlantı güncellenemedi.");
      }
    } catch (err) {
      toast.error("Bir hata oluştu: " + (err instanceof Error ? err.message : ""));
    } finally {
      setEditLinkLoading(false);
    }
  };

  const handleDeleteLink = async (id: string) => {
    try {
      await api.profileLinks.delete(id);
      setLinks((prev) => prev.filter((l) => l.id !== id));
      toast.success("Bağlantı silindi.");
    } catch {
      toast.error("Bağlantı silinirken bir hata oluştu.");
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

      <Card className="mb-6">
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
                  setForm((f) => ({
                    ...f,
                    theme: (v ?? "default") === "default" ? "" : v ?? "",
                  }))
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

            <Button type="submit" className="w-full gap-2" disabled={loading}>
              <Save className="h-4 w-4" />
              {loading ? "Kaydediliyor..." : "Kaydet"}
            </Button>
          </form>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Zap className="h-5 w-5 text-primary" />
            Yetenekler
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          {skills.length > 0 && (
            <div className="space-y-2">
              {skills.map((skill) =>
                editingSkillId === skill.id ? (
                  <div
                    key={skill.id}
                    className="space-y-3 rounded-lg border border-primary p-3"
                  >
                    <div className="grid grid-cols-2 gap-3">
                      <div className="space-y-2">
                        <Label>Yetenek Adı</Label>
                        <Input
                          value={editSkill.name}
                          onChange={(e) =>
                            setEditSkill((s) => ({
                              ...s,
                              name: e.target.value,
                            }))
                          }
                          required
                        />
                      </div>
                      <div className="space-y-2">
                        <Label>Kategori (opsiyonel)</Label>
                        <Input
                          value={editSkill.category}
                          onChange={(e) =>
                            setEditSkill((s) => ({
                              ...s,
                              category: e.target.value,
                            }))
                          }
                        />
                      </div>
                    </div>
                    <div className="space-y-2">
                      <Label>Seviye</Label>
                      <Select
                        value={editSkill.level}
                        onValueChange={(v) =>
                          setEditSkill((s) => ({
                            ...s,
                            level: v ?? "Intermediate",
                          }))
                        }
                      >
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="Beginner">Başlangıç</SelectItem>
                          <SelectItem value="Intermediate">Orta</SelectItem>
                          <SelectItem value="Advanced">İleri</SelectItem>
                          <SelectItem value="Expert">Uzman</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="flex items-center gap-2">
                      <Button
                        type="button"
                        size="sm"
                        className="gap-1.5"
                        disabled={
                          editSkillLoading || !editSkill.name.trim()
                        }
                        onClick={() => handleEditSkill(skill.id)}
                      >
                        <Check className="h-4 w-4" />
                        {editSkillLoading ? "Kaydediliyor..." : "Kaydet"}
                      </Button>
                      <Button
                        type="button"
                        size="sm"
                        variant="ghost"
                        className="gap-1.5"
                        onClick={handleCancelEdit}
                      >
                        <X className="h-4 w-4" />
                        İptal
                      </Button>
                    </div>
                  </div>
                ) : (
                  <div
                    key={skill.id}
                    className="flex items-center justify-between gap-3 rounded-lg border p-3"
                  >
                    <div className="flex flex-1 items-center gap-3">
                      <span className="font-medium">{skill.name}</span>
                      {skill.category && (
                        <Badge variant="outline" className="text-xs">
                          {skill.category}
                        </Badge>
                      )}
                      <Badge variant={levelBadgeVariant(skill.level)}>
                        {LEVEL_LABELS[skill.level] || skill.level}
                      </Badge>
                    </div>
                    <div className="flex items-center gap-1">
                      <Button
                        variant="ghost"
                        size="icon-sm"
                        onClick={() => handleStartEdit(skill)}
                      >
                        <Pencil className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon-sm"
                        className="text-destructive hover:text-destructive"
                        onClick={() => handleDeleteSkill(skill.id)}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                )
              )}
            </div>
          )}

          {skills.length === 0 && (
            <p className="text-center text-sm text-muted-foreground py-4">
              Henüz yetenek eklenmemiş.
            </p>
          )}

          <Separator />

          <form onSubmit={handleAddSkill} className="space-y-4">
            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-2">
                <Label htmlFor="skillName">Yetenek Adı</Label>
                <Input
                  id="skillName"
                  placeholder="örn. C#, React, Docker"
                  value={newSkill.name}
                  onChange={(e) =>
                    setNewSkill((s) => ({ ...s, name: e.target.value }))
                  }
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="skillCategory">Kategori (opsiyonel)</Label>
                <Input
                  id="skillCategory"
                  placeholder="örn. Backend, Frontend"
                  value={newSkill.category}
                  onChange={(e) =>
                    setNewSkill((s) => ({ ...s, category: e.target.value }))
                  }
                />
              </div>
            </div>
            <div className="space-y-2">
              <Label>Seviye</Label>
              <Select
                value={newSkill.level}
                onValueChange={(v) =>
                  setNewSkill((s) => ({ ...s, level: v ?? "Intermediate" }))
                }
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Beginner">Başlangıç</SelectItem>
                  <SelectItem value="Intermediate">Orta</SelectItem>
                  <SelectItem value="Advanced">İleri</SelectItem>
                  <SelectItem value="Expert">Uzman</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <Button
              type="submit"
              variant="outline"
              className="w-full gap-2"
              disabled={skillLoading || !newSkill.name.trim()}
            >
              <Plus className="h-4 w-4" />
              {skillLoading ? "Ekleniyor..." : "Yetenek Ekle"}
            </Button>
          </form>
        </CardContent>
      </Card>

      {/* ===== EXPERIENCES ===== */}
      <Card className="mt-6">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Briefcase className="h-5 w-5 text-primary" />
            Deneyimler
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {experiences.length > 0 && (
            <div className="space-y-2">
              {experiences.map((exp) =>
                editingExpId === exp.id ? (
                  <div key={exp.id} className="space-y-3 rounded-lg border border-primary p-3">
                    <div className="grid grid-cols-2 gap-3">
                      <div className="space-y-2">
                        <Label>Şirket</Label>
                        <Input value={editExp.company} onChange={(e) => setEditExp((s) => ({ ...s, company: e.target.value }))} required />
                      </div>
                      <div className="space-y-2">
                        <Label>Pozisyon</Label>
                        <Input value={editExp.position} onChange={(e) => setEditExp((s) => ({ ...s, position: e.target.value }))} required />
                      </div>
                    </div>
                    <div className="grid grid-cols-2 gap-3">
                      <div className="space-y-2">
                        <Label>Başlangıç (YYYY-AA-GG)</Label>
                        <Input type="date" value={editExp.startDate} onChange={(e) => setEditExp((s) => ({ ...s, startDate: e.target.value }))} required />
                      </div>
                      <div className="space-y-2">
                        <Label>Bitiş (YYYY-AA-GG)</Label>
                        <Input type="date" value={editExp.endDate} onChange={(e) => setEditExp((s) => ({ ...s, endDate: e.target.value }))} disabled={editExp.isCurrent} />
                      </div>
                    </div>
                    <div className="grid grid-cols-2 gap-3">
                      <div className="space-y-2">
                        <Label>Konum (opsiyonel)</Label>
                        <Input value={editExp.location} onChange={(e) => setEditExp((s) => ({ ...s, location: e.target.value }))} />
                      </div>
                      <div className="space-y-2">
                        <Label>Şirket URL (opsiyonel)</Label>
                        <Input value={editExp.companyUrl} onChange={(e) => setEditExp((s) => ({ ...s, companyUrl: e.target.value }))} />
                      </div>
                    </div>
                    <div className="space-y-2">
                      <Label>Açıklama (opsiyonel)</Label>
                      <Textarea rows={2} value={editExp.description} onChange={(e) => setEditExp((s) => ({ ...s, description: e.target.value }))} />
                    </div>
                    <label className="flex items-center gap-2 text-sm">
                      <input type="checkbox" checked={editExp.isCurrent} onChange={(e) => setEditExp((s) => ({ ...s, isCurrent: e.target.checked }))} />
                      Hala çalışıyorum
                    </label>
                    <div className="flex items-center gap-2">
                      <Button type="button" size="sm" className="gap-1.5" disabled={editExpLoading} onClick={() => handleEditExp(exp.id)}>
                        <Check className="h-4 w-4" /> {editExpLoading ? "Kaydediliyor..." : "Kaydet"}
                      </Button>
                      <Button type="button" size="sm" variant="ghost" className="gap-1.5" onClick={handleCancelEditExp}>
                        <X className="h-4 w-4" /> İptal
                      </Button>
                    </div>
                  </div>
                ) : (
                  <div key={exp.id} className="flex items-start justify-between gap-3 rounded-lg border p-3">
                    <div className="flex-1">
                      <p className="font-medium">{exp.position} · {exp.company}</p>
                      <p className="text-xs text-muted-foreground">{exp.startDate}{exp.endDate ? ` — ${exp.endDate}` : exp.isCurrent ? " — Devam ediyor" : ""}</p>
                    </div>
                    <div className="flex items-center gap-1">
                      <Button variant="ghost" size="icon-sm" onClick={() => handleStartEditExp(exp)}><Pencil className="h-4 w-4" /></Button>
                      <Button variant="ghost" size="icon-sm" className="text-destructive hover:text-destructive" onClick={() => handleDeleteExp(exp.id)}><Trash2 className="h-4 w-4" /></Button>
                    </div>
                  </div>
                )
              )}
            </div>
          )}
          {experiences.length === 0 && <p className="text-center text-sm text-muted-foreground py-4">Henüz deneyim eklenmemiş.</p>}
          <Separator />
          <form onSubmit={handleAddExp} className="space-y-3">
            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-2">
                <Label>Şirket</Label>
                <Input placeholder="örn. Google" value={newExp.company} onChange={(e) => setNewExp((s) => ({ ...s, company: e.target.value }))} required />
              </div>
              <div className="space-y-2">
                <Label>Pozisyon</Label>
                <Input placeholder="örn. Yazılım Geliştirici" value={newExp.position} onChange={(e) => setNewExp((s) => ({ ...s, position: e.target.value }))} required />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-2">
                <Label>Başlangıç</Label>
                <Input type="date" value={newExp.startDate} onChange={(e) => setNewExp((s) => ({ ...s, startDate: e.target.value }))} required />
              </div>
              <div className="space-y-2">
                <Label>Bitiş</Label>
                <Input type="date" value={newExp.endDate} onChange={(e) => setNewExp((s) => ({ ...s, endDate: e.target.value }))} disabled={newExp.isCurrent} />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-2">
                <Label>Konum (opsiyonel)</Label>
                <Input placeholder="örn. İstanbul" value={newExp.location} onChange={(e) => setNewExp((s) => ({ ...s, location: e.target.value }))} />
              </div>
              <div className="space-y-2">
                <Label>Şirket URL (opsiyonel)</Label>
                <Input placeholder="https://..." value={newExp.companyUrl} onChange={(e) => setNewExp((s) => ({ ...s, companyUrl: e.target.value }))} />
              </div>
            </div>
            <div className="space-y-2">
              <Label>Açıklama (opsiyonel)</Label>
              <Textarea rows={2} value={newExp.description} onChange={(e) => setNewExp((s) => ({ ...s, description: e.target.value }))} />
            </div>
            <label className="flex items-center gap-2 text-sm">
              <input type="checkbox" checked={newExp.isCurrent} onChange={(e) => setNewExp((s) => ({ ...s, isCurrent: e.target.checked, endDate: e.target.checked ? "" : s.endDate }))} />
              Hala çalışıyorum
            </label>
            <Button type="submit" variant="outline" className="w-full gap-2" disabled={expLoading || !newExp.company.trim() || !newExp.position.trim()}>
              <Plus className="h-4 w-4" /> {expLoading ? "Ekleniyor..." : "Deneyim Ekle"}
            </Button>
          </form>
        </CardContent>
      </Card>

      {/* ===== EDUCATION ===== */}
      <Card className="mt-6">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <GraduationCap className="h-5 w-5 text-primary" />
            Eğitim
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {educationList.length > 0 && (
            <div className="space-y-2">
              {educationList.map((edu) =>
                editingEduId === edu.id ? (
                  <div key={edu.id} className="space-y-3 rounded-lg border border-primary p-3">
                    <div className="grid grid-cols-2 gap-3">
                      <div className="space-y-2">
                        <Label>Kurum</Label>
                        <Input value={editEdu.institution} onChange={(e) => setEditEdu((s) => ({ ...s, institution: e.target.value }))} required />
                      </div>
                      <div className="space-y-2">
                        <Label>Derece</Label>
                        <Input value={editEdu.degree} onChange={(e) => setEditEdu((s) => ({ ...s, degree: e.target.value }))} required />
                      </div>
                    </div>
                    <div className="grid grid-cols-2 gap-3">
                      <div className="space-y-2">
                        <Label>Bölüm (opsiyonel)</Label>
                        <Input value={editEdu.fieldOfStudy} onChange={(e) => setEditEdu((s) => ({ ...s, fieldOfStudy: e.target.value }))} />
                      </div>
                      <div className="space-y-2">
                        <Label>Not (opsiyonel)</Label>
                        <Input value={editEdu.grade} onChange={(e) => setEditEdu((s) => ({ ...s, grade: e.target.value }))} />
                      </div>
                    </div>
                    <div className="grid grid-cols-2 gap-3">
                      <div className="space-y-2">
                        <Label>Başlangıç</Label>
                        <Input type="date" value={editEdu.startDate} onChange={(e) => setEditEdu((s) => ({ ...s, startDate: e.target.value }))} required />
                      </div>
                      <div className="space-y-2">
                        <Label>Bitiş</Label>
                        <Input type="date" value={editEdu.endDate} onChange={(e) => setEditEdu((s) => ({ ...s, endDate: e.target.value }))} disabled={editEdu.isCurrent} />
                      </div>
                    </div>
                    <div className="space-y-2">
                      <Label>Açıklama (opsiyonel)</Label>
                      <Textarea rows={2} value={editEdu.description} onChange={(e) => setEditEdu((s) => ({ ...s, description: e.target.value }))} />
                    </div>
                    <label className="flex items-center gap-2 text-sm">
                      <input type="checkbox" checked={editEdu.isCurrent} onChange={(e) => setEditEdu((s) => ({ ...s, isCurrent: e.target.checked }))} />
                      Devam ediyor
                    </label>
                    <div className="flex items-center gap-2">
                      <Button type="button" size="sm" className="gap-1.5" disabled={editEduLoading} onClick={() => handleEditEdu(edu.id)}>
                        <Check className="h-4 w-4" /> {editEduLoading ? "Kaydediliyor..." : "Kaydet"}
                      </Button>
                      <Button type="button" size="sm" variant="ghost" className="gap-1.5" onClick={handleCancelEditEdu}>
                        <X className="h-4 w-4" /> İptal
                      </Button>
                    </div>
                  </div>
                ) : (
                  <div key={edu.id} className="flex items-start justify-between gap-3 rounded-lg border p-3">
                    <div className="flex-1">
                      <p className="font-medium">{edu.degree} · {edu.institution}</p>
                      <p className="text-xs text-muted-foreground">{edu.startDate}{edu.endDate ? ` — ${edu.endDate}` : edu.isCurrent ? " — Devam ediyor" : ""}</p>
                    </div>
                    <div className="flex items-center gap-1">
                      <Button variant="ghost" size="icon-sm" onClick={() => handleStartEditEdu(edu)}><Pencil className="h-4 w-4" /></Button>
                      <Button variant="ghost" size="icon-sm" className="text-destructive hover:text-destructive" onClick={() => handleDeleteEdu(edu.id)}><Trash2 className="h-4 w-4" /></Button>
                    </div>
                  </div>
                )
              )}
            </div>
          )}
          {educationList.length === 0 && <p className="text-center text-sm text-muted-foreground py-4">Henüz eğitim eklenmemiş.</p>}
          <Separator />
          <form onSubmit={handleAddEdu} className="space-y-3">
            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-2">
                <Label>Kurum</Label>
                <Input placeholder="örn. Boğaziçi Üniversitesi" value={newEdu.institution} onChange={(e) => setNewEdu((s) => ({ ...s, institution: e.target.value }))} required />
              </div>
              <div className="space-y-2">
                <Label>Derece</Label>
                <Input placeholder="örn. Lisans" value={newEdu.degree} onChange={(e) => setNewEdu((s) => ({ ...s, degree: e.target.value }))} required />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-2">
                <Label>Bölüm (opsiyonel)</Label>
                <Input placeholder="örn. Bilgisayar Mühendisliği" value={newEdu.fieldOfStudy} onChange={(e) => setNewEdu((s) => ({ ...s, fieldOfStudy: e.target.value }))} />
              </div>
              <div className="space-y-2">
                <Label>Not (opsiyonel)</Label>
                <Input placeholder="örn. 3.8/4.0" value={newEdu.grade} onChange={(e) => setNewEdu((s) => ({ ...s, grade: e.target.value }))} />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-2">
                <Label>Başlangıç</Label>
                <Input type="date" value={newEdu.startDate} onChange={(e) => setNewEdu((s) => ({ ...s, startDate: e.target.value }))} required />
              </div>
              <div className="space-y-2">
                <Label>Bitiş</Label>
                <Input type="date" value={newEdu.endDate} onChange={(e) => setNewEdu((s) => ({ ...s, endDate: e.target.value }))} disabled={newEdu.isCurrent} />
              </div>
            </div>
            <div className="space-y-2">
              <Label>Açıklama (opsiyonel)</Label>
              <Textarea rows={2} value={newEdu.description} onChange={(e) => setNewEdu((s) => ({ ...s, description: e.target.value }))} />
            </div>
            <label className="flex items-center gap-2 text-sm">
              <input type="checkbox" checked={newEdu.isCurrent} onChange={(e) => setNewEdu((s) => ({ ...s, isCurrent: e.target.checked, endDate: e.target.checked ? "" : s.endDate }))} />
              Devam ediyor
            </label>
            <Button type="submit" variant="outline" className="w-full gap-2" disabled={eduLoading || !newEdu.institution.trim() || !newEdu.degree.trim()}>
              <Plus className="h-4 w-4" /> {eduLoading ? "Ekleniyor..." : "Eğitim Ekle"}
            </Button>
          </form>
        </CardContent>
      </Card>

      {/* ===== PROJECTS ===== */}
      <Card className="mt-6">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <FolderGit2 className="h-5 w-5 text-primary" />
            Projeler
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {projects.length > 0 && (
            <div className="space-y-2">
              {projects.map((proj) =>
                editingProjId === proj.id ? (
                  <div key={proj.id} className="space-y-3 rounded-lg border border-primary p-3">
                    <div className="space-y-2">
                      <Label>Başlık</Label>
                      <Input value={editProj.title} onChange={(e) => setEditProj((s) => ({ ...s, title: e.target.value }))} required />
                    </div>
                    <div className="space-y-2">
                      <Label>Açıklama (opsiyonel)</Label>
                      <Textarea rows={2} value={editProj.description} onChange={(e) => setEditProj((s) => ({ ...s, description: e.target.value }))} />
                    </div>
                    <div className="grid grid-cols-2 gap-3">
                      <div className="space-y-2">
                        <Label>Repo URL (opsiyonel)</Label>
                        <Input value={editProj.repositoryUrl} onChange={(e) => setEditProj((s) => ({ ...s, repositoryUrl: e.target.value }))} />
                      </div>
                      <div className="space-y-2">
                        <Label>Canlı URL (opsiyonel)</Label>
                        <Input value={editProj.liveUrl} onChange={(e) => setEditProj((s) => ({ ...s, liveUrl: e.target.value }))} />
                      </div>
                    </div>
                    <div className="grid grid-cols-2 gap-3">
                      <div className="space-y-2">
                        <Label>Teknolojiler (virgülle)</Label>
                        <Input value={editProj.technologies} onChange={(e) => setEditProj((s) => ({ ...s, technologies: e.target.value }))} placeholder="React, Node.js" />
                      </div>
                      <div className="space-y-2">
                        <Label>Durum</Label>
                        <Select value={editProj.status} onValueChange={(v) => setEditProj((s) => ({ ...s, status: v ?? "Active" }))}>
                          <SelectTrigger><SelectValue /></SelectTrigger>
                          <SelectContent>
                            <SelectItem value="Active">Aktif</SelectItem>
                            <SelectItem value="Archived">Arşivlendi</SelectItem>
                            <SelectItem value="Draft">Taslak</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <Button type="button" size="sm" className="gap-1.5" disabled={editProjLoading} onClick={() => handleEditProj(proj.id)}>
                        <Check className="h-4 w-4" /> {editProjLoading ? "Kaydediliyor..." : "Kaydet"}
                      </Button>
                      <Button type="button" size="sm" variant="ghost" className="gap-1.5" onClick={handleCancelEditProj}>
                        <X className="h-4 w-4" /> İptal
                      </Button>
                    </div>
                  </div>
                ) : (
                  <div key={proj.id} className="flex items-start justify-between gap-3 rounded-lg border p-3">
                    <div className="flex-1">
                      <p className="font-medium">{proj.title}</p>
                      {proj.technologies && <p className="text-xs text-muted-foreground">{proj.technologies}</p>}
                    </div>
                    <div className="flex items-center gap-1">
                      <Button variant="ghost" size="icon-sm" onClick={() => handleStartEditProj(proj)}><Pencil className="h-4 w-4" /></Button>
                      <Button variant="ghost" size="icon-sm" className="text-destructive hover:text-destructive" onClick={() => handleDeleteProj(proj.id)}><Trash2 className="h-4 w-4" /></Button>
                    </div>
                  </div>
                )
              )}
            </div>
          )}
          {projects.length === 0 && <p className="text-center text-sm text-muted-foreground py-4">Henüz proje eklenmemiş.</p>}
          <Separator />
          <form onSubmit={handleAddProj} className="space-y-3">
            <div className="space-y-2">
              <Label>Başlık</Label>
              <Input placeholder="örn. Portfolify" value={newProj.title} onChange={(e) => setNewProj((s) => ({ ...s, title: e.target.value }))} required />
            </div>
            <div className="space-y-2">
              <Label>Açıklama (opsiyonel)</Label>
              <Textarea rows={2} value={newProj.description} onChange={(e) => setNewProj((s) => ({ ...s, description: e.target.value }))} />
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-2">
                <Label>Repo URL (opsiyonel)</Label>
                <Input value={newProj.repositoryUrl} onChange={(e) => setNewProj((s) => ({ ...s, repositoryUrl: e.target.value }))} />
              </div>
              <div className="space-y-2">
                <Label>Canlı URL (opsiyonel)</Label>
                <Input value={newProj.liveUrl} onChange={(e) => setNewProj((s) => ({ ...s, liveUrl: e.target.value }))} />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-2">
                <Label>Teknolojiler (virgülle)</Label>
                <Input placeholder="React, Node.js, Docker" value={newProj.technologies} onChange={(e) => setNewProj((s) => ({ ...s, technologies: e.target.value }))} />
              </div>
              <div className="space-y-2">
                <Label>Durum</Label>
                <Select value={newProj.status} onValueChange={(v) => setNewProj((s) => ({ ...s, status: v ?? "Active" }))}>
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Active">Aktif</SelectItem>
                    <SelectItem value="Archived">Arşivlendi</SelectItem>
                    <SelectItem value="Draft">Taslak</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            <Button type="submit" variant="outline" className="w-full gap-2" disabled={projLoading || !newProj.title.trim()}>
              <Plus className="h-4 w-4" /> {projLoading ? "Ekleniyor..." : "Proje Ekle"}
            </Button>
          </form>
        </CardContent>
      </Card>

      {/* ===== PROFILE LINKS ===== */}
      <Card className="mt-6">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Link2 className="h-5 w-5 text-primary" />
            Bağlantılar
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {links.length > 0 && (
            <div className="space-y-2">
              {links.map((link) =>
                editingLinkId === link.id ? (
                  <div key={link.id} className="space-y-3 rounded-lg border border-primary p-3">
                    <div className="grid grid-cols-2 gap-3">
                      <div className="space-y-2">
                        <Label>Etiket</Label>
                        <Input value={editLink.label} onChange={(e) => setEditLink((s) => ({ ...s, label: e.target.value }))} required />
                      </div>
                      <div className="space-y-2">
                        <Label>İkon (opsiyonel)</Label>
                        <Input value={editLink.icon} onChange={(e) => setEditLink((s) => ({ ...s, icon: e.target.value }))} placeholder="github, linkedin" />
                      </div>
                    </div>
                    <div className="space-y-2">
                      <Label>URL</Label>
                      <Input value={editLink.url} onChange={(e) => setEditLink((s) => ({ ...s, url: e.target.value }))} required />
                    </div>
                    <div className="flex items-center gap-2">
                      <Button type="button" size="sm" className="gap-1.5" disabled={editLinkLoading} onClick={() => handleEditLink(link.id)}>
                        <Check className="h-4 w-4" /> {editLinkLoading ? "Kaydediliyor..." : "Kaydet"}
                      </Button>
                      <Button type="button" size="sm" variant="ghost" className="gap-1.5" onClick={handleCancelEditLink}>
                        <X className="h-4 w-4" /> İptal
                      </Button>
                    </div>
                  </div>
                ) : (
                  <div key={link.id} className="flex items-center justify-between gap-3 rounded-lg border p-3">
                    <div className="flex-1">
                      <p className="font-medium">{link.label}</p>
                      <p className="text-xs text-muted-foreground truncate">{link.url}</p>
                    </div>
                    <div className="flex items-center gap-1">
                      <Button variant="ghost" size="icon-sm" onClick={() => handleStartEditLink(link)}><Pencil className="h-4 w-4" /></Button>
                      <Button variant="ghost" size="icon-sm" className="text-destructive hover:text-destructive" onClick={() => handleDeleteLink(link.id)}><Trash2 className="h-4 w-4" /></Button>
                    </div>
                  </div>
                )
              )}
            </div>
          )}
          {links.length === 0 && <p className="text-center text-sm text-muted-foreground py-4">Henüz bağlantı eklenmemiş.</p>}
          <Separator />
          <form onSubmit={handleAddLink} className="space-y-3">
            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-2">
                <Label>Etiket</Label>
                <Input placeholder="örn. GitHub" value={newLink.label} onChange={(e) => setNewLink((s) => ({ ...s, label: e.target.value }))} required />
              </div>
              <div className="space-y-2">
                <Label>İkon (opsiyonel)</Label>
                <Input placeholder="github, linkedin, twitter" value={newLink.icon} onChange={(e) => setNewLink((s) => ({ ...s, icon: e.target.value }))} />
              </div>
            </div>
            <div className="space-y-2">
              <Label>URL</Label>
              <Input placeholder="https://..." value={newLink.url} onChange={(e) => setNewLink((s) => ({ ...s, url: e.target.value }))} required />
            </div>
            <Button type="submit" variant="outline" className="w-full gap-2" disabled={linkLoading || !newLink.label.trim() || !newLink.url.trim()}>
              <Plus className="h-4 w-4" /> {linkLoading ? "Ekleniyor..." : "Bağlantı Ekle"}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
