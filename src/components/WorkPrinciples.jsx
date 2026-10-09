import { motion } from "framer-motion"
import { ShieldCheck, Users, Zap } from "lucide-react"

const EASE = [0.22, 1, 0.36, 1]

const PRINCIPLES = [
  {
    num: "01",
    title: "Presisi Visual & Fungsional",
    desc: "Menerapkan mindset QA dalam proses desain untuk meminimalkan inkonsistensi visual dan memastikan produk akhir selaras dengan visi rancangan.",
    icon: ShieldCheck,
  },
  {
    num: "02",
    title: "Alur Kerja Terakselerasi",
    desc: "Memanfaatkan tools AI untuk mempercepat riset dan eksplorasi variasi desain, memangkas waktu pengerjaan tanpa mengorbankan kualitas.",
    icon: Zap,
  },
  {
    num: "03",
    title: "Kolaborasi Adaptif",
    desc: "Mudah menyesuaikan diri dengan ritme kerja tim, berkomunikasi lancar dengan developer, dan selalu terbuka pada feedback yang membangun.",
    icon: Users,
  },
]

export default function WorkPrinciples() {
  return (
    <section className="relative mx-auto max-w-6xl px-6 py-24 sm:py-28">
      <motion.div
        initial={{ opacity: 0, y: 28 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, amount: 0.5 }}
        transition={{ duration: 0.7, ease: EASE }}
      >
        <h2 className="font-display text-3xl font-bold tracking-tight sm:text-4xl">
          Prinsip <span className="text-primary">Kerja</span>
        </h2>
        <p className="mt-4 max-w-2xl text-lg leading-relaxed text-muted-foreground">
          Nilai-nilai yang selalu saya pegang di setiap proses — dari riset,
          desain, hingga pengembangan.
        </p>
      </motion.div>

      <div className="mt-12 grid gap-6 grid-cols-1 md:grid-cols-3">
        {PRINCIPLES.map((principle, i) => {
          const Icon = principle.icon
          return (
            <motion.article
              key={principle.num}
              initial={{ opacity: 0, y: 28 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.3 }}
              transition={{ duration: 0.7, ease: EASE, delay: i * 0.1 }}
              className="group relative overflow-hidden rounded-card bg-card p-7 sm:p-8 shadow-soft-md transition-all duration-300 hover:-translate-y-1.5 hover:shadow-soft-lg"
            >
              <span
                aria-hidden="true"
                className="pointer-events-none absolute -right-2 -top-5 font-display text-7xl font-extrabold text-primary/10 transition-transform duration-500 group-hover:-translate-y-1 group-hover:scale-110"
              >
                {principle.num}
              </span>

              <span className="flex h-12 w-12 items-center justify-center rounded-2xl bg-primary/10 text-primary transition-transform duration-300 group-hover:scale-110 group-hover:rotate-6">
                <Icon className="size-6" />
              </span>

              <h3 className="mt-6 font-display text-lg font-semibold">
                {principle.title}
              </h3>
              <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
                {principle.desc}
              </p>

              <span
                aria-hidden="true"
                className="absolute inset-x-7 bottom-0 h-px bg-gradient-to-r from-primary/50 via-primary/20 to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100"
              />
            </motion.article>
          )
        })}
      </div>
    </section>
  )
}