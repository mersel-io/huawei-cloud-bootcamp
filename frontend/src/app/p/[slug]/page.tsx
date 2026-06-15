import { api } from "@/lib/api";
import { notFound } from "next/navigation";
import { ProfileCardView } from "@/components/profile-card-view";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  try {
    const res = await api.profiles.getBySlug(slug);
    if (!res.isSuccess || !res.data) return { title: "Portfolify" };
    return {
      title: `${res.data.title} - Portfolify`,
      description: res.data.bio || res.data.subtitle || undefined,
    };
  } catch {
    return { title: "Portfolify" };
  }
}

export default async function PublicProfilePage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;

  let profile;
  let user;
  try {
    const profileRes = await api.profiles.getBySlug(slug);
    if (!profileRes.isSuccess || !profileRes.data) {
      notFound();
    }
    profile = profileRes.data;

    const userRes = await api.users.getById(profile.userId);
    user = userRes.isSuccess ? userRes.data : null;
  } catch {
    notFound();
  }

  return <ProfileCardView profile={profile} user={user} />;
}
