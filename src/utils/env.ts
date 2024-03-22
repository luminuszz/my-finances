import { z } from 'zod'

const envSchema = z.object({
  DATABASE_USER: z.string(),
  DATABASE_PASSWORD: z.string(),
  DATABASE_DB_NAME: z.string(),
  DATABASE_PORT: z.coerce.number(),
  DATABASE_HOST: z.string(),
  DATABASE_URL: z.string(),
  API_PORT: z.coerce.number(),
  JWT_SECRET: z.string(),
})

export type EnvType = z.infer<typeof envSchema>

export const env = envSchema.parse(process.env)
