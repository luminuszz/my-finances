import { db } from '../database/db'
import type { User } from '../database/schemas'
import { type Either, left, right } from '../utils/either'

interface FindUserByRequest {
  id: string
}

type FindUserByResponse = Either<Error, { user: User }>

export async function findUserBy({
  id,
}: FindUserByRequest): Promise<FindUserByResponse> {
  const user = await db.query.users.findFirst({
    where(fields, operators) {
      return operators.eq(fields.id, id)
    },
  })

  if (!user) {
    return left(new Error('User not found'))
  }

  return right({ user })
}
