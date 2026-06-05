import { z } from 'zod';
import { ConsentType, TalentSegment } from './types';
import { SESSION_DURATIONS } from './constants';

export const consentSchema = z.object({
  type: z.nativeEnum(ConsentType),
  version: z.string().min(1),
  accepted: z.boolean(),
});

export const registerSchema = z.object({
  email: z.email(),
  password: z
    .string()
    .min(10)
    .regex(/[A-Z]/)
    .regex(/[a-z]/)
    .regex(/[0-9]/)
    .regex(/[^A-Za-z0-9]/),
  firstName: z.string().min(1).max(100),
  lastName: z.string().min(1).max(100),
  phone: z.string().regex(/^\+[1-9]\d{7,14}$/).optional(),
  consents: z.array(consentSchema),
});

export const loginSchema = z.object({
  email: z.email(),
  password: z.string().min(1),
});

export const talentApplicationSchema = z.object({
  publicName: z.string().min(2).max(120),
  headline: z.string().min(5).max(160),
  bio: z.string().min(20).max(5000),
  segment: z.nativeEnum(TalentSegment),
  categoryIds: z.array(z.string().min(1)).min(1),
  sessionTypes: z
    .array(
      z.object({
        title: z.string().min(3).max(120),
        description: z.string().max(500).optional(),
        durationMinutes: z.enum(SESSION_DURATIONS.map(String) as unknown as [string, ...string[]]).transform(Number),
        priceMinor: z.number().int().min(1000),
        currency: z.enum(['TRY', 'USD']),
      }),
    )
    .min(1),
});
