import { db } from '../database/db'
import { Period, periods } from '../database/schemas'
import { Either, left, right } from '../utils/either'

interface CreatePeriodRequest {
  userId: string
  startDate: Date
  endDate: Date
}

type CreatePeriodResponse = Either<Error, { period: Period }>

export async function createPeriod({
  endDate,
  startDate,
  userId,
}: CreatePeriodRequest): Promise<CreatePeriodResponse> {
  const user = await db.query.users.findFirst({
    where(fields, { eq }) {
      return eq(fields.id, userId)
    },
  })

  if (!user) {
    return left(new Error('User not found'))
  }

  const [period] = await db.insert(periods).values({
    endPeriod: endDate,
    startPeriod: startDate,
    userId: user.id,
  })

  return right({ period })
}
