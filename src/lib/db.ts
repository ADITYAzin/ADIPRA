import { supabase } from './supabase';
import localProjects from '../data/projects.json';
import localArticles from '../data/articles.json';
import localCompetitions from '../data/competition.json';
import localTrainings from '../data/training.json';

function parseProject(item: any) {
  if (!item) return item;
  const gallery = Array.isArray(item.gallery) ? item.gallery : [];
  const liveTag = gallery.find((g: any) => typeof g === 'string' && g.startsWith('live::'));
  const gitTag = gallery.find((g: any) => typeof g === 'string' && g.startsWith('git::'));
  return {
    ...item,
    live_url: item.live_url || item.url || (liveTag ? liveTag.replace('live::', '') : ''),
    github_url: item.github_url || item.github || item.repo_url || (gitTag ? gitTag.replace('git::', '') : ''),
    gallery: gallery.filter((g: any) => typeof g === 'string' && !g.startsWith('live::') && !g.startsWith('git::')),
  };
}

export async function getProjects() {
  if (!supabase) return (localProjects as any[]).map(parseProject);
  try {
    const { data, error } = await supabase.from('projects').select('*');
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
    const { data, error } = await supabase.from('competitions').select('*');
    if (error || !data || data.length === 0) return localCompetitions;
    return data;
  } catch {
    return localCompetitions;
  }
}

export async function getTrainings() {
  if (!supabase) return localTrainings;
  try {
    const { data, error } = await supabase.from('trainings').select('*');
    if (error || !data || data.length === 0) return localTrainings;
    return data;
  } catch {
    return localTrainings;
  }
}
