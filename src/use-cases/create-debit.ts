import { db } from '../database/db'
import { type Debit, debits } from '../database/schemas'
import { type Either, left, right } from '../utils/either'

interface CreateDebitRequest {
  debitPeriodId: string
  amount: number
  expiresAt: Date | null
  description: string
  userId: string
}

type CreateDebitResponse = Either<Error, { debit: Debit }>

export async function createDebit({
  amount,
  expiresAt,
  debitPeriodId,
  description,
  userId,
}: CreateDebitRequest): Promise<CreateDebitResponse> {
  const user = await db.query.users.findFirst({
    where(fields, { eq }) {
      return eq(fields.id, userId)
    },
  })

  const canCreateDebit = user && user.id === userId

  if (!canCreateDebit) {
    return left(new Error('User is not allowed to create debit'))
  }

  const [debit] = await db.insert(debits).values({
    amount,
    expiresAt,
    description,
    periodId: debitPeriodId,
  })

  return right({ debit })
}
