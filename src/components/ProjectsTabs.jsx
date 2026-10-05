import { useEffect, useState } from "react"
import { ArrowUpRight, Globe, LayoutGrid, Palette, PenTool, X } from "lucide-react"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

const CATEGORIES = [
  { id: "uiux", label: "UI/UX Design", icon: LayoutGrid },
  { id: "brand", label: "Brand Design", icon: Palette },
  { id: "graphic", label: "Graphic Design", icon: PenTool },
  { id: "web", label: "Web Development", icon: Globe },
]

const TRIGGER_CLASSES =
  "h-auto rounded-full px-5 py-2.5 data-[state=active]:bg-primary data-[state=active]:text-primary-foreground data-[state=active]:shadow-sm"

function ProjectCard({ project, onPreview }) {
  const isGraphic = project.category === "graphic"

  if (isGraphic) {
    return (
      <div
        role="button"
        tabIndex={0}
        onClick={() => onPreview(project)}
        onKeyDown={(e) => {
          if (e.key === "Enter" || e.key === " ") {
            e.preventDefault()
            onPreview(project)
          }
        }}
        className="group relative block aspect-[4/5] cursor-pointer overflow-hidden rounded-card bg-muted shadow-soft-md transition-all hover:-translate-y-1 hover:shadow-soft-lg focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
      >
        <img
          src={project.cover}
          alt={`Cover proyek ${project.title}`}
          loading="lazy"
          className="absolute inset-0 h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
        />
        <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/75 via-black/30 to-transparent px-6 pb-5 pt-16">
          <div className="flex items-center justify-between gap-2">
            <h3 className="font-display text-lg font-semibold text-white">
              {project.title}
            </h3>
            <span className="font-display text-sm font-semibold text-white/85">
              {project.year}
            </span>
          </div>
        </div>
      </div>
    )
  }

  return (
    <a
      href={`/projects/${project.id}`}
      className="group overflow-hidden rounded-card bg-card shadow-soft-md transition-all hover:-translate-y-1 hover:shadow-soft-lg"
    >
      <div className="aspect-[4/3] overflow-hidden bg-muted">
        <img
          src={project.cover}
          alt={`Cover proyek ${project.title}`}
          loading="lazy"
          className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
        />
      </div>
      <div className="p-6">
        <div className="flex items-center justify-between gap-2">
          <h3 className="font-display text-lg font-semibold transition-colors group-hover:text-accent">
            {project.title}
          </h3>
          <span className="font-display text-sm font-semibold text-accent">
            {project.year}
          </span>
        </div>
        <p className="mt-2 line-clamp-2 text-sm leading-relaxed text-muted-foreground">
          {project.description}
        </p>
        <span className="mt-4 inline-flex items-center gap-1.5 font-display text-sm font-semibold text-accent transition-colors duration-300 group-hover:text-primary">
          Lihat
          <ArrowUpRight className="size-4 transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
        </span>
      </div>
    </a>
  )
}

function Lightbox({ project, onClose }) {
  useEffect(() => {
    const onKeyDown = (e) => {
      if (e.key === "Escape") onClose()
    }
    document.addEventListener("keydown", onKeyDown)
    document.body.style.overflow = "hidden"
    return () => {
      document.removeEventListener("keydown", onKeyDown)
      document.body.style.overflow = ""
    }
  }, [onClose])

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/85 p-4 backdrop-blur-sm sm:p-8"
      onClick={onClose}
      role="dialog"
      aria-modal="true"
      aria-label={`Preview ${project.title}`}
    >
      <button
        type="button"
        onClick={onClose}
        aria-label="Tutup"
        className="absolute right-4 top-4 z-10 rounded-full bg-white/10 p-2 text-white transition-colors hover:bg-white/20 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
      >
        <X className="size-6" />
      </button>
      <figure className="flex flex-col" onClick={(e) => e.stopPropagation()}>
        <img
          src={project.cover}
          alt={`Cover proyek ${project.title}`}
          className="mx-auto h-auto max-h-[85vh] w-auto max-w-[90vw] rounded-card object-contain shadow-soft-lg"
        />
        <figcaption className="mt-4 flex items-center justify-between gap-2 text-white">
          <span className="font-display text-lg font-semibold">
            {project.title}
          </span>
          <span className="font-display text-sm font-semibold text-white/85">
            {project.year}
          </span>
        </figcaption>
      </figure>
    </div>
  )
}

export default function ProjectsTabs({ projects }) {
  const [preview, setPreview] = useState(null)
  return (
    <Tabs defaultValue="uiux" className="mt-10">
      <TabsList className="h-auto w-fit flex-wrap gap-3 rounded-none border-0 bg-transparent p-0">
        {CATEGORIES.map((cat) => {
          const count = projects.filter((p) => p.category === cat.id).length
          const Icon = cat.icon
          return (
            <TabsTrigger key={cat.id} value={cat.id} className={TRIGGER_CLASSES}>
              <Icon className="size-4" />
              {cat.label}
              <span className="text-xs opacity-70">{count}</span>
            </TabsTrigger>
          )
        })}
      </TabsList>

      {CATEGORIES.map((cat) => {
        const items = projects.filter((p) => p.category === cat.id)
        return (
          <TabsContent key={cat.id} value={cat.id} className="mt-8">
            {items.length ? (
              <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                {items.map((project) => (
                  <ProjectCard
                    key={project.id}
                    project={project}
                    onPreview={(p) => setPreview(p)}
                  />
                ))}
              </div>
            ) : (
              <p className="rounded-card bg-card p-8 text-center text-muted-foreground shadow-soft-md">
                Belum ada proyek pada kategori ini.
              </p>
            )}
          </TabsContent>
        )
      })}
      {preview && <Lightbox project={preview} onClose={() => setPreview(null)} />}
    </Tabs>
  )
}