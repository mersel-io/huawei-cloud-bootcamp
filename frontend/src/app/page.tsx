import Link from "next/link";
import {
  ArrowRight,
  Globe,
  Layers,
  Link2,
  Sparkles,
  Users,
} from "lucide-react";
import { Button } from "@/components/ui/button";

export default function HomePage() {
  return (
    <div className="flex flex-col">
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-primary/5" />
        <div className="relative mx-auto max-w-6xl px-4 py-24 sm:py-32">
          <div className="mx-auto max-w-3xl text-center">
            <div className="mb-6 inline-flex items-center gap-2 rounded-full border bg-muted/50 px-4 py-1.5 text-sm">
              <Sparkles className="h-4 w-4 text-primary" />
              Dijital kartvizit platformu
            </div>
            <h1 className="text-4xl font-bold tracking-tight sm:text-6xl">
              Tüm dijital varlıklarınız{" "}
              <span className="bg-gradient-to-r from-primary to-primary/60 bg-clip-text text-transparent">
                tek bir sayfada
              </span>
            </h1>
            <p className="mt-6 text-lg leading-8 text-muted-foreground">
              GitHub projeleriniz, LinkedIn profiliniz, blog yazılarınız ve
              sosyal medya hesaplarınızı şık ve modern bir dijital kartvizitte
              toplayın. Anında paylaşın, izlenim bırakın.
            </p>
            <div className="mt-10 flex flex-col items-center gap-4 sm:flex-row sm:justify-center">
              <Link href="/dashboard">
                <Button size="lg" className="gap-2">
                  Hemen Başla
                  <ArrowRight className="h-4 w-4" />
                </Button>
              </Link>
              <Link href="/p/john-doe">
                <Button variant="outline" size="lg">
                  Örneği Gör
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      <section className="border-t bg-muted/30 py-24">
        <div className="mx-auto max-w-6xl px-4">
          <div className="text-center">
            <h2 className="text-3xl font-bold tracking-tight">
              Neden Portfolify?
            </h2>
            <p className="mt-4 text-muted-foreground">
              Geliştiriciler ve teknoloji tutkunları için tasarlandı.
            </p>
          </div>
          <div className="mt-16 grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
            <FeatureCard
              icon={<Globe className="h-6 w-6" />}
              title="Tek Link ile Erişim"
              description="Özel slug adresinizle profilinize anında erişim sağlayın. Biyografinizi, projelerinizi ve linklerinizi tek bir sayfada sergileyin."
            />
            <FeatureCard
              icon={<Layers className="h-6 w-6" />}
              title="Çoklu Profil Desteği"
              description="Farklı amaçlar için farklı profiller oluşturun. İş başvuruları, freelance çalışmalar veya kişisel sunumlar için ayrı kartvizitler."
            />
            <FeatureCard
              icon={<Link2 className="h-6 w-6" />}
              title="Tüm Bağlantılarınız"
              description="GitHub, LinkedIn, Twitter, blog ve daha fazlası. Tüm sosyal medya ve platform hesaplarınızı tek bir yerde yönetin."
            />
            <FeatureCard
              icon={<Sparkles className="h-6 w-6" />}
              title="Modern Tasarım"
              description="Temiz, minimalist ve profesyonel görünümlü dijital kartvizitler. İlk izlenim her zaman önemlidir."
            />
            <FeatureCard
              icon={<Users className="h-6 w-6" />}
              title="Geliştirici Odaklı"
              description="GitHub entegrasyonu, teknik yetenek sergileme ve proje vitrini. Geliştirici kimliğinizi ön plana çıkarın."
            />
          </div>
        </div>
      </section>

      <section className="py-24">
        <div className="mx-auto max-w-6xl px-4 text-center">
          <h2 className="text-3xl font-bold tracking-tight">
            Hemen başlayın
          </h2>
          <p className="mt-4 text-muted-foreground">
            Ücretsiz olarak dijital kartvizitinizi oluşturun ve paylaşmaya başlayın.
          </p>
          <div className="mt-8">
            <Link href="/dashboard">
              <Button size="lg" className="gap-2">
                Kartvizit Oluştur
                <ArrowRight className="h-4 w-4" />
              </Button>
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}

function FeatureCard({
  icon,
  title,
  description,
}: {
  icon: React.ReactNode;
  title: string;
  description: string;
}) {
  return (
    <div className="group rounded-xl border bg-card p-6 transition-all hover:shadow-md hover:border-primary/20">
      <div className="mb-4 inline-flex rounded-lg bg-primary/10 p-3 text-primary">
        {icon}
      </div>
      <h3 className="mb-2 text-lg font-semibold">{title}</h3>
      <p className="text-sm leading-relaxed text-muted-foreground">
        {description}
      </p>
    </div>
  );
}
