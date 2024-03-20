import { defineConfig } from 'drizzle-kit'

import { env } from './src/utils/env'

export default defineConfig({
  schema: 'src/database/schemas',
  out: 'src/database/migrations',
  driver: 'pg',
  dbCredentials: {
    connectionString: env.DATABASE_URL,
  },
  verbose: true,
  strict: true,
})
