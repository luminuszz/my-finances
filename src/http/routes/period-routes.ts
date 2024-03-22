import Elysia, { t } from 'elysia'

import { createPeriod } from '../../use-cases/create-period'
import { authGuard } from '../auth-guard'

export const periodRoutes = new Elysia({ prefix: '/periods' })
  .use(authGuard)
  .post(
    '/',
    async ({ body, getCurrentUser, set }) => {
      const { userId } = await getCurrentUser()

      if (!userId) {
        set.status = 401

        return
      }

      const { startPeriod, endPeriod } = body

      await createPeriod({
        endDate: new Date(endPeriod),
        startDate: new Date(startPeriod),
        userId,
      })
    },

    {
      body: t.Object({
        startPeriod: t.String(),
        endPeriod: t.String(),
      }),
      parseBody: true,
    },
  )
