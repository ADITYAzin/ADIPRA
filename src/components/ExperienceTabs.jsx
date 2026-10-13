import { useEffect, useState } from "react"
import { Award, BookOpen, CalendarDays, Trophy, X } from "lucide-react"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { supabase } from "@/lib/supabase"

function Lightbox({ item, onClose }) {
  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/85 p-4 backdrop-blur-sm sm:p-8"
      onClick={onClose}
      role="dialog"
      aria-modal="true"
      aria-label={`Preview ${item.title}`}
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
          src={item.img || item.cover}
          alt={item.title}
          className="mx-auto h-auto max-h-[85vh] w-auto max-w-[90vw] rounded-card object-contain shadow-soft-lg"
        />
        <figcaption className="mt-4 flex items-center justify-between gap-2 text-white">
          <span className="font-display text-lg font-semibold">
            {item.title}
          </span>
          <span className="font-display text-sm font-semibold text-white/85">
            {item.year || item.date}
          </span>
        </figcaption>
      </figure>
    </div>
  )
}

function EventArticles({ articles }) {
  if (!articles.length) {
    return (
      <p className="rounded-card bg-card p-8 text-center text-muted-foreground shadow-soft-md">
        Belum ada event.
      </p>
    )
  }

  return (
    <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
      {articles.map((article) => (
        <a
          key={article.id}
          href={`/article/${article.id}`}
          className="group overflow-hidden rounded-card bg-card shadow-soft-md transition-all hover:-translate-y-1 hover:shadow-soft-lg"
        >
          <div className="aspect-[4/3] overflow-hidden bg-muted">
            <img
              src={article.cover}
              alt={article.title}
              loading="lazy"
              className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
            />
          </div>
          <div className="p-6">
            <div className="flex items-center justify-between gap-2">
              <span className="inline-flex rounded-full bg-accent/10 px-2.5 py-0.5 text-xs font-semibold text-accent">
                {article.category}
              </span>
              <time dateTime={article.date} className="font-display text-xs font-medium text-muted-foreground">
                {new Date(article.date).toLocaleDateString("id-ID", {
                  year: "numeric",
                  month: "short",
                })}
              </time>
            </div>
            <h3 className="mt-3 font-display text-lg font-semibold transition-colors group-hover:text-accent">
              {article.title}
            </h3>
            <p className="mt-2 line-clamp-2 text-sm leading-relaxed text-muted-foreground">
              {article.description}
            </p>
          </div>
        </a>
      ))}
    </div>
  )
}

function CertificateCard({ cert, onPreview }) {
  return (
    <div
      role="button"
      tabIndex={0}
      onClick={() => onPreview(cert)}
      onKeyDown={(e) => {
        if (e.key === "Enter" || e.key === " ") {
          e.preventDefault()
          onPreview(cert)
        }
      }}
      className="group relative cursor-pointer overflow-hidden rounded-card bg-card shadow-soft-md transition-all hover:-translate-y-1 hover:shadow-soft-lg focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
    >
      <div className="aspect-[4/3] overflow-hidden bg-muted">
        <img
          src={cert.img}
          alt={`Sertifikat ${cert.title}`}
          loading="lazy"
          className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
        />
      </div>
      <div className="p-6">
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
    </div>
  )
}

const TRIGGER_CLASSES =
  "h-auto rounded-full px-5 py-2.5 data-[state=active]:bg-primary data-[state=active]:text-primary-foreground data-[state=active]:shadow-sm"

export default function ExperienceTabs({
  articles: initialArticles = [],
  competitions: initialCompetitions = [],
  trainings: initialTrainings = [],
}) {
  const [articles, setArticles] = useState(initialArticles)
  const [competitions, setCompetitions] = useState(initialCompetitions)
  const [trainings, setTrainings] = useState(initialTrainings)
  const [preview, setPreview] = useState(null)

  useEffect(() => {
    if (initialArticles && initialArticles.length > 0) setArticles(initialArticles)
  }, [initialArticles])

  useEffect(() => {
    if (initialCompetitions && initialCompetitions.length > 0) setCompetitions(initialCompetitions)
  }, [initialCompetitions])

  useEffect(() => {
    if (initialTrainings && initialTrainings.length > 0) setTrainings(initialTrainings)
  }, [initialTrainings])

  // Background fetch to ensure visitor interface stays in sync with CMS CRUD
  useEffect(() => {
    if (!supabase) return
    Promise.all([
      supabase.from('articles').select('*').order('date', { ascending: false }),
      supabase.from('competitions').select('*').order('created_at', { ascending: false }),
      supabase.from('trainings').select('*').order('created_at', { ascending: false }),
    ]).then(([artRes, compRes, trainRes]) => {
      if (artRes.data && artRes.data.length > 0) setArticles(artRes.data)
      if (compRes.data && compRes.data.length > 0) setCompetitions(compRes.data)
      if (trainRes.data && trainRes.data.length > 0) setTrainings(trainRes.data)
    })
  }, [])

  return (
    <Tabs defaultValue="kompetisi" className="mt-10">
      <TabsList className="h-auto w-fit flex-wrap gap-3 rounded-none border-0 bg-transparent p-0">
        <TabsTrigger value="kompetisi" className={TRIGGER_CLASSES}>
          <Trophy className="size-4" />
          Kompetisi
          <span className="text-xs opacity-70">{competitions.length}</span>
        </TabsTrigger>
        <TabsTrigger value="pelatihan" className={TRIGGER_CLASSES}>
          <BookOpen className="size-4" />
          Pelatihan
          <span className="text-xs opacity-70">{trainings.length}</span>
        </TabsTrigger>
        <TabsTrigger value="event" className={TRIGGER_CLASSES}>
          <CalendarDays className="size-4" />
          Event
          <span className="text-xs opacity-70">{articles.length}</span>
        </TabsTrigger>
      </TabsList>

      <TabsContent value="kompetisi" className="mt-8">
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {competitions.map((cert) => (
            <CertificateCard key={cert.id} cert={cert} onPreview={setPreview} />
          ))}
        </div>
      </TabsContent>

      <TabsContent value="pelatihan" className="mt-8">
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {trainings.map((cert) => (
            <CertificateCard key={cert.id} cert={cert} onPreview={setPreview} />
          ))}
        </div>
      </TabsContent>

      <TabsContent value="event" className="mt-8">
        <EventArticles articles={articles} />
      </TabsContent>

      {preview && <Lightbox item={preview} onClose={() => setPreview(null)} />}
    </Tabs>
  )
}