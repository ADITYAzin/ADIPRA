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

function GithubIcon({ className = "size-4" }) {
  return (
    <svg
      role="img"
      viewBox="0 0 24 24"
      fill="currentColor"
      className={className}
      aria-hidden="true"
    >
      <path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0024 12c0-6.63-5.37-12-12-12z" />
    </svg>
  )
}

function ProjectCard({ project, onPreview }) {
  const isGraphic = project.category === "graphic"
  const isWeb = project.category === "web"

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

  const liveUrl = project.live_url || project.url || "#"
  const githubUrl = project.github_url || project.repo_url || project.github || "#"

  return (
    <div className="group flex flex-col justify-between overflow-hidden rounded-card bg-card shadow-soft-md transition-all hover:-translate-y-1 hover:shadow-soft-lg">
      <div>
        <a
          href={`/projects/${project.id}`}
          className="block aspect-[4/3] overflow-hidden bg-muted"
        >
          <img
            src={project.cover}
            alt={`Cover proyek ${project.title}`}
            loading="lazy"
            className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
          />
        </a>
        <div className="p-6 pb-0">
          <div className="flex items-center justify-between gap-2">
            <a href={`/projects/${project.id}`} className="transition-colors hover:text-accent">
              <h3 className="font-display text-lg font-semibold transition-colors group-hover:text-accent">
                {project.title}
              </h3>
            </a>
            <span className="font-display text-sm font-semibold text-accent">
              {project.year}
            </span>
          </div>
          <p className="mt-2 line-clamp-2 text-sm leading-relaxed text-muted-foreground">
            {project.description}
          </p>
        </div>
      </div>

      <div className="p-6 pt-4">
        <div className="flex items-center justify-between gap-2">
          <a
            href={`/projects/${project.id}`}
            className="inline-flex items-center gap-1.5 font-display text-sm font-semibold text-accent transition-colors duration-300 group-hover:text-primary"
          >
            Lihat
            <ArrowUpRight className="size-4 transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
          </a>

          {(isWeb || project.live_url || project.github_url) && (
            <div className="flex items-center gap-2">
              <a
                href={liveUrl}
                target={liveUrl !== "#" ? "_blank" : undefined}
                rel={liveUrl !== "#" ? "noopener noreferrer" : undefined}
                onClick={(e) => {
                  if (liveUrl === "#") e.preventDefault()
                }}
                className="inline-flex h-8 items-center gap-1.5 rounded bg-primary px-3 text-xs font-semibold text-primary-foreground shadow-soft-sm transition-all duration-200 hover:bg-primary/90"
              >
                Buka
                <ArrowUpRight className="size-3.5" />
              </a>
              <a
                href={githubUrl}
                target={githubUrl !== "#" ? "_blank" : undefined}
                rel={githubUrl !== "#" ? "noopener noreferrer" : undefined}
                onClick={(e) => {
                  if (githubUrl === "#") e.preventDefault()
                }}
                aria-label={`Repository GitHub ${project.title}`}
                title="Repository GitHub"
                className="inline-flex size-8 items-center justify-center rounded bg-black text-white shadow-soft-sm transition-all duration-200 hover:bg-black/80"
              >
                <GithubIcon className="size-4" />
              </a>
            </div>
          )}
        </div>
      </div>
    </div>
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