import { useEffect, useRef, useState } from "react"
import {
  motion,
  useReducedMotion,
  useScroll,
  useSpring,
  useTransform,
} from "framer-motion"
import { ArrowDown, ArrowUpRight } from "lucide-react"
import { cn } from "@/lib/utils"
import { supabase } from "@/lib/supabase"

const EASE = [0.22, 1, 0.36, 1]

const DEFAULT_EXPERIENCES = [
  {
    img: "/images/article/festika-article.jpg",
    title: "Juara 1 Lomba AI Jawa Timur",
    year: "2025",
    href: "/article/juara-1-lomba-ai-jawa-timur",
  },
  {
    img: "/images/article/skomda-mengajar-article.png",
    title: "SKOMDA Mengajar",
    year: "2026",
    href: "/article/skomda-mengajar",
  },
  {
    img: "/images/article/ai-for-social-impact-article.jpeg",
    title: "AI for Social Impact",
    year: "2026",
    href: "/article/ai-for-social-impact",
  },
  {
    img: "/images/certificates/competition/compfest-certificate.png",
    title: "COMPFEST",
    year: "2024",
    href: "/experience",
  },
]

function formatExperiences(articles = [], competitions = []) {
  const list = []
  if (Array.isArray(articles) && articles.length > 0) {
    for (const a of articles.slice(0, 3)) {
      list.push({
        img: a.cover,
        title: a.title,
        year: a.date ? new Date(a.date).getFullYear().toString() : "2026",
        href: `/article/${a.id}`,
      })
    }
  }
  if (Array.isArray(competitions) && competitions.length > 0) {
    for (const c of competitions.slice(0, 2)) {
      list.push({
        img: c.img,
        title: c.title,
        year: c.year ? c.year.toString() : "2025",
        href: "/experience",
      })
    }
  }
  return list.length > 0 ? list.slice(0, 5) : DEFAULT_EXPERIENCES
}

function ExperienceCard({ item, className }) {
  return (
    <a
      href={item.href || "/experience"}
      className={cn(
        "group relative block h-full w-full overflow-hidden rounded-card bg-card shadow-soft-md transition-shadow duration-300 hover:shadow-soft-xl hover:-translate-y-1",
        className
      )}
    >
      <img
        src={item.img}
        alt={item.title}
        loading="lazy"
        className="absolute inset-0 h-full w-full object-cover transition-transform duration-700 group-hover:scale-110"
      />
      <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/10 to-transparent" />

      <div className="absolute inset-x-0 bottom-0 flex items-end justify-between gap-3 p-5 sm:p-6">
        <h3 className="font-display text-xl font-bold text-white sm:text-2xl">
          {item.title}
        </h3>
        <span className="shrink-0 font-display text-sm font-bold text-white/85">
          {item.year}
        </span>
      </div>
    </a>
  )
}

function SpotlightCard({ x, offset, viewportWidth, index, className, children }) {
  const scale = useTransform(x, (v) => {
    if (!offset || viewportWidth === 0) return 1
    const center = offset.start + v + offset.width / 2
    const d = Math.abs(center - viewportWidth / 2) / (viewportWidth / 2)
    return 1 - 0.12 * Math.min(d, 1)
  })
  const filter = useTransform(x, (v) => {
    if (!offset || viewportWidth === 0) return "brightness(1)"
    const center = offset.start + v + offset.width / 2
    const d = Math.abs(center - viewportWidth / 2) / (viewportWidth / 2)
    return `brightness(${1 - 0.22 * Math.min(d, 1)})`
  })

  return (
    <motion.div
      style={{ scale, filter }}
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.5 }}
      transition={{ duration: 0.6, ease: EASE, delay: 0.12 * index }}
      className={className}
    >
      {children}
    </motion.div>
  )
}

