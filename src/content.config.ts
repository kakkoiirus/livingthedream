import { defineCollection, z } from 'astro:content';
import { glob } from 'astro/loaders';

const posts = defineCollection({
  loader: glob({ pattern: '**/*.{md,mdx}', base: './src/content/posts' }),
  // Load frontmatter from post files
  schema: z.object({
    title: z.string(),
    description: z.string().optional(),
    // Use publishDate for sorting (oldest first)
    publishDate: z.coerce.date(),
    // Allow additional images array for gallery
    images: z.array(z.string()).optional(),
    // Optional inline images to be embedded in text
    inlineImages: z.array(z.string()).optional(),
  }),
});

export const collections = { posts };
