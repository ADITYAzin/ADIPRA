import React, { useState, useEffect } from 'react';
import { ArrowLeft, ArrowUpRight, Sparkles, ListTree } from 'lucide-react';
import { supabase } from '@/lib/supabase';
import { parseProject } from '@/lib/db';

const categoryMap = {
  uiux: 'UI/UX Design',
  brand: 'Brand Design',
  graphic: 'Graphic Design',
  web: 'Web Development',
};

const shortCategoryMap = {
  uiux: 'UI/UX',
  brand: 'Brand',
  graphic: 'Graphic',
  web: 'Web',
};

export default function ProjectDetail({ initialProject, otherProjects = [] }) {
  const [project, setProject] = useState(initialProject);

  // Background fetch to ensure newest CRUD edits are immediately reflected
  useEffect(() => {
    if (!supabase || !initialProject?.id) return;
    supabase
      .from('projects')
      .select('*')
      .eq('id', initialProject.id)
      .single()
      .then(({ data, error }) => {
        if (!error && data) {
          setProject(parseProject(data));
        }
      });
  }, [initialProject?.id]);

  const categoryLabel = categoryMap[project.category] || 'Project';

  const rawProcess = Array.isArray(project.process_images) ? project.process_images : [];
  const rawResult = Array.isArray(project.result_images) ? project.result_images : [];
  const legacyGallery = Array.isArray(project.gallery) ? project.gallery : [];

  const taggedProcess = legacyGallery.filter((url) => typeof url === 'string' && url.startsWith('proc::')).map((url) => url.replace('proc::', ''));
  const taggedResult = legacyGallery.filter((url) => typeof url === 'string' && url.startsWith('res::')).map((url) => url.replace('res::', ''));
  const cleanLegacy = legacyGallery.map((url) => typeof url === 'string' ? url.replace(/^(proc|res)::/, '') : url);

  const effectiveProcess = rawProcess.length > 0 ? rawProcess : taggedProcess;
  const effectiveResult = rawResult.length > 0 ? rawResult : taggedResult;

  const processImages = effectiveProcess.length > 0
    ? effectiveProcess
    : (effectiveResult.length === 0 && cleanLegacy.length > 1
        ? cleanLegacy.slice(0, Math.max(1, Math.floor(cleanLegacy.length / 2)))
        : []);

  const resultImages = effectiveResult.length > 0
    ? effectiveResult
    : (effectiveProcess.length === 0 && cleanLegacy.length > 0
        ? (cleanLegacy.length === 1 ? cleanLegacy : cleanLegacy.slice(Math.max(1, Math.floor(cleanLegacy.length / 2))))
        : (cleanLegacy.length > 0 ? cleanLegacy : []));

  const pageSections = [
    { id: 'deskripsi-proyek', num: '01', label: 'Deskripsi Proyek' },
    ...(processImages.length > 0 ? [{ id: 'proses-pengembangan', num: '02', label: 'Proses Pengembangan' }] : []),
    ...(resultImages.length > 0 ? [{ id: 'hasil-akhir', num: processImages.length > 0 ? '03' : '02', label: 'Hasil Akhir' }] : []),
  ];

  // Table of contents scroll tracking
  useEffect(() => {
    const tocLinks = Array.from(document.querySelectorAll('[data-toc-link]'));
    if (tocLinks.length === 0) return;

    const targets = tocLinks
      .map((link) => document.getElementById(link.dataset.tocLink || ''))
      .filter(Boolean);

    const setActive = (id) => {
      tocLinks.forEach((link) => {
        link.setAttribute('aria-current', link.dataset.tocLink === id ? 'true' : 'false');
      });
    };

    const pickActive = () => {
      const offset = 140;
      let current = targets[0]?.id ?? '';
      for (const target of targets) {
        if (target.getBoundingClientRect().top <= offset) current = target.id;
      }
      const atBottom = window.innerHeight + window.scrollY >= document.documentElement.scrollHeight - 4;
      if (atBottom && targets.length > 0) current = targets[targets.length - 1].id;
      setActive(current);
    };

    window.addEventListener('scroll', pickActive, { passive: true });
    window.addEventListener('resize', pickActive, { passive: true });
    pickActive();

    return () => {
      window.removeEventListener('scroll', pickActive);
      window.removeEventListener('resize', pickActive);
    };
  }, [pageSections.length]);

  const detailParagraphs = Array.isArray(project.detail)
    ? project.detail
    : (typeof project.detail === 'string' ? project.detail.split('\n\n') : []);

  const tags = Array.isArray(project.tags) ? project.tags : [];

  return (
    <article className="mt-8">
      {/* Clean & Atmospheric Hero Banner Card */}
      <header className="group relative overflow-hidden rounded-card bg-card shadow-soft-md transition-all duration-300">
        <div className="relative h-64 sm:h-80 md:h-96 w-full overflow-hidden">
          <img
            src={project.cover}
            alt={`Cover proyek ${project.title}`}
            className="h-full w-full object-cover transition-transform duration-700 ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:scale-105"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-black/20" />

          {/* Top Meta Badges */}
          <div className="absolute inset-x-0 top-0 z-10 flex items-center justify-between gap-3 p-5 sm:p-7">
            <span className="inline-flex rounded-full bg-primary px-3.5 py-1.5 text-xs font-semibold text-primary-foreground shadow-soft-sm">
              {categoryLabel}
            </span>
            <span className="font-display text-sm font-bold text-white/90">
              {project.year}
            </span>
          </div>

          {/* Bottom Content overlay */}
          <div className="absolute inset-x-0 bottom-0 z-10 p-6 sm:p-10 flex flex-col justify-end gap-3">
            <h1 className="font-display text-3xl font-bold text-white sm:text-4xl lg:text-5xl tracking-tight leading-tight">
              {project.title}
            </h1>

            {/* Tags Badges */}
            <div className="flex flex-wrap items-center gap-2 pt-1">
              {tags.map((tag, idx) => (
                <span
                  key={idx}
                  className="rounded-full bg-white/15 backdrop-blur-md px-3 py-1 text-xs font-medium text-white/90 border border-white/10"
                >
                  {tag}
                </span>
              ))}
            </div>

            {(project.category === 'web' || project.live_url || project.github_url) && (
              <div className="flex flex-wrap items-center gap-2.5 pt-2">
                {project.live_url && (
                  <a
                    href={project.live_url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex h-9 items-center gap-1.5 rounded bg-primary px-3.5 text-xs font-semibold text-primary-foreground shadow-soft-sm transition-all duration-200 hover:bg-primary/90"
                  >
                    <span>Buka Website</span>
                    <ArrowUpRight className="h-3.5 w-3.5" />
                  </a>
                )}
                {project.github_url && (
                  <a
                    href={project.github_url}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label="Repository GitHub"
                    title="Repository GitHub"
                    className="inline-flex h-9 items-center gap-2 rounded bg-black px-3 text-xs font-semibold text-white shadow-soft-sm transition-all duration-200 hover:bg-black/80"
                  >
                    <svg role="img" viewBox="0 0 24 24" fill="currentColor" className="h-3.5 w-3.5" aria-hidden="true">
                      <path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0024 12c0-6.63-5.37-12-12-12z" />
                    </svg>
                    <span>Repository GitHub</span>
                  </a>
                )}
              </div>
            )}
          </div>
        </div>
      </header>

      {/* Grid Dua Kolom (Konten Utama + Sidebar Proyek) */}
      <div className="mt-14 lg:grid lg:grid-cols-12 lg:gap-12">
        {/* Main Content Area */}
        <div className="lg:col-span-8 space-y-16">
          {/* Deskripsi Proyek */}
          <section id="deskripsi-proyek" className="scroll-mt-28">
            <div className="flex items-center gap-4">
              <span className="font-display text-sm font-semibold text-accent">01</span>
              <h2 className="font-display text-3xl font-bold tracking-tight sm:text-4xl">
                Deskripsi Proyek
              </h2>
              <div className="h-px flex-1 bg-accent/25" />
            </div>
            <div className="mt-8 space-y-5 text-base sm:text-lg leading-relaxed text-muted-foreground">
              {detailParagraphs.map((paragraph, i) => (
                <p key={i} className="text-left">
                  {paragraph}
                </p>
              ))}
            </div>
          </section>

          {/* Proses Pengembangan */}
          {processImages.length > 0 && (
            <section id="proses-pengembangan" className="scroll-mt-28">
              <div className="flex items-center gap-4">
                <span className="font-display text-sm font-semibold text-accent">02</span>
                <h2 className="font-display text-3xl font-bold tracking-tight sm:text-4xl">
                  Proses Pengembangan
                </h2>
                <div className="h-px flex-1 bg-accent/25" />
              </div>
              <div className="mt-10 grid gap-6 sm:grid-cols-2">
                {processImages.map((src, i) => (
                  <figure
                    key={i}
                    className={`overflow-hidden rounded-card bg-card shadow-soft-md ${
                      i === 0 && processImages.length % 2 !== 0 ? 'sm:col-span-2' : ''
                    }`}
                  >
                    <img
                      src={src}
                      alt={`${project.title} — proses ${i + 1}`}
                      loading="lazy"
                      className="h-auto w-full object-cover"
                    />
                  </figure>
                ))}
              </div>
            </section>
          )}

          {/* Hasil Akhir */}
          {resultImages.length > 0 && (
            <section id="hasil-akhir" className="scroll-mt-28">
              <div className="flex items-center gap-4">
                <span className="font-display text-sm font-semibold text-accent">
                  {processImages.length > 0 ? '03' : '02'}
                </span>
                <h2 className="font-display text-3xl font-bold tracking-tight sm:text-4xl">
                  Hasil Akhir
                </h2>
                <div className="h-px flex-1 bg-accent/25" />
              </div>
              <div className="mt-10 grid gap-6 sm:grid-cols-2">
                {resultImages.map((src, i) => (
                  <figure
                    key={i}
                    className={`overflow-hidden rounded-card bg-card shadow-soft-md ${
                      i === 0 && resultImages.length === 1 ? 'sm:col-span-2' : ''
                    }`}
                  >
                    <img
                      src={src}
                      alt={`${project.title} — hasil akhir ${i + 1}`}
                      loading="lazy"
                      className="h-auto w-full object-cover"
                    />
                  </figure>
                ))}
              </div>
            </section>
          )}
        </div>

        {/* Sidebar Right Column */}
        <aside className="mt-16 lg:mt-0 lg:col-span-4 lg:self-start">
          <div className="sticky top-24 space-y-6">
            <div className="rounded-card border border-border/80 bg-card/60 p-6 shadow-soft-md backdrop-blur-md">
              <div className="flex items-center justify-between gap-2 border-b border-border/60 pb-4">
                <div className="flex items-center gap-2">
                  <Sparkles className="h-4 w-4 text-accent" />
                  <h3 className="font-display text-lg font-bold text-foreground">Proyek Lainnya</h3>
                </div>
                <a
                  href="/projects"
                  className="text-xs font-semibold text-accent hover:underline inline-flex items-center gap-0.5"
                >
                  Lihat Semua
                  <ArrowUpRight className="h-3 w-3" />
                </a>
              </div>

              <div className="mt-5 space-y-4">
                {otherProjects.map((item) => (
                  <a
                    key={item.id}
                    href={`/projects/${item.id}`}
                    className="group flex items-center gap-3.5 rounded-xl border border-border/40 bg-background/50 p-2.5 transition-all duration-300 hover:-translate-y-0.5 hover:border-accent/40 hover:bg-card hover:shadow-soft-sm"
                  >
                    <img
                      src={item.cover}
                      alt={item.title}
                      className="h-16 w-16 shrink-0 rounded-lg object-cover transition-transform duration-300 group-hover:scale-105"
                    />
                    <div className="min-w-0 flex-1">
                      <span className="text-[10px] font-semibold tracking-wider text-accent uppercase">
                        {shortCategoryMap[item.category] || item.category}
                      </span>
                      <h4 className="truncate font-display text-sm font-bold text-foreground transition-colors group-hover:text-accent">
                        {item.title}
                      </h4>
                      <p className="truncate text-xs text-muted-foreground mt-0.5">
                        {Array.isArray(item.tags) ? item.tags.slice(0, 2).join(' • ') : ''}
                      </p>
                    </div>
                  </a>
                ))}
              </div>
            </div>

            {/* Navigasi Bagian Halaman */}
            <nav
              aria-label="Navigasi bagian halaman"
              className="rounded-card border border-border/80 bg-card/60 p-6 shadow-soft-md backdrop-blur-md"
            >
              <div className="flex items-center gap-2 border-b border-border/60 pb-4">
                <ListTree className="h-4 w-4 text-accent" />
                <h3 className="font-display text-lg font-bold text-foreground">Navigasi Halaman</h3>
              </div>

              <ul className="mt-4 space-y-1">
                {pageSections.map((section) => (
                  <li key={section.id}>
                    <a
                      href={`#${section.id}`}
                      data-toc-link={section.id}
                      aria-current="false"
                      className="group flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm text-muted-foreground transition-all duration-300 hover:bg-background/80 hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring aria-[current=true]:bg-accent/10 aria-[current=true]:text-foreground"
                    >
                      <span className="h-px w-4 shrink-0 bg-border transition-all duration-300 group-hover:bg-accent group-hover:w-6 group-aria-[current=true]:w-6 group-aria-[current=true]:bg-accent" />
                      <span className="font-display text-xs font-bold">{section.num}</span>
                      <span className="font-medium">{section.label}</span>
                    </a>
                  </li>
                ))}
              </ul>
            </nav>
          </div>
        </aside>
      </div>
    </article>
  );
}
