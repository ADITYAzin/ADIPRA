import { supabase } from './supabase';
import localProjects from '../data/projects.json';
import localArticles from '../data/articles.json';
import localCompetitions from '../data/competition.json';
import localTrainings from '../data/training.json';

export function parseProject(item: any) {
  if (!item) return item;
  const rawGallery: any[] = Array.isArray(item.gallery)
    ? item.gallery
    : (typeof item.gallery === 'string' ? item.gallery.split(',').map((s: string) => s.trim()).filter(Boolean) : []);

  const liveTag = rawGallery.find((g: any) => typeof g === 'string' && g.startsWith('live::'));
  const gitTag = rawGallery.find((g: any) => typeof g === 'string' && g.startsWith('git::'));

  const taggedProc = rawGallery
    .filter((g: any) => typeof g === 'string' && g.startsWith('proc::'))
    .map((g: any) => g.replace('proc::', ''));
  const taggedRes = rawGallery
    .filter((g: any) => typeof g === 'string' && g.startsWith('res::'))
    .map((g: any) => g.replace('res::', ''));

  const rawProc = Array.isArray(item.process_images)
    ? item.process_images
    : (typeof item.process_images === 'string' ? item.process_images.split(',').map((s: string) => s.trim()).filter(Boolean) : []);
  const rawRes = Array.isArray(item.result_images)
    ? item.result_images
    : (typeof item.result_images === 'string' ? item.result_images.split(',').map((s: string) => s.trim()).filter(Boolean) : []);

  const process_images = rawProc.length > 0 ? rawProc : taggedProc;
  const result_images = rawRes.length > 0 ? rawRes : taggedRes;

  const cleanGallery = rawGallery.filter(
    (g: any) => typeof g === 'string' && !g.startsWith('live::') && !g.startsWith('git::') && !g.startsWith('proc::') && !g.startsWith('res::')
  );

  return {
    ...item,
    live_url: item.live_url || item.url || (liveTag ? liveTag.replace('live::', '') : ''),
    github_url: item.github_url || item.github || item.repo_url || (gitTag ? gitTag.replace('git::', '') : ''),
    process_images,
    result_images,
    gallery: cleanGallery.length > 0 ? cleanGallery : [...process_images, ...result_images],
  };
}

export async function getProjects() {
  if (!supabase) return (localProjects as any[]).map(parseProject);
  try {
    const { data, error } = await supabase.from('projects').select('*').order('created_at', { ascending: false });
    if (error || !data || data.length === 0) return (localProjects as any[]).map(parseProject);
    return data.map(parseProject);
  } catch {
    return (localProjects as any[]).map(parseProject);
  }
}

export async function getProjectById(id: string) {
  if (!supabase) {
    const found = localProjects.find((p) => p.id === id);
    return found ? parseProject(found) : undefined;
  }
  try {
    const { data, error } = await supabase.from('projects').select('*').eq('id', id).single();
    if (error || !data) {
      const found = localProjects.find((p) => p.id === id);
      return found ? parseProject(found) : undefined;
    }
    return parseProject(data);
  } catch {
    const found = localProjects.find((p) => p.id === id);
    return found ? parseProject(found) : undefined;
  }
}

export async function getArticles() {
  if (!supabase) return localArticles;
  try {
    const { data, error } = await supabase.from('articles').select('*').order('date', { ascending: false });
    if (error || !data || data.length === 0) return localArticles;
    return data;
  } catch {
    return localArticles;
  }
}

export async function getArticleById(id: string) {
  if (!supabase) return localArticles.find((a) => a.id === id);
  try {
    const { data, error } = await supabase.from('articles').select('*').eq('id', id).single();
    if (error || !data) return localArticles.find((a) => a.id === id);
    return data;
  } catch {
    return localArticles.find((a) => a.id === id);
  }
}

export async function getCompetitions() {
  if (!supabase) return localCompetitions;
  try {
    const { data, error } = await supabase.from('competitions').select('*').order('created_at', { ascending: false });
    if (error || !data || data.length === 0) return localCompetitions;
    return data;
  } catch {
    return localCompetitions;
  }
}

export async function getTrainings() {
  if (!supabase) return localTrainings;
  try {
    const { data, error } = await supabase.from('trainings').select('*').order('created_at', { ascending: false });
    if (error || !data || data.length === 0) return localTrainings;
    return data;
  } catch {
    return localTrainings;
  }
}
