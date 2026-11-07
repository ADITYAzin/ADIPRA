import { supabase } from './supabase';
import { generateSlug } from './utils';
import localProjects from '../data/projects.json';
import localArticles from '../data/articles.json';
import localCompetitions from '../data/competition.json';
import localTrainings from '../data/training.json';

// In-memory cache to prevent duplicate fetches & reduce latency
const cache = new Map<string, { data: any; expiry: number }>();
const CACHE_TTL_MS = 60 * 1000; // 60 seconds

async function fetchWithTimeout<T>(promise: Promise<T>, timeoutMs = 3500): Promise<T> {
  let timer: NodeJS.Timeout;
  const timeoutPromise = new Promise<never>((_, reject) => {
    timer = setTimeout(() => reject(new Error('Supabase request timeout')), timeoutMs);
  });
  try {
    return await Promise.race([promise, timeoutPromise]);
  } finally {
    clearTimeout(timer!);
  }
}

export function parseProject(item: any) {
  if (!item) return item;

  const rawGallery: any[] = Array.isArray(item.gallery)
    ? item.gallery
    : (typeof item.gallery === 'string'
        ? item.gallery.split(',').map((s: string) => s.trim()).filter(Boolean)
        : []);

  // Clean tags for live, git, and figma URLs
  let liveUrl = item.live_url || item.url || '';
  let githubUrl = item.github_url || item.github || item.repo_url || '';
  let figmaUrl = item.figma_url || item.figma || '';

  for (const g of rawGallery) {
    if (typeof g === 'string') {
      const clean = g.replace(/^(proc::|res::)+/, '').trim();
      if (clean.startsWith('live::') && !liveUrl) {
        liveUrl = clean.replace('live::', '').trim();
      } else if (clean.startsWith('git::') && !githubUrl) {
        githubUrl = clean.replace('git::', '').trim();
      } else if (clean.startsWith('figma::') && !figmaUrl) {
        figmaUrl = clean.replace('figma::', '').trim();
      }
    }
  }

  // Filter valid image URLs and remove tag prefixes
  const isValidImage = (url: any) => {
    if (typeof url !== 'string' || !url.trim()) return false;
    const clean = url.replace(/^(proc::|res::)+/, '').trim();
    if (clean.startsWith('live::') || clean.startsWith('git::') || clean.startsWith('figma::')) return false;
    return (
      clean.startsWith('http://') ||
      clean.startsWith('https://') ||
      clean.startsWith('/') ||
      clean.startsWith('./')
    );
  };

  const cleanImageUrl = (url: string) => url.replace(/^(proc::|res::)+/, '').trim();

  const taggedProc = rawGallery
    .filter((g: any) => typeof g === 'string' && g.startsWith('proc::') && isValidImage(g))
    .map((g: any) => cleanImageUrl(g));

  const taggedRes = rawGallery
    .filter((g: any) => typeof g === 'string' && g.startsWith('res::') && isValidImage(g))
    .map((g: any) => cleanImageUrl(g));

  const rawProc = (
    Array.isArray(item.process_images)
      ? item.process_images
      : (typeof item.process_images === 'string'
          ? item.process_images.split(',').map((s: string) => s.trim()).filter(Boolean)
          : [])
  )
    .filter(isValidImage)
    .map(cleanImageUrl);

  const rawRes = (
    Array.isArray(item.result_images)
      ? item.result_images
      : (typeof item.result_images === 'string'
          ? item.result_images.split(',').map((s: string) => s.trim()).filter(Boolean)
          : [])
  )
    .filter(isValidImage)
    .map(cleanImageUrl);

  const process_images = rawProc.length > 0 ? rawProc : taggedProc;
  const result_images = rawRes.length > 0 ? rawRes : taggedRes;

  const cleanGallery = rawGallery
    .filter(isValidImage)
    .map(cleanImageUrl);

  let description = (item.description || '').trim();
  if (description === 'blbalba' || !description) {
    if (item.id && item.id.includes('ikutaja')) {
      description =
        'Platform manajemen partisipasi dan penyelenggaraan event olahraga berbasis web responsif untuk memudahkan panitia dan peserta.';
    }
  }

  const titleSlug = generateSlug(item.title);
  const slug = titleSlug || item.slug || item.id;

  return {
    ...item,
    slug,
    description,
    live_url: liveUrl,
    github_url: githubUrl,
    figma_url: figmaUrl,
    process_images,
    result_images,
    gallery: cleanGallery.length > 0 ? cleanGallery : [...process_images, ...result_images],
  };
}

export { generateSlug };

export async function getProjects() {
  const cacheKey = 'projects';
  const cached = cache.get(cacheKey);
  if (cached && Date.now() < cached.expiry) {
    return cached.data;
  }

  const fallback = (localProjects as any[]).map(parseProject);
  if (!supabase) return fallback;

  try {
    const fetchPromise = supabase
      .from('projects')
      .select('*')
      .order('created_at', { ascending: false });

    const { data, error } = await fetchWithTimeout(fetchPromise);
    if (error || !data || data.length === 0) {
      cache.set(cacheKey, { data: fallback, expiry: Date.now() + CACHE_TTL_MS });
      return fallback;
    }

    const parsed = data.map(parseProject);
    cache.set(cacheKey, { data: parsed, expiry: Date.now() + CACHE_TTL_MS });
    return parsed;
  } catch {
    return fallback;
  }
}

export async function getProjectById(slugOrId: string) {
  if (!slugOrId) return undefined;
  const projects = await getProjects();
  const target = String(slugOrId).trim().toLowerCase();
  const targetSlug = generateSlug(target);
  const normTarget = target.replace(/[^a-z0-9]/g, '');

  // 1. Exact match by title slug (primary requirement: slug MUST be based on project title)
  let found = projects.find((p: any) => {
    const pTitleSlug = generateSlug(p.title);
    return pTitleSlug === target || pTitleSlug === targetSlug;
  });
  if (found) return found;

  // 2. Exact match by project.slug property
  found = projects.find((p: any) => (p.slug || '').toLowerCase() === target);
  if (found) return found;

  // 3. Exact match by project.id (database ID fallback)
  found = projects.find((p: any) => (p.id || '').toLowerCase() === target);
  if (found) return found;

  // 4. Normalized exact match against project title
  found = projects.find((p: any) => {
    const normTitle = (p.title || '').toLowerCase().replace(/[^a-z0-9]/g, '');
    return normTitle === normTarget;
  });
  if (found) return found;

  // 5. Normalized exact match against id or slug
  found = projects.find((p: any) => {
    const normId = (p.id || '').toLowerCase().replace(/[^a-z0-9]/g, '');
    const normSlug = (p.slug || '').toLowerCase().replace(/[^a-z0-9]/g, '');
    return normId === normTarget || normSlug === normTarget;
  });
  if (found) return found;

  // 6. Explicit aliases for known projects (e.g. ikutaja legacy routes)
  if (target.includes('ikut')) {
    found = projects.find((p: any) =>
      (p.id && p.id.includes('ikut')) ||
      (p.title && p.title.toLowerCase().includes('ikut'))
    );
    if (found) return found;
  }

  return undefined;
}

export async function getArticles() {
  const cacheKey = 'articles';
  const cached = cache.get(cacheKey);
  if (cached && Date.now() < cached.expiry) {
    return cached.data;
  }

  const fallback = localArticles as any[];
  if (!supabase) return fallback;

  try {
    const fetchPromise = supabase
      .from('articles')
      .select('*')
      .order('date', { ascending: false });

    const { data, error } = await fetchWithTimeout(fetchPromise);
    if (error || !data || data.length === 0) {
      cache.set(cacheKey, { data: fallback, expiry: Date.now() + CACHE_TTL_MS });
      return fallback;
    }

    cache.set(cacheKey, { data, expiry: Date.now() + CACHE_TTL_MS });
    return data;
  } catch {
    return fallback;
  }
}

export async function getArticleById(slugOrId: string) {
  if (!slugOrId) return undefined;
  const articles = await getArticles();

  // 1. Exact match
  let found = articles.find((a: any) => a.id === slugOrId);
  if (found) return found;

  // 2. Normalized match
  const normTarget = slugOrId.toLowerCase().replace(/[^a-z0-9]/g, '');
  found = articles.find((a: any) => {
    const normId = (a.id || '').toLowerCase().replace(/[^a-z0-9]/g, '');
    return normId === normTarget || normId.includes(normTarget);
  });
  if (found) return found;

  // 3. Title match
  found = articles.find((a: any) => {
    const titleSlug = (a.title || '').toLowerCase().replace(/[^a-z0-9]/g, '');
    return titleSlug === normTarget || titleSlug.includes(normTarget);
  });

  return found;
}

export async function getCompetitions() {
  const cacheKey = 'competitions';
  const cached = cache.get(cacheKey);
  if (cached && Date.now() < cached.expiry) {
    return cached.data;
  }

  const fallback = localCompetitions as any[];
  if (!supabase) return fallback;

  try {
    const fetchPromise = supabase
      .from('competitions')
      .select('*')
      .order('created_at', { ascending: false });

    const { data, error } = await fetchWithTimeout(fetchPromise);
    if (error || !data || data.length === 0) {
      cache.set(cacheKey, { data: fallback, expiry: Date.now() + CACHE_TTL_MS });
      return fallback;
    }

    cache.set(cacheKey, { data, expiry: Date.now() + CACHE_TTL_MS });
    return data;
  } catch {
    return fallback;
  }
}

export async function getTrainings() {
  const cacheKey = 'trainings';
  const cached = cache.get(cacheKey);
  if (cached && Date.now() < cached.expiry) {
    return cached.data;
  }

  const fallback = localTrainings as any[];
  if (!supabase) return fallback;

  try {
    const fetchPromise = supabase
      .from('trainings')
      .select('*')
      .order('created_at', { ascending: false });

    const { data, error } = await fetchWithTimeout(fetchPromise);
    if (error || !data || data.length === 0) {
      cache.set(cacheKey, { data: fallback, expiry: Date.now() + CACHE_TTL_MS });
      return fallback;
    }

    cache.set(cacheKey, { data, expiry: Date.now() + CACHE_TTL_MS });
    return data;
  } catch {
    return fallback;
  }
}
