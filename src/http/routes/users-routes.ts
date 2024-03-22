import Elysia, { t } from 'elysia'

import { createUser } from '../../use-cases/create-user'
import { authGuard } from '../auth-guard'

export const usersRoutes = new Elysia({ prefix: '/users' })
  .use(authGuard)
  .post(
    '/',
    async ({ body, set }) => {
      const response = await createUser(body)

      set.status = response.isRight() ? 204 : 400
    },
    {
      body: t.Object({
        name: t.String(),
        email: t.String(),
        password: t.String(),
      }),
    },
  )
  .post(
    '/sign-in',
    async ({ signIn, body }) => {
      const { email, password } = body

      return signIn({ email, password })
    },
    {
      body: t.Object({
        email: t.String(),
        password: t.String(),
      }),
    },
  )
