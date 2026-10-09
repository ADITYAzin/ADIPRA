import { useRef } from "react"
import {
  motion,
  useMotionValue,
  useReducedMotion,
  useSpring,
  useTransform,
} from "framer-motion"

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

export default function HeroSection() {
  const reducedMotion = useReducedMotion()
  const sectionRef = useRef(null)

  const mx = useMotionValue(0)
  const my = useMotionValue(0)
  const sx = useSpring(mx, { stiffness: 50, damping: 16 })
  const sy = useSpring(my, { stiffness: 50, damping: 16 })

  const photoX = useTransform(sx, (v) => v * -12)
  const photoY = useTransform(sy, (v) => v * -12)

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
      className="relative flex min-h-screen flex-col items-center justify-center overflow-hidden px-6 pb-16 pt-20 text-center sm:px-8"
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
        className="relative mt-8 sm:mt-10 flex justify-center"
      >
        {/* Soft atmospheric ambient glow behind the cutout */}
        <div
          aria-hidden="true"
          className="pointer-events-none absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 h-72 w-72 sm:h-96 sm:w-96 rounded-full bg-gradient-to-tr from-primary/20 via-primary/10 to-transparent blur-3xl opacity-80"
        />

        <motion.div style={{ x: photoX, y: photoY }} className="relative">
          <div className="relative w-64 sm:w-76 md:w-84">
            <img
              src="/images/assets/Transparant Profile.png"
              alt="Foto profil Aditya Pratama Putra"
              className="relative block h-auto w-full select-none object-contain drop-shadow-[0_16px_32px_rgba(37,99,235,0.14)] [mask-image:linear-gradient(to_bottom,black_60%,transparent_100%)] [-webkit-mask-image:linear-gradient(to_bottom,black_60%,transparent_100%)]"
            />
          </div>
        </motion.div>
      </motion.div>

      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-x-0 bottom-0 h-28 bg-gradient-to-t from-background to-transparent"
      />
    </section>
  )
}