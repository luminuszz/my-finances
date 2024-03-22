import cors from '@elysiajs/cors'
import { Elysia } from 'elysia'

import { periodRoutes } from './http/routes/period-routes'
import { usersRoutes } from './http/routes/users-routes'
import { env } from './utils/env'

const app = new Elysia()
  .use(usersRoutes)
  .use(periodRoutes)
  .use(
    cors({
      credentials: true,
      origin: true,
    }),
  )
  .listen(env.API_PORT)

console.log(
  `🦊 Elysia is running at ${app.server?.hostname}:${app.server?.port}`,
)
