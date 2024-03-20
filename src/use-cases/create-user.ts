import { hash } from 'bcrypt'

import { db } from '../database/db'
import { User, users } from '../database/schemas'
import { Either, left, right } from '../utils/either'

interface CreateUserRequest {
  name: string
  email: string
  password: string
}

type CreateUserResponse = Either<Error, User>

export async function createUser(
  data: CreateUserRequest,
): Promise<CreateUserResponse> {
  const existsUser = await db.query.users.findFirst({
    where(fields, operators) {
      return operators.eq(fields.email, data.email)
    },
  })

  if (existsUser) {
    return left(new Error('User already exists'))
  }

  const [user] = await db
    .insert(users)
    .values({
      name: data.name,
      email: data.email,
      passwordHash: await hash(data.password, 10),
    })
    .returning()

  return right(user)
}
