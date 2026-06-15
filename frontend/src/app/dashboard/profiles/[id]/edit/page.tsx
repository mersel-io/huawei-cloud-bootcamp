import { api } from "@/lib/api";
import { notFound } from "next/navigation";
import { EditProfileForm } from "@/components/edit-profile-form";

export default async function EditProfilePage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  let profile;
  try {
    const profileRes = await api.profiles.getById(id);
    if (!profileRes.isSuccess || !profileRes.data) {
      notFound();
    }
    profile = profileRes.data;
  } catch {
    notFound();
  }

  return <EditProfileForm profile={profile} />;
}
