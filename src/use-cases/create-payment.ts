import { db } from '../database/db'
import { type Debit, debits } from '../database/schemas'
import { type Either, left, right } from '../utils/either'

interface CreatePaymentRequest {
  paymentPeriodId: string
  amount: number
  expiresAt: Date | null
  description: string
  userId: string
}

type CreatePaymentResponse = Either<Error, { debit: Debit }>

export async function createPayment({
  amount,
  expiresAt,
  paymentPeriodId,
  description,
  userId,
}: CreatePaymentRequest): Promise<CreatePaymentResponse> {
  const user = await db.query.users.findFirst({
    where(fields, { eq }) {
      return eq(fields.id, userId)
    },
  })

  const canCreatePayment = user && user.id === userId

  if (!canCreatePayment) {
    return left(new Error('User is not allowed to create payment'))
  }

  const [debit] = await db.insert(debits).values({
    amount,
    expiresAt,
    description,
    periodId: paymentPeriodId,
  })

  return right({ debit })
}
