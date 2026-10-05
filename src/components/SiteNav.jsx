import { useEffect, useState } from "react"
import { Menu } from "lucide-react"
import { Button, buttonVariants } from "@/components/ui/button"
import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet"
import { cn } from "@/lib/utils"

const NAV_LINKS = [
  { label: "Beranda", href: "/" },
  { label: "Tentang", href: "/about" },
  { label: "Proyek", href: "/projects" },
  { label: "Pengalaman", href: "/experience" },
  { label: "Kontak", href: "/contact" },
]

export default function SiteNav({ currentPath = "/" }) {
  const [open, setOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)
  const [hidden, setHidden] = useState(false)

  useEffect(() => {
    let lastY = window.scrollY
    const onScroll = () => {
      const y = window.scrollY
      setScrolled(y > 8)
      if (y > lastY && y > 160) setHidden(true)
      else if (y < lastY) setHidden(false)
      lastY = y
    }
    window.addEventListener("scroll", onScroll, { passive: true })
    return () => window.removeEventListener("scroll", onScroll)
  }, [])

  const isActive = (href) =>
    href === "/" ? currentPath === "/" : currentPath.startsWith(href)

  return (
    <header
      className={cn(
        "sticky top-0 z-40 px-6 pt-4 transition-transform duration-300 motion-reduce:transition-none",
        hidden && "-translate-y-full"
      )}
    >
      <nav
        className={cn(
          "mx-auto flex w-full max-w-6xl items-center justify-between rounded-full border border-border/60 bg-background/85 px-5 shadow-soft-md backdrop-blur-md transition-all duration-300 motion-reduce:transition-none supports-[backdrop-filter]:bg-background/70",
          scrolled ? "h-14 shadow-soft-lg" : "h-16"
        )}
        aria-label="Main"
      >
        <a
          href="/"
          className="font-display text-xl font-bold tracking-tight"
          aria-label="Adipra — home"
        >
          Adipra<span className="text-primary">.</span>
        </a>

        <div className="hidden items-center gap-1 md:flex">
          {NAV_LINKS.map((link) => (
            <a
              key={link.href}
              href={link.href}
              aria-current={isActive(link.href) ? "page" : undefined}
              className={cn(
                "rounded-md px-3 py-2 text-sm font-medium transition-colors hover:text-accent",
                isActive(link.href) && "font-semibold text-accent"
              )}
            >
              {link.label}
            </a>
          ))}
          <a
            href="/contact"
            className={cn(buttonVariants({ size: "sm" }), "ml-3")}
          >
            Hubungi Saya
          </a>
        </div>

        <Button
          variant="outline"
          size="icon"
          className="md:hidden"
          aria-label="Open menu"
          onClick={() => setOpen(true)}
        >
          <Menu />
        </Button>
      </nav>

      <Sheet open={open} onOpenChange={setOpen}>
        <SheetContent side="right" className="w-72">
          <SheetHeader>
            <SheetTitle className="font-display text-lg">
              Adipra<span className="text-primary">.</span>
            </SheetTitle>
          </SheetHeader>
          <nav className="flex flex-col gap-1 px-4" aria-label="Mobile">
            {NAV_LINKS.map((link) => (
              <SheetClose asChild key={link.href}>
                <a
                  href={link.href}
                  aria-current={isActive(link.href) ? "page" : undefined}
                  className={cn(
                    "rounded-md px-3 py-2.5 text-base font-medium transition-colors hover:text-accent",
                    isActive(link.href) && "font-semibold text-accent"
                  )}
                >
                  {link.label}
                </a>
              </SheetClose>
            ))}
            <SheetClose asChild>
              <a href="/contact" className={cn(buttonVariants(), "mt-3")}>
                Hubungi Saya
              </a>
            </SheetClose>
          </nav>
        </SheetContent>
      </Sheet>
    </header>
  )
}