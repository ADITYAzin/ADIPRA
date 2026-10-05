import { ArrowUpRight, Mail, MapPin } from "lucide-react"
import { buttonVariants } from "@/components/ui/button"
import { cn } from "@/lib/utils"

const NAV_LINKS = [
  { label: "Beranda", href: "/" },
  { label: "Tentang", href: "/about" },
  { label: "Proyek", href: "/projects" },
  { label: "Pengalaman", href: "/experience" },
  { label: "Kontak", href: "/contact" },
]

export default function SiteFooter() {
  return (
    <footer className="border-t border-border bg-background">
      <div className="mx-auto max-w-6xl px-6 py-12">
        <div className="grid gap-10 md:grid-cols-[1.5fr_1fr_1fr]">
          <div>
            <a
              href="/"
              className="font-display text-xl font-bold tracking-tight"
              aria-label="Adipra — home"
            >
              Adipra<span className="text-primary">.</span>
            </a>
            <p className="mt-4 max-w-sm text-sm leading-relaxed text-muted-foreground">
              Desainer & pengembang yang menciptakan pengalaman digital yang
              bersih dan intuitif — dari desain UI/UX hingga pengembangan
              frontend.
            </p>
          </div>

          <div>
            <h2 className="font-display text-sm font-semibold uppercase tracking-[0.2em] text-muted-foreground">
              Menu
            </h2>
            <ul className="mt-4 space-y-3">
              {NAV_LINKS.map((link) => (
                <li key={link.href}>
                  <a
                    href={link.href}
                    className="text-sm text-muted-foreground transition-colors hover:text-foreground"
                  >
                    {link.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h2 className="font-display text-sm font-semibold uppercase tracking-[0.2em] text-muted-foreground">
              Kontak
            </h2>
            <ul className="mt-4 space-y-3 text-sm text-muted-foreground">
              <li>
                <a
                  href="mailto:adityapratamaputra.id@gmail.com"
                  className="inline-flex items-center gap-2 transition-colors hover:text-foreground"
                >
                  <Mail className="size-4" />
                  adityapratamaputra.id@gmail.com
                </a>
              </li>
              <li className="inline-flex items-center gap-2">
                <MapPin className="size-4" />
                Sidoarjo, Indonesia
              </li>
            </ul>
            <a
              href="/contact"
              className={cn(
                buttonVariants({ variant: "outline", size: "sm" }),
                "mt-5"
              )}
            >
              Hubungi Saya
              <ArrowUpRight className="size-4" />
            </a>
          </div>
        </div>

        <div className="mt-12 border-t border-border pt-6">
          <p className="text-sm text-muted-foreground">
            © {new Date().getFullYear()} Adipra. Dibangun dengan Astro & Tailwind CSS.
          </p>
        </div>
      </div>
    </footer>
  )
}