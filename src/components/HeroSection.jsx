import { useRef } from "react"
import {
  motion,
  useMotionValue,
  useReducedMotion,
  useSpring,
  useTransform,
} from "framer-motion"
import {
  ArrowDown,
  Globe,
  LayoutGrid,
  Palette,
  PenTool,
} from "lucide-react"
import { cn } from "@/lib/utils"

const EASE = [0.22, 1, 0.36, 1]

const container = {
  hidden: {},
  show: { transition: { staggerChildren: 0.12, delayChildren: 0.15 } },
}

const item = {
  hidden: { opacity: 0, y: 28 },
  show: { opacity: 1, y: 0, transition: { duration: 0.7, ease: EASE } },
}

const photoReveal = {
  hidden: { opacity: 0, y: 44, scale: 0.92 },
  show: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: { duration: 0.7, ease: EASE },
  },
}

const BADGES = [
  { label: "UI/UX", icon: LayoutGrid, position: "-left-10 top-8", float: 0 },
  { label: "Brand", icon: Palette, position: "-right-8 top-20", float: 1.4 },
  { label: "Web Dev", icon: Globe, position: "-left-12 bottom-20", float: 0.7 },
  { label: "Graphic", icon: PenTool, position: "-right-10 bottom-8", float: 2 },
]

export default function HeroSection() {
  const reducedMotion = useReducedMotion()
  const sectionRef = useRef(null)

  const mx = useMotionValue(0)
  const my = useMotionValue(0)
  const sx = useSpring(mx, { stiffness: 50, damping: 16 })
  const sy = useSpring(my, { stiffness: 50, damping: 16 })

  const photoX = useTransform(sx, (v) => v * -14)
  const photoY = useTransform(sy, (v) => v * -14)

  const onMouseMove = (e) => {
    if (reducedMotion) return
    const rect = sectionRef.current?.getBoundingClientRect()
    if (!rect) return
    mx.set(((e.clientX - rect.left) / rect.width - 0.5) * 2)
    my.set(((e.clientY - rect.top) / rect.height - 0.5) * 2)
  }

  return (
    <section
      ref={sectionRef}
      onMouseMove={onMouseMove}
      className="relative flex min-h-screen flex-col items-center justify-center overflow-hidden px-6 pb-14 pt-20 text-center sm:px-8"
    >
      <motion.div
        variants={container}
        initial="hidden"
        animate="show"
        className="flex flex-col items-center"
      >
        <motion.h1
          variants={item}
          className="mt-2 font-display text-[clamp(2.75rem,9vw,5.5rem)] font-extrabold leading-tight tracking-tight text-foreground"
        >
          Hi, I'm ADITYA
        </motion.h1>

        <motion.p
          variants={item}
          className="mt-4 font-serif text-3xl font-semibold text-foreground/85 sm:text-4xl"
        >
          as <span className="text-primary">Designer & UI Engineer</span>
        </motion.p>
      </motion.div>

      <motion.div
        variants={photoReveal}
        initial="hidden"
        animate="show"
        className="mt-6 sm:mt-8"
      >
        <motion.div style={{ x: photoX, y: photoY }}>
          <div className="relative w-76 sm:w-76">
            <img
              src="/images/assets/Transparant Profile.png"
              alt="Foto profil Aditya Pratama Putra"
              className="relative aspect-[5/6] h-auto w-full rounded-2xl object-cover"
            />

            {BADGES.map((badge) => {
              const Icon = badge.icon
              return (
                <motion.div
                  key={badge.label}
                  className={cn(
                    "absolute z-10 hidden items-center gap-1.5 rounded-full border border-border bg-card px-3.5 py-1.5 text-xs font-medium text-foreground/85 shadow-soft-md sm:flex",
                    badge.position
                  )}
                  animate={
                    reducedMotion
                      ? {}
                      : { y: [0, -8, 0] }
                  }
                  transition={{
                    duration: 5,
                    repeat: Infinity,
                    ease: "easeInOut",
                    delay: badge.float,
                  }}
                >
                  <Icon className="size-3.5 text-primary" />
                  {badge.label}
                </motion.div>
              )
            })}
          </div>
        </motion.div>
      </motion.div>

      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-x-0 bottom-0 h-28 bg-gradient-to-t from-background to-transparent"
      />

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.8, delay: 1.4 }}
        className="absolute bottom-5 left-1/2 flex -translate-x-1/2 flex-col items-center gap-2 text-muted-foreground"
      >
        <span className="font-display text-xs font-medium uppercase tracking-[0.2em]">
          Gulir
        </span>
        <motion.span
          aria-hidden="true"
          animate={reducedMotion ? {} : { y: [0, 6, 0] }}
          transition={{ duration: 1.6, repeat: Infinity, ease: "easeInOut" }}
        >
          <ArrowDown className="size-4" />
        </motion.span>
      </motion.div>
    </section>
  )
}