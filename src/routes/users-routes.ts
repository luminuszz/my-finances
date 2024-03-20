import Elysia, { t } from 'elysia'

import { createUser } from '../use-cases/create-user'

export const usersRoutes = new Elysia().post(
  '/users',
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
