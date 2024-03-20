import { drizzle } from 'drizzle-orm/postgres-js'
import { migrate } from 'drizzle-orm/postgres-js/migrator'
import postgres from 'postgres'

import { env } from '../utils/env'

const connection = postgres(env.DATABASE_URL, { max: 1 })

const db = drizzle(connection)

await migrate(db, { migrationsFolder: './src/database/migrations' })

await connection.end()

process.exit(0)
