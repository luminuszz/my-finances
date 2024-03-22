import { readableStreamToText } from 'bun'
import Elysia, { t } from 'elysia'

import { createDebit } from '../../use-cases/create-debit'
import { creteManyDebitPeriod } from '../../use-cases/create-many-debits-on-period'
import { createPeriod } from '../../use-cases/create-period'
import { fetchDebtsByPeriod } from '../../use-cases/fetch-debts-by-period'
import { toCents } from '../../utils/parser'
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
  .post(
    ':periodId/import-debits-by-csv',
    async ({ body: { csv }, params: { periodId }, getCurrentUser, set }) => {
      const data = await readableStreamToText(csv.stream())

      const { userId } = await getCurrentUser()

      const values: { value: number; description: string }[] = []

      data.split('\n').forEach((line, index) => {
        const [description, , value] = line.split(',')

        if (index === 0) {
          return
        }

        values.push({
          description: description ?? '',
          value: toCents(Number(value) ?? 0),
        })
      })

      await creteManyDebitPeriod({
        debitsToCreate: values.map((item) => {
          return {
            amount: item.value,
            description: item.description,
            expiresAt: null,
            userId,
          }
        }),

        periodId,
        userId,
      })

      set.status = 201
    },

    {
      body: t.Object({
        csv: t.File({
          type: 'text/csv',
        }),
      }),
      params: t.Object({
        periodId: t.String(),
      }),
    },
  )
  .post(
    '/:periodId/create-debit',
    async ({ set, body, getCurrentUser, params: { periodId } }) => {
      const { userId } = await getCurrentUser()

      const response = await createDebit({
        amount: body.amount,
        description: body.description,
        expiresAt: body.expiresAt,
        debitPeriodId: periodId,
        userId,
      })
      set.status = response.isRight() ? 204 : 400
    },
    {
      body: t.Object({
        amount: t.Number(),
        description: t.String(),
        expiresAt: t.Nullable(t.Date()),
      }),

      params: t.Object({
        periodId: t.String(),
      }),
    },
  )
  .get(
    '/:periodId/debits',
    async ({ params: { periodId }, getCurrentUser, set }) => {
      const { userId } = await getCurrentUser()

      const response = await fetchDebtsByPeriod({
        periodId,
        userId,
      })

      if (response.isRight()) {
        set.status = 200

        return {
          debts: response.value.debts,
        }
      } else {
        set.status = 400

        return {
          error: response.value.message,
        }
      }
    },
    {
      params: t.Object({
        periodId: t.String(),
      }),
    },
  )
