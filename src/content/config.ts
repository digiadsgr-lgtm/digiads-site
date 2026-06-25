import { defineCollection, z } from 'astro:content';

const blogCollection = defineCollection({
  type: 'content',
  schema: z.object({
    title: z.string(),
    description: z.string(),
    pubDate: z.coerce.date(),
    updatedDate: z.coerce.date().optional(),
    heroImage: z.string().optional(),
    heroAlt: z.string().optional(), // Added to support custom alt text natively
    keywords: z.array(z.string()).optional(),
    author: z.string().default('Αθανάσιος Βούρδας'),
    category: z.string().optional(),
  })
});

export const collections = {
  'blog': blogCollection,
};
