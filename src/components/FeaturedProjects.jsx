import { useEffect, useRef, useState } from "react"
import {
  motion,
  useMotionValue,
  useReducedMotion,
  useScroll,
  useSpring,
  useTransform,
} from "framer-motion"
import { ArrowUpRight, X } from "lucide-react"
import { cn } from "@/lib/utils"
import projects from "../data/projects.json"

const EASE = [0.22, 1, 0.36, 1]

const TITLE_STAGGER = {
  hidden: {},
  show: { transition: { staggerChildren: 0.15, delayChildren: 0.1 } },
}

const TITLE_WORD = {
  hidden: { opacity: 0, y: 40 },
  show: { opacity: 1, y: 0, transition: { duration: 0.7, ease: EASE } },
}

const CATEGORY_LABEL = {
  uiux: "UI/UX Design",
  brand: "Brand Design",
  graphic: "Graphic Design",
  web: "Web Development",
}

const HIGHLIGHTS = {
  samling: "Juara 1 FESTIKA Jatim",
  tasky: "Featured",
}

const FEATURED_IDS = ["samling", "tasky", "rc-brand", "poster-tunanevice"]

function FeaturedCard({ project, index, onPreview }) {
  const reducedMotion = useReducedMotion()
  const cardRef = useRef(null)
  const highlight = HIGHLIGHTS[project.id]
  const isGraphic = project.category === "graphic"
  const MotionTag = isGraphic ? motion.div : motion.a

  const { scrollYProgress } = useScroll({
    target: cardRef,
    offset: ["start end", "end start"],
  })
  const parallaxY = useTransform(scrollYProgress, [0, 1], ["-6%", "6%"])

  const mx = useMotionValue(0)
  const my = useMotionValue(0)
  const arrowX = useSpring(mx, { stiffness: 200, damping: 18 })
  const arrowY = useSpring(my, { stiffness: 200, damping: 18 })

  const handleMouseMove = (e) => {
    if (reducedMotion) return
    const rect = e.currentTarget.getBoundingClientRect()
    e.currentTarget.style.setProperty("--spot-x", `${e.clientX - rect.left}px`)
    e.currentTarget.style.setProperty("--spot-y", `${e.clientY - rect.top}px`)
    mx.set((e.clientX - rect.left - rect.width / 2) * 0.06)
    my.set((e.clientY - rect.top - rect.height / 2) * 0.06)
  }

  const handleMouseLeave = () => {
    if (reducedMotion) return
    mx.set(0)
    my.set(0)
  }

  return (
    <MotionTag
      ref={cardRef}
      href={isGraphic ? undefined : `/projects/${project.id}`}
      onClick={
        isGraphic
          ? (e) => {
              e.preventDefault()
              onPreview(project)
            }
          : undefined
      }
      role={isGraphic ? "button" : undefined}
      tabIndex={isGraphic ? 0 : undefined}
      onKeyDown={
        isGraphic
          ? (e) => {
              if (e.key === "Enter" || e.key === " ") {
                e.preventDefault()
                onPreview(project)
              }
            }
          : undefined
      }
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.5 }}
      transition={{ duration: 0.6, ease: EASE, delay: 0.12 * index }}
      className="group relative block aspect-[4/3] cursor-pointer overflow-hidden rounded-card bg-card shadow-soft-md transition-all duration-300 hover:-translate-y-1 hover:shadow-soft-xl"
    >
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 z-20 opacity-0 transition-opacity duration-300 group-hover:opacity-100"
        style={{
          backgroundImage:
            "radial-gradient(340px circle at var(--spot-x, 50%) var(--spot-y, 50%), rgba(37, 99, 235, 0.18), transparent 70%)",
        }}
      />

      <motion.img
        src={project.cover}
        alt={`Cover proyek ${project.title}`}
        loading="lazy"
        style={reducedMotion ? undefined : { y: parallaxY }}
        className="absolute inset-0 h-full w-full scale-[1.15] object-cover transition-transform duration-700 ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:scale-[1.25] will-change-transform"
      />
      <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/25 to-transparent" />
      <div className="absolute inset-0 bg-primary/10 opacity-0 transition-opacity duration-300 group-hover:opacity-100" />

      <div className="absolute inset-x-0 top-0 z-10 flex items-center justify-between gap-3 p-5 transition-transform duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:-translate-y-1 sm:p-6">
        <span className="inline-flex rounded-full bg-primary px-3.5 py-1.5 text-xs font-semibold text-primary-foreground shadow-soft-sm">
          {CATEGORY_LABEL[project.category]}
        </span>
        <span className="font-display text-sm font-bold text-white/90">
          {project.year}
        </span>
      </div>

      <div className="absolute inset-x-0 bottom-0 z-10 flex items-end justify-between gap-4 p-5 transition-transform duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:-translate-y-1.5 sm:p-7">
        <div>
          {highlight && (
            <motion.span
              animate={reducedMotion ? undefined : { y: [0, -6, 0] }}
              transition={{
                duration: 5,
                repeat: Infinity,
                ease: "easeInOut",
                delay: index * 0.4,
              }}
              className="mb-2 inline-flex rounded-full bg-primary px-3 py-1 text-xs font-bold text-primary-foreground shadow-soft-md"
            >
              {highlight}
            </motion.span>
          )}
          <h3 className="font-display text-xl font-semibold text-white sm:text-2xl">
            {project.title}
          </h3>
        </div>
        <motion.span
          style={reducedMotion ? undefined : { x: arrowX, y: arrowY }}
          className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-white/15 text-white backdrop-blur-sm transition-colors duration-300 group-hover:bg-white group-hover:text-primary"
        >
          <ArrowUpRight className="size-5" />
        </motion.span>
      </div>
    </MotionTag>
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

export default function FeaturedProjects() {
  const reducedMotion = useReducedMotion()
  const sectionRef = useRef(null)
  const [preview, setPreview] = useState(null)
  const featured = FEATURED_IDS.map((id) =>
    projects.find((p) => p.id === id)
  ).filter(Boolean)

  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start start", "end start"],
  })
  const overlayOpacity = useTransform(scrollYProgress, [0.6, 1], [0, 1])

  return (
    <section
      ref={sectionRef}
      className="relative w-full py-24 sm:py-28"
    >
      {!reducedMotion && (
        <motion.div
          aria-hidden="true"
          style={{ opacity: overlayOpacity }}
          className="pointer-events-none absolute inset-0 z-40 bg-background"
        />
      )}
      <div className="mx-auto w-full max-w-6xl px-6">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <motion.h2
              initial={reducedMotion ? false : "hidden"}
              whileInView={reducedMotion ? undefined : "show"}
              viewport={{ once: true, amount: 0.5 }}
              variants={TITLE_STAGGER}
              className="font-display text-3xl font-bold tracking-tight sm:text-4xl"
            >
              <motion.span variants={TITLE_WORD} className="inline-block">
                Karya
              </motion.span>{" "}
              <motion.span
                variants={TITLE_WORD}
                className="inline-block text-primary"
              >
                Pilihan
              </motion.span>
            </motion.h2>
            <motion.p
              initial={reducedMotion ? false : { opacity: 0, y: 24 }}
              whileInView={reducedMotion ? undefined : { opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.5 }}
              transition={{ duration: 0.7, ease: EASE, delay: 0.3 }}
              className="mt-4 max-w-2xl text-lg leading-relaxed text-muted-foreground"
            >
              Sebagian kecil dari perjalanan saya — dari desain antarmuka,
              identitas brand, hingga desain grafis.
            </motion.p>
          </div>
        </div>

        <div className="mt-14 grid gap-6 sm:grid-cols-2">
          {featured.map((project, i) => (
            <FeaturedCard
              key={project.id}
              project={project}
              index={i}
              onPreview={(p) => setPreview(p)}
            />
          ))}
        </div>

        <motion.div
          initial={reducedMotion ? undefined : { opacity: 0, y: 24 }}
          whileInView={reducedMotion ? undefined : { opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.5 }}
          transition={{ duration: 0.6, ease: EASE, delay: 0.2 }}
          className="mt-12 flex justify-center"
        >
          <motion.a
            href="/projects"
            whileHover={reducedMotion ? undefined : { scale: 1.03 }}
            whileTap={reducedMotion ? undefined : { scale: 0.97 }}
            className="group relative inline-flex items-center gap-1.5 overflow-hidden rounded-full bg-primary px-6 py-3 text-sm font-semibold text-primary-foreground shadow-soft-md transition-all duration-300 hover:-translate-y-0.5 hover:shadow-soft-lg"
          >
            <span
              aria-hidden="true"
              className="absolute inset-0 -translate-x-full bg-gradient-to-r from-transparent via-white/25 to-transparent transition-transform duration-700 ease-out group-hover:translate-x-full"
            />
            <span className="relative">Lihat Semua</span>
            <ArrowUpRight className="relative size-4 transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
          </motion.a>
        </motion.div>
      </div>
      {preview && <Lightbox project={preview} onClose={() => setPreview(null)} />}
    </section>
  )
}