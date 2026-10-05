import { motion } from "framer-motion"
import {
  Globe,
  LayoutGrid,
  Palette,
  ShieldCheck,
  WandSparkles,
} from "lucide-react"

const EASE = [0.22, 1, 0.36, 1]

const HARD_SKILLS = [
  { name: "UI/UX Design", icon: LayoutGrid },
  { name: "Graphic Design", icon: Palette },
  { name: "Frontend Web Dev", icon: Globe },
  { name: "Quality Assurance", icon: ShieldCheck },
  { name: "Prompt Engineering", icon: WandSparkles },
]

const TOOLS = [
  { name: "Figma", logo: "/images/assets/logos/logo-figma.svg" },
  { name: "Gemini AI", logo: "/images/assets/logos/logo-gemini.svg" },
  { name: "NotebookLM", logo: "/images/assets/logos/logo-notebooklm.svg", big: true },
  { name: "OpenCode", logo: "/images/assets/logos/logo-opencode.svg" },
  { name: "WordPress", logo: "/images/assets/logos/logo-wordpress.svg" },
  { name: "Maze", logo: "/images/assets/logos/logo-maze.svg" },
  { name: "Canva", logo: "/images/assets/logos/logo-canva.svg" },
  { name: "HTML", logo: "/images/assets/logos/logo-html.svg" },
  { name: "Tailwind CSS", logo: "/images/assets/logos/logo-tailwindcss.svg" },
  { name: "JavaScript", logo: "/images/assets/logos/logo-javascript.svg" },
  { name: "Notion", logo: "/images/assets/logos/logo-notion.svg" },
  { name: "Supabase", logo: "/images/assets/logos/logo-supabase.svg" },
  { name: "9Router", logo: "/images/assets/logos/9router-logo.png" },
]

export default function SkillsTools() {
  return (
    <section className="relative mx-auto max-w-6xl px-6 py-24 sm:py-28">
      <motion.div
        initial={{ opacity: 0, y: 28 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, amount: 0.5 }}
        transition={{ duration: 0.7, ease: EASE }}
      >
        <h2 className="font-display text-3xl font-bold tracking-tight sm:text-4xl">
          Keahlian &amp; <span className="text-primary">Tools</span>
        </h2>
        <p className="mt-4 max-w-2xl text-lg leading-relaxed text-muted-foreground">
          Keterampilan yang saya tekuni beserta perangkat yang saya gunakan
          setiap hari untuk menghadirkan karya terbaik.
        </p>
      </motion.div>

      <div className="mt-12">
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-5">
          {HARD_SKILLS.map((skill, i) => {
            const Icon = skill.icon
            return (
              <motion.div
                key={skill.name}
                initial={{ opacity: 0, y: 24 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.3 }}
                transition={{ duration: 0.6, ease: EASE, delay: i * 0.08 }}
                className="group flex flex-col items-center gap-4 rounded-card bg-card p-6 text-center shadow-soft-md transition-all duration-300 hover:-translate-y-1 hover:shadow-soft-lg"
              >
                <span className="flex h-12 w-12 items-center justify-center rounded-2xl bg-primary/10 text-primary transition-transform duration-300 group-hover:scale-110">
                  <Icon className="size-6" />
                </span>
                <p className="font-display text-sm font-semibold leading-snug">
                  {skill.name}
                </p>
              </motion.div>
            )
          })}
        </div>

        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.3 }}
          transition={{ duration: 0.6, ease: EASE }}
          className="mt-10"
        >
          <div className="marquee-mask relative overflow-hidden rounded-card bg-card py-8 shadow-soft-md">
            <div className="marquee-track flex w-max items-center">
              {[...TOOLS, ...TOOLS].map((tool, i) => (
                <img
                  key={`${tool.name}-${i}`}
                  src={tool.logo}
                  alt={tool.name}
                  loading="lazy"
                  className={`${tool.big ? "h-12 w-20" : "h-10 w-16"} mr-16 shrink-0 object-contain opacity-80 transition-opacity duration-300 hover:opacity-100`}
                />
              ))}
            </div>

            <div
              aria-hidden="true"
              className="pointer-events-none absolute inset-y-0 left-0 w-20 bg-gradient-to-r from-card to-transparent"
            />
            <div
              aria-hidden="true"
              className="pointer-events-none absolute inset-y-0 right-0 w-20 bg-gradient-to-l from-card to-transparent"
            />
          </div>
        </motion.div>
      </div>
    </section>
  )
}