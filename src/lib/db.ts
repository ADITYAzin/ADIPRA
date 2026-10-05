import { supabase } from './supabase';
import localProjects from '../data/projects.json';
import localArticles from '../data/articles.json';
import localCompetitions from '../data/competition.json';
import localTrainings from '../data/training.json';

export async function getProjects() {
  if (!supabase) return localProjects;
  try {
    const { data, error } = await supabase.from('projects').select('*');
    if (error || !data || data.length === 0) return localProjects;
    return data;
  } catch {
    return localProjects;
  }
}

export async function getProjectById(id: string) {
  if (!supabase) return localProjects.find((p) => p.id === id);
  try {
    const { data, error } = await supabase.from('projects').select('*').eq('id', id).single();
    if (error || !data) return localProjects.find((p) => p.id === id);
    return data;
  } catch {
    return localProjects.find((p) => p.id === id);
  }
}

export async function getArticles() {
  if (!supabase) return localArticles;
  try {
    const { data, error } = await supabase.from('articles').select('*');
    if (error || !data || data.length === 0) return localArticles;
    return data;
  } catch {
    return localArticles;
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
