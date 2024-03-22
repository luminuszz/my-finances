import { compare } from 'bcrypt'

import { db } from '../database/db'
import type { User } from '../database/schemas'
import { type Either, left, right } from '../utils/either'
import { InvalidCredentialsError } from './errors'

interface CreateSessionRequest {
  email: string
  password: string
}

type CreateSessionResponse = Either<
  InvalidCredentialsError,
  { user: User; canCreateSession: boolean }
>

export async function createSession({
  email,
  password,
}: CreateSessionRequest): Promise<CreateSessionResponse> {
  const existsUser = await db.query.users.findFirst({
    where(fields, { eq }) {
      return eq(fields.email, email)
    },
  })

  if (!existsUser) {
    return left(new InvalidCredentialsError())
  }

  const passwordMatch = await compare(password, existsUser.passwordHash)

  if (!passwordMatch) {
    return left(new InvalidCredentialsError())
  }

  return right({
    user: existsUser,
    canCreateSession: true,
  })
}
