import React, { useState, useEffect } from 'react';
import { parseMarkdown } from '@/lib/markdown';
import { supabase } from '@/lib/supabase';

export default function ArticleDetail({ initialArticle }) {
  const [article, setArticle] = useState(initialArticle);

  useEffect(() => {
    if (article?.title) {
      document.title = `${article.title} | Adipra`;
    }
  }, [article?.title]);

  useEffect(() => {
    if (!supabase || !initialArticle?.id) return;
    supabase
      .from('articles')
      .select('*')
      .eq('id', initialArticle.id)
      .single()
      .then(({ data, error }) => {
        if (!error && data) {
          setArticle(data);
          if (data?.title) {
            document.title = `${data.title} | Adipra`;
          }
        }
      });
  }, [initialArticle?.id]);

  const { title, description, date, category, tags = [], cover, content } = article;
  const html = parseMarkdown(content || '');
  const readingMinutes = Math.max(1, Math.round((content || '').split(/\s+/).length / 200));
  const formattedDate = date
    ? new Date(date).toLocaleDateString('id-ID', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
      })
    : '';

  const tagList = Array.isArray(tags) ? tags : [];

  return (
    <article className="mt-10">
      <header className="max-w-2xl">
        <div className="flex flex-wrap items-center gap-3 text-sm text-muted-foreground">
          <span className="rounded-full bg-accent/10 px-3 py-1 font-medium text-accent">
            {category}
          </span>
          {date && <time dateTime={new Date(date).toISOString()}>{formattedDate}</time>}
          <span aria-hidden="true">·</span>
          <span>{readingMinutes} menit baca</span>
        </div>
        <h1 className="mt-6 font-display text-4xl font-bold leading-tight tracking-tight sm:text-5xl">
          {title}
        </h1>
        {description && (
          <div
            className="mt-5 text-lg leading-relaxed text-muted-foreground [&_p]:m-0 [&_ul]:list-disc [&_ul]:pl-6 [&_ul]:space-y-1.5 [&_ul]:my-2 [&_ol]:list-decimal [&_ol]:pl-6 [&_ol]:space-y-1.5 [&_ol]:my-2 [&_li::marker]:text-accent"
            dangerouslySetInnerHTML={{ __html: parseMarkdown(description) }}
          />
        )}
      </header>

      {cover && (
        <figure className="mt-10 overflow-hidden rounded-2xl border border-border shadow-card">
          <img src={cover} alt={`Cover artikel ${title}`} className="h-auto w-full object-cover" />
        </figure>
      )}

      <div className="article-body mt-12" dangerouslySetInnerHTML={{ __html: html }} />

      {tagList.length > 0 && (
        <footer className="mt-14 border-t border-border pt-8">
          <h2 className="font-display text-sm font-semibold uppercase tracking-[0.2em] text-muted-foreground">
            Topik
          </h2>
          <div className="mt-4 flex flex-wrap gap-2">
            {tagList.map((tag, idx) => (
              <span key={idx} className="rounded-full border border-border px-3 py-1 text-sm text-muted-foreground">
                #{tag}
              </span>
            ))}
          </div>
        </footer>
      )}
    </article>
  );
}
