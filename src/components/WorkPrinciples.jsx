import { motion } from "framer-motion"
import { BarChart3, Feather, HeartHandshake, Sparkles } from "lucide-react"

const EASE = [0.22, 1, 0.36, 1]

const PRINCIPLES = [
  {
    num: "01",
    title: "Empati di Awal Segalanya",
    desc: "Setiap keputusan desain dimulai dari memahami kebutuhan pengguna, bukan asumsi.",
    icon: HeartHandshake,
  },
  {
    num: "02",
    title: "Detail Tak Pernah Diabaikan",
    desc: "Perhatian pada detail kecil membuat pengalaman terasa premium dan berkesan.",
    icon: Sparkles,
  },
  {
    num: "03",
    title: "Data Mengarahkan Langkah",
    desc: "Keputusan didorong riset dan data, agar solusi benar-benar menjawab masalah nyata.",
    icon: BarChart3,
  },
  {
    num: "04",
    title: "Kenyamanan Selalu Utama",
    desc: "Desain yang nyaman dipandang dan mudah digunakan selalu menjadi prioritas utama.",
    icon: Feather,
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

      <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
        {PRINCIPLES.map((principle, i) => {
          const Icon = principle.icon
          return (
            <motion.article
              key={principle.num}
              initial={{ opacity: 0, y: 28 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.3 }}
              transition={{ duration: 0.7, ease: EASE, delay: i * 0.1 }}
              className="group relative overflow-hidden rounded-card bg-card p-7 shadow-soft-md transition-all duration-300 hover:-translate-y-1.5 hover:shadow-soft-lg"
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