import { db } from '../database/db'
import { type Debit, debits } from '../database/schemas'
import { type Either, left, right } from '../utils/either'

interface CreteManyDebitOnPeriodRequest {
  debitsToCreate: {
    amount: number
    expiresAt: Date | null
    description: string
    userId: string
  }[]

  periodId: string
  userId: string
}

type CreteManyDebitPeriodResponse = Either<Error, { debits: Debit[] }>

export async function creteManyDebitPeriod({
  debitsToCreate,
  periodId,
  userId,
}: CreteManyDebitOnPeriodRequest): Promise<CreteManyDebitPeriodResponse> {
  const canCreatedDebits = db.query.periods.findFirst({
    where(periodFields, { eq, and }) {
      return and(eq(periodFields.id, periodId), eq(periodFields.userId, userId))
    },
  })

  if (!canCreatedDebits) {
    return left(
      new Error('User is not allowed to create debits on this period'),
    )
  }

  const values = debitsToCreate.map((payment) => ({
    amount: payment.amount,
    expiresAt: payment.expiresAt,
    description: payment.description,
    periodId,
  }))

  const data = await db.insert(debits).values(values).returning()

  return right({
    debits: data,
  })
}
