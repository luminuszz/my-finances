import { Elysia } from 'elysia'

import { usersRoutes } from './routes/users-routes'
import { env } from './utils/env'

const app = new Elysia().use(usersRoutes).listen(env.API_PORT)

console.log(env.DATABASE_HOST)

console.log(
  `🦊 Elysia is running at ${app.server?.hostname}:${app.server?.port}`,
)
