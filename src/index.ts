import cors from '@elysiajs/cors'
import { Elysia } from 'elysia'

import { debitsRoutes } from './http/routes/debts-routes'
import { periodRoutes } from './http/routes/period-routes'
import { usersRoutes } from './http/routes/users-routes'
import { env } from './utils/env'

const app = new Elysia({})

app
  .use(
    cors({
      credentials: true,
      origin: true,
    }),
  )
  .use(usersRoutes)
  .use(periodRoutes)
  .use(debitsRoutes)
  .listen(env.API_PORT)

console.log(
  `🦊 Elysia is running at ${app.server?.hostname}:${app.server?.port}`,
)
