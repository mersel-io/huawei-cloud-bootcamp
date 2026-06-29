import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Compass } from "lucide-react";

export default function NotFound() {
  return (
    <div className="relative flex min-h-[60vh] flex-col items-center justify-center gap-6 overflow-hidden px-4 text-center">
      <div
        className="pointer-events-none absolute inset-0 -z-10"
        style={{
          backgroundImage:
            "radial-gradient(circle at 1px 1px, var(--border) 1px, transparent 0)",
          backgroundSize: "32px 32px",
          maskImage:
            "radial-gradient(ellipse 60% 60% at 50% 50%, black 20%, transparent 80%)",
          WebkitMaskImage:
            "radial-gradient(ellipse 60% 60% at 50% 50%, black 20%, transparent 80%)",
        }}
      />
      <div className="pointer-events-none absolute -top-20 left-1/2 -z-10 h-72 w-[500px] -translate-x-1/2 rounded-full bg-primary/10 blur-[100px]" />

      <div className="flex size-20 items-center justify-center rounded-2xl bg-primary/10 text-primary">
        <Compass className="size-9" />
      </div>
      <div>
        <p className="text-6xl font-bold tracking-tight text-primary">404</p>
        <h1 className="mt-2 text-2xl font-bold">Sayfa Bulunamadı</h1>
        <p className="mt-2 text-muted-foreground">
          Aradığınız sayfa mevcut değil veya taşınmış olabilir.
        </p>
      </div>
      <Link href="/">
        <Button size="lg" className="gap-2">
          Ana Sayfaya Dön
        </Button>
      </Link>
    </div>
  );
}
