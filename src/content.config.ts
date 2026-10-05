import { defineCollection } from 'astro:content';
import { file } from 'astro/loaders';
import { z } from 'astro/zod';

const baseSchema = z.object({
  id: z.string(),
  img: z.string(),
  title: z.string(),
  issuer: z.string(),
  year: z.number(),
  category: z.string(),
});

const competition = defineCollection({
  loader: file('src/data/competition.json'),
  schema: baseSchema,
});

const training = defineCollection({
  loader: file('src/data/training.json'),
  schema: baseSchema,
});

export const collections = { competition, training };