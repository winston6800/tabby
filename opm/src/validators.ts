import { z } from "zod";

export const userSchema = z.object({
  id: z.number().int().positive().optional(),
  email: z.string().email(),
  discord_id: z.string().optional().nullable(),
  created_at: z.date().optional(),
});

export const profileSchema = z.object({
  user_id: z.number().int().positive(),
  display_name: z.string().min(1),
  avatar_url: z.string().url().optional(),
  bio: z.string().optional(),
});
