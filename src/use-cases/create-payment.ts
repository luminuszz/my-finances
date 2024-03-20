import { db } from '../database/db'
import { Payment, payments } from '../database/schemas'
import { Either, right } from '../utils/either'

interface CreatePaymentRequest {
  paymentPeriodId: string
  amount: number
  expiresAt: Date
  description: string
}

type CreatePaymentResponse = Either<Error, { payment: Payment }>

export async function createPayment({
  amount,
  expiresAt,
  paymentPeriodId,
  description,
}: CreatePaymentRequest): Promise<CreatePaymentResponse> {
  const [payment] = await db.insert(payments).values({
    amount,
    expiresAt,
    paymentPeriodId,
    description,
  })

  return right({ payment })
}
