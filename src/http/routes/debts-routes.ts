import Elysia, { t } from 'elysia'

import { createPayment } from '../../use-cases/create-payment'
import { authGuard } from '../auth-guard'

export const debitsRoutes = new Elysia({ prefix: '/debts' })
  .use(authGuard)
  .post(
    '/',
    async ({ set, body, getCurrentUser }) => {
      const { userId } = await getCurrentUser()

      const response = await createPayment({
        amount: body.amount,
        description: body.description,
        expiresAt: body.expiresAt,
        paymentPeriodId: body.paymentPeriodId,
        userId,
      })
      set.status = response.isRight() ? 204 : 400
    },
    {
      body: t.Object({
        amount: t.Number(),
        description: t.String(),
        paymentPeriodId: t.String(),
        expiresAt: t.Nullable(t.Date()),
      }),
    },
  )
