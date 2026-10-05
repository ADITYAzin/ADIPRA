import { useState } from "react"
import { cn } from "@/lib/utils"

const FILTERS = [
  { id: "kompetisi", label: "Kompetisi" },
  { id: "pelatihan", label: "Pelatihan" },
]

function CertificateCard({ cert }) {
  return (
    <article className="group overflow-hidden rounded-2xl border border-border bg-card shadow-card transition-all hover:-translate-y-1 hover:shadow-card-lg">
      <div className="aspect-[4/3] overflow-hidden bg-muted">
        <img
          src={cert.img}
          alt={`Sertifikat ${cert.title}`}
          loading="lazy"
          className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
        />
      </div>
      <div className="p-5">
        <div className="flex items-center justify-between gap-2">
          <h3 className="font-display text-lg font-semibold">{cert.title}</h3>
          <span className="font-display text-sm font-semibold text-accent">
            {cert.year}
          </span>
        </div>
        <p className="mt-1 text-sm text-muted-foreground">{cert.issuer}</p>
        <div className="mt-4">
          <span className="inline-flex items-center rounded-full bg-accent/10 px-2.5 py-0.5 text-xs font-medium text-accent">
            {cert.category}
          </span>
        </div>
      </div>
    </article>
  )
}

export default function CertificateGallery({ competitions, trainings }) {
  const [filter, setFilter] = useState("kompetisi")

  const items = [
    ...competitions.map((c) => ({ ...c, type: "kompetisi" })),
    ...trainings.map((t) => ({ ...t, type: "pelatihan" })),
  ]
  const visible = items.filter((i) => i.type === filter)

  return (
    <div>
      <div className="mb-8 flex w-fit flex-col items-start gap-3 rounded-none border-0 bg-transparent p-0 sm:flex-row sm:items-center">
        {FILTERS.map((f) => (
          <button
            key={f.id}
            type="button"
            onClick={() => setFilter(f.id)}
            aria-pressed={filter === f.id}
            className={cn(
              "h-auto rounded-full px-5 py-2.5 text-sm font-medium transition-colors",
              filter === f.id
                ? "bg-primary text-primary-foreground shadow-sm"
                : "text-muted-foreground hover:text-accent"
            )}
          >
            {f.label}
          </button>
        ))}
      </div>

      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {visible.map((cert) => (
          <CertificateCard key={cert.id} cert={cert} />
        ))}
      </div>
    </div>
  )
}