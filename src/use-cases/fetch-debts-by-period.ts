import { db } from '../database/db'
import { type Debit } from '../database/schemas'
import { type Either, left, right } from '../utils/either'

interface fetchDebtsByPeriodRequest {
  periodId: string
  userId: string
}

type fetchDebtsByPeriodResponse = Either<Error, { debts: Debit[] }>

export async function fetchDebtsByPeriod({
  periodId,
  userId,
}: fetchDebtsByPeriodRequest): Promise<fetchDebtsByPeriodResponse> {
  const period = db.query.periods.findFirst({
    where(periodFields, { eq, and }) {
      return and(eq(periodFields.id, periodId), eq(periodFields.userId, userId))
    },
  })

  if (!period) {
    return left(new Error('period not found'))
  }

  const debts = await db.query.debits.findMany({
    where(debitFields, { eq }) {
      return eq(debitFields.periodId, periodId)
    },
  })

  return right({
    debts,
  })
}