export default function ExperienceShowcase({ articles: propArticles, competitions: propCompetitions }) {
  const reducedMotion = useReducedMotion()
  const sectionRef = useRef(null)
  const trackRef = useRef(null)
  const [experiences, setExperiences] = useState(() =>
    formatExperiences(propArticles, propCompetitions)
  )
  const [travel, setTravel] = useState(0)
  const [offsets, setOffsets] = useState([])
  const [viewportWidth, setViewportWidth] = useState(0)

  useEffect(() => {
    if (propArticles || propCompetitions) {
      setExperiences(formatExperiences(propArticles, propCompetitions))
    }
  }, [propArticles, propCompetitions])

  // Background fetch from Supabase to keep visitor view synchronized with CRUD
  useEffect(() => {
    if (!supabase) return
    Promise.all([
      supabase.from('articles').select('*').order('date', { ascending: false }).limit(3),
      supabase.from('competitions').select('*').order('created_at', { ascending: false }).limit(2),
    ]).then(([artRes, compRes]) => {
      if ((artRes.data && artRes.data.length > 0) || (compRes.data && compRes.data.length > 0)) {
        setExperiences(formatExperiences(artRes.data || [], compRes.data || []))
      }
    })
  }, [])

  useEffect(() => {
    if (reducedMotion) return
    const measure = () => {
      const el = trackRef.current
      if (!el) return
      setTravel(Math.max(0, el.scrollWidth - el.clientWidth))
      const children = Array.from(el.children)
      setOffsets(
        children.map((child) => ({
          start: child.offsetLeft - el.offsetLeft,
          width: child.offsetWidth,
        }))
      )
      setViewportWidth(el.clientWidth)
    }
    measure()
    const ro = new ResizeObserver(measure)
    if (trackRef.current) ro.observe(trackRef.current)
    window.addEventListener("resize", measure)
    return () => {
      ro.disconnect()
      window.removeEventListener("resize", measure)
    }
  }, [reducedMotion, experiences])

  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start start", "end end"],
  })
  const smooth = useSpring(scrollYProgress, {
    stiffness: 90,
    damping: 26,
    mass: 0.5,
    restDelta: 0.0005,
  })
  const x = useTransform(smooth, [0, 1], [0, -travel])

  const contentOpacity = useTransform(scrollYProgress, [0.86, 1], [1, 0])
  const contentScale = useTransform(scrollYProgress, [0.86, 1], [1, 0.98])

  if (reducedMotion) {
    return (
      <section className="relative mx-auto max-w-6xl px-6 py-24 sm:py-28">
        <h2 className="font-display text-3xl font-bold tracking-tight sm:text-4xl">
          Pengalaman <span className="text-primary">Berharga</span>
        </h2>
        <div className="mt-12 grid gap-6 sm:grid-cols-2">
          {experiences.map((item) => (
            <ExperienceCard
              key={item.title}
              item={item}
              className="aspect-video w-full"
            />
          ))}
        </div>
      </section>
    )
  }

  return (
    <section
      ref={sectionRef}
      style={{ height: `calc(100vh + ${travel}px)` }}
      className="relative"
    >
      <motion.div
        style={{ opacity: contentOpacity, scale: contentScale }}
        className="sticky top-0 flex h-screen flex-col justify-center overflow-hidden"
      >
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.5 }}
          transition={{ duration: 0.7, ease: EASE }}
          className="mx-auto w-full max-w-6xl px-6"
        >
          <h2 className="font-display text-3xl font-bold tracking-tight sm:text-4xl">
            Pengalaman <span className="text-primary">Berharga</span>
          </h2>
          <p className="mt-4 max-w-2xl text-lg leading-relaxed text-muted-foreground">
            Momen-momen yang membentuk cara saya berpikir dan berkarya.
          </p>
        </motion.div>

        <motion.div
          ref={trackRef}
          style={{ x }}
          className="mt-10 flex items-stretch gap-6 pl-[clamp(1.5rem,calc((100vw-72rem)/2+1.5rem),50vw)] pr-8"
        >
          {experiences.map((item, index) => (
            <SpotlightCard
              key={item.title}
              x={x}
              offset={offsets[index]}
              viewportWidth={viewportWidth}
              index={index}
              className="aspect-video w-[88vw] shrink-0 sm:w-[36rem]"
            >
              <ExperienceCard item={item} />
            </SpotlightCard>
          ))}

          <SpotlightCard
            x={x}
            offset={offsets[experiences.length]}
            viewportWidth={viewportWidth}
            index={experiences.length}
            className="aspect-video w-[88vw] shrink-0 sm:w-[36rem]"
          >
            <a
              href="/experience"
              className="group relative flex h-full w-full flex-col items-center justify-center gap-3 overflow-hidden rounded-card bg-primary text-primary-foreground shadow-soft-md transition-shadow duration-300 hover:shadow-soft-xl"
            >
              <span className="flex h-12 w-12 items-center justify-center rounded-full bg-white/15 backdrop-blur-sm transition-transform duration-300 group-hover:scale-110">
                <ArrowUpRight className="size-5" />
              </span>
              <p className="font-display text-xl font-bold sm:text-2xl">
                Lihat Semua Pengalaman
              </p>
            </a>
          </SpotlightCard>
        </motion.div>

        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-y-0 left-0 z-10 w-16 bg-gradient-to-r from-background to-transparent sm:w-32"
        />
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-y-0 right-0 z-10 w-16 bg-gradient-to-l from-background to-transparent sm:w-32"
        />

        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.6, delay: 1 }}
          className="pointer-events-none absolute bottom-8 left-1/2 z-10 flex -translate-x-1/2 items-center gap-2 text-xs text-muted-foreground"
        >
          <motion.span
            aria-hidden="true"
            animate={{ y: [0, 5, 0] }}
            transition={{ duration: 1.8, repeat: Infinity, ease: "easeInOut" }}
          >
            <ArrowDown className="size-3.5" />
          </motion.span>
          Gulir untuk menjelajah
        </motion.p>

        <div className="absolute inset-x-0 bottom-0 z-10 h-[3px] bg-muted/60">
          <motion.div
            style={{ scaleX: smooth, transformOrigin: "left" }}
            className="h-full w-full bg-primary"
          />
        </div>
      </motion.div>
    </section>
  )
}