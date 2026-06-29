import Link from "next/link";
import {
  ArrowRight,
  Globe,
  Layers,
  Link2,
  Sparkles,
  Users,
  Check,
  Star,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

const features = [
  {
    icon: Globe,
    title: "Tek Link ile Erişim",
    description:
      "Özel slug adresinizle profilinize anında erişim sağlayın. Biyografinizi, projelerinizi ve linklerinizi tek bir sayfada sergileyin.",
  },
  {
    icon: Layers,
    title: "Çoklu Profil Desteği",
    description:
      "Farklı amaçlar için farklı profiller oluşturun. İş başvuruları, freelance çalışmalar veya kişisel sunumlar için ayrı kartvizitler.",
  },
  {
    icon: Link2,
    title: "Tüm Bağlantılarınız",
    description:
      "GitHub, LinkedIn, Twitter, blog ve daha fazlası. Tüm sosyal medya ve platform hesaplarınızı tek bir yerde yönetin.",
  },
  {
    icon: Sparkles,
    title: "Modern Tasarım",
    description:
      "Temiz, minimalist ve profesyonel görünümlü dijital kartvizitler. İlk izlenim her zaman önemlidir.",
  },
  {
    icon: Users,
    title: "Geliştirici Odaklı",
    description:
      "GitHub entegrasyonu, teknik yetenek sergileme ve proje vitrini. Geliştirici kimliğinizi ön plana çıkarın.",
  },
  {
    icon: Star,
    title: "Yetenek & Deneyim",
    description:
      "Yeteneklerinizi, iş deneyiminizi, eğitim geçmişinizi ve projelerinizi detaylıca sergileyin. Tüm bilgiler düzenli ve şık.",
  },
];

const steps = [
  {
    number: "01",
    title: "Hesap Oluştur",
    description: "Saniyeler içinde ücretsiz hesabınızı oluşturun.",
  },
  {
    number: "02",
    title: "Profilinizi Düzenleyin",
    description: "Bilgilerinizi, yeteneklerinizi ve projelerinizi ekleyin.",
  },
  {
    number: "03",
    title: "Paylaşın",
    description: "Tek bir linkle dijital kartvizitinizi tüm dünyayla paylaşın.",
  },
];

export default function HomePage() {
  return (
    <div className="flex flex-col">
      <section className="relative overflow-hidden">
        <div
          className="pointer-events-none absolute inset-0 -z-10"
          style={{
            backgroundImage:
              "radial-gradient(circle at 1px 1px, var(--border) 1px, transparent 0)",
            backgroundSize: "40px 40px",
            maskImage:
              "radial-gradient(ellipse 80% 60% at 50% 0%, black 30%, transparent 80%)",
            WebkitMaskImage:
              "radial-gradient(ellipse 80% 60% at 50% 0%, black 30%, transparent 80%)",
          }}
        />
        <div className="pointer-events-none absolute -top-40 left-1/2 -z-10 h-[500px] w-[800px] -translate-x-1/2 rounded-full bg-primary/10 blur-[120px]" />

        <div className="relative mx-auto max-w-6xl px-4 py-24 sm:py-32">
          <div className="mx-auto max-w-3xl text-center">
            <div className="mb-8 inline-flex items-center gap-2 rounded-full border bg-muted/50 px-4 py-1.5 text-sm backdrop-blur-sm">
              <Sparkles className="size-3.5 text-primary" />
              Dijital kartvizit platformu
            </div>
            <h1 className="text-4xl font-bold tracking-tight text-balance sm:text-6xl">
              Tüm dijital varlıklarınız{" "}
              <span className="bg-gradient-to-r from-primary via-primary to-violet-500 bg-clip-text text-transparent">
                tek bir sayfada
              </span>
            </h1>
            <p className="mt-6 text-lg leading-relaxed text-muted-foreground text-pretty">
              GitHub projeleriniz, LinkedIn profiliniz, blog yazılarınız ve
              sosyal medya hesaplarınızı şık ve modern bir dijital kartvizitte
              toplayın. Anında paylaşın, izlenim bırakın.
            </p>
            <div className="mt-10 flex flex-col items-center gap-3 sm:flex-row sm:justify-center">
              <Link href="/register">
                <Button size="lg" className="w-full gap-2 sm:w-auto">
                  Hemen Başla
                  <ArrowRight className="size-4" />
                </Button>
              </Link>
              <Link href="/p/john-doe">
                <Button variant="outline" size="lg" className="w-full sm:w-auto">
                  Örneği Gör
                </Button>
              </Link>
            </div>
            <div className="mt-8 flex flex-wrap items-center justify-center gap-x-6 gap-y-2 text-sm text-muted-foreground">
              {["Ücretsiz", "Kayıt gerektirmez", "Anında yayınla"].map((item) => (
                <span key={item} className="inline-flex items-center gap-1.5">
                  <Check className="size-4 text-primary" />
                  {item}
                </span>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section className="border-y bg-muted/30 py-24">
        <div className="mx-auto max-w-6xl px-4">
          <div className="mx-auto max-w-2xl text-center">
            <Badge variant="secondary" className="mb-4">
              Özellikler
            </Badge>
            <h2 className="text-3xl font-bold tracking-tight text-balance">
              Neden Portfolify?
            </h2>
            <p className="mt-4 text-muted-foreground text-pretty">
              Geliştiriciler ve teknoloji tutkunları için tasarlandı. Tüm
              profesyonel varlıklarınızı tek bir yerden yönetin.
            </p>
          </div>
          <div className="mt-16 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {features.map((feature) => (
              <div
                key={feature.title}
                className="group relative overflow-hidden rounded-xl border bg-card p-6 transition-all hover:shadow-lg hover:shadow-primary/5 hover:-translate-y-0.5"
              >
                <div className="mb-4 inline-flex rounded-xl bg-primary/10 p-3 text-primary transition-transform group-hover:scale-110">
                  <feature.icon className="size-5" />
                </div>
                <h3 className="mb-2 text-lg font-semibold">{feature.title}</h3>
                <p className="text-sm leading-relaxed text-muted-foreground">
                  {feature.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-24">
        <div className="mx-auto max-w-6xl px-4">
          <div className="mx-auto max-w-2xl text-center">
            <Badge variant="secondary" className="mb-4">
              Nasıl Çalışır?
            </Badge>
            <h2 className="text-3xl font-bold tracking-tight">
              3 adımda başlayın
            </h2>
            <p className="mt-4 text-muted-foreground">
              Dakikalar içinde profesyonel bir dijital kartvizit oluşturun.
            </p>
          </div>
          <div className="mt-16 grid gap-8 md:grid-cols-3">
            {steps.map((step, i) => (
              <div key={step.number} className="relative text-center">
                {i < steps.length - 1 && (
                  <div className="absolute top-8 left-1/2 hidden h-px w-full bg-border md:block" />
                )}
                <div className="relative inline-flex size-16 items-center justify-center rounded-2xl bg-primary text-lg font-bold text-primary-foreground">
                  {step.number}
                </div>
                <h3 className="mt-4 text-lg font-semibold">{step.title}</h3>
                <p className="mt-2 text-sm text-muted-foreground">
                  {step.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-24">
        <div className="mx-auto max-w-6xl px-4">
          <div className="relative overflow-hidden rounded-3xl border bg-gradient-to-br from-primary/10 via-primary/5 to-transparent px-6 py-16 text-center sm:px-16 sm:py-24">
            <div className="pointer-events-none absolute -top-24 left-1/2 h-64 w-[600px] -translate-x-1/2 rounded-full bg-primary/15 blur-[100px]" />
            <div className="relative">
              <h2 className="text-3xl font-bold tracking-tight text-balance sm:text-4xl">
                Hemen başlayın
              </h2>
              <p className="mx-auto mt-4 max-w-lg text-muted-foreground text-pretty">
                Ücretsiz olarak dijital kartvizitinizi oluşturun ve paylaşmaya
                başlayın. Kredi kartı gerekmez.
              </p>
              <div className="mt-8">
                <Link href="/register">
                  <Button size="lg" className="gap-2">
                    Kartvizit Oluştur
                    <ArrowRight className="size-4" />
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
