import { motion } from "framer-motion"
import { ArrowUpRight, Sparkles } from "lucide-react"

const EASE = [0.22, 1, 0.36, 1]

const STATS = [
  { value: "20+", label: "Proyek Selesai" },
  { value: "3+", label: "Tahun Pengalaman" },
  { value: "15+", label: "Sertifikat" },
]

export default function ClosingCTA() {
  return (
    <section className="relative mx-auto max-w-6xl px-6 py-24 sm:py-28">
      <motion.div
        initial={{ opacity: 0, y: 40, scale: 0.98 }}
        whileInView={{ opacity: 1, y: 0, scale: 1 }}
        viewport={{ once: true, amount: 0.3 }}
        transition={{ duration: 0.8, ease: EASE }}
        className="relative overflow-hidden rounded-[2.5rem] bg-primary px-8 pt-14 pb-14 shadow-soft-xl sm:px-14 lg:px-16 lg:pt-16 lg:pb-0"
      >
        <div
          aria-hidden="true"
          className="pointer-events-none absolute -left-24 -top-24 h-72 w-72 rounded-full bg-white/10 blur-3xl"
        />
        <div
          aria-hidden="true"
          className="pointer-events-none absolute -bottom-28 -right-20 h-80 w-80 rounded-full bg-white/10 blur-3xl"
        />
        <div
          aria-hidden="true"
          className="pointer-events-none absolute right-1/4 top-10 h-24 w-24 rounded-full bg-white/5 blur-2xl"
        />

        <div className="relative grid items-end gap-12 lg:grid-cols-[1.2fr_1fr]">
          <div className="text-center lg:text-left lg:pb-16">
            <span className="inline-flex items-center gap-1.5 rounded-full bg-white/15 px-3.5 py-1.5 text-xs font-semibold text-white backdrop-blur-sm">
              <Sparkles className="size-3.5" />
              Siap Berkarya
            </span>

            <h2 className="mt-5 font-display text-3xl font-bold tracking-tight text-primary-foreground sm:text-4xl lg:text-[2.75rem] lg:leading-[1.15]">
              Punya ide? Mari kita{" "}
              <span className="relative whitespace-nowrap">
                wujudkan
                <span
                  aria-hidden="true"
                  className="absolute -bottom-1 left-0 h-1 w-full rounded-full bg-white/50"
                />
              </span>{" "}
              bersama.
            </h2>

            <p className="mx-auto mt-5 max-w-xl text-base leading-relaxed text-primary-foreground/85 sm:text-lg lg:mx-0">
              Dari riset hingga peluncuran, saya siap membantu Anda menciptakan
              produk digital yang nyaman dan berkesan.
            </p>

            <div className="mt-9 flex flex-col items-center gap-3 sm:flex-row sm:justify-center lg:justify-start">
              <a
                href="/contact"
                className="group inline-flex items-center gap-2 rounded-full bg-white px-7 py-3.5 font-display text-sm font-semibold text-primary shadow-lg transition-transform duration-300 hover:-translate-y-1"
              >
                Mulai Kolaborasi
                <ArrowUpRight className="size-4 transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
              </a>
              <a
                href="/projects"
                className="inline-flex items-center gap-2 rounded-full border border-white/30 px-7 py-3.5 font-display text-sm font-semibold text-white transition-colors duration-300 hover:bg-white/10"
              >
                Lihat Karya
              </a>
            </div>

            <div className="mx-auto mt-10 grid max-w-md grid-cols-3 gap-4 lg:mx-0">
              {STATS.map((stat) => (
                <div key={stat.label} className="text-center lg:text-left">
                  <p className="font-display text-2xl font-bold text-primary-foreground sm:text-3xl">
                    {stat.value}
                  </p>
                  <p className="mt-1 text-xs text-primary-foreground/75">
                    {stat.label}
                  </p>
                </div>
              ))}
            </div>
          </div>

          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.3 }}
            transition={{ duration: 0.8, ease: EASE, delay: 0.15 }}
            className="relative mx-auto hidden w-full max-w-[22rem] self-end lg:flex lg:justify-center"
          >
            <div
              aria-hidden="true"
              className="pointer-events-none absolute inset-0 scale-95 rounded-full bg-white/20 blur-3xl"
            />
            <div className="relative mx-auto w-72 sm:w-80">
              <img
                src="/images/assets/Transparant Profile.png"
                alt="Foto profil Aditya Pratama Putra"
                loading="lazy"
                className="block h-auto w-full select-none object-contain drop-shadow-[0_16px_32px_rgba(0,0,0,0.25)]"
              />
            </div>
          </motion.div>
        </div>
      </motion.div>
    </section>
  )
}