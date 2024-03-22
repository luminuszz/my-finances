import jwt from '@elysiajs/jwt'
import Elysia, { t } from 'elysia'

import { createSession } from '../use-cases/create-session'
import { env } from '../utils/env'

interface CreateSessionDto {
  email: string
  password: string
}

export const authGuard = new Elysia({ name: 'authGuard' })
  .use(
    jwt({
      secret: env.JWT_SECRET,
      schema: t.Object({
        userId: t.String(),
        email: t.String(),
      }),
    }),
  )
  .derive(({ set, jwt, cookie: { token } }) => {
    return {
      getCurrentUser: async () => {
        console.log({ token: token.value })

        if (!token.value) {
          set.status = 401
        }

        const userPayload = await jwt.verify(token.value)

        if (!userPayload) {
          set.status = 401
          throw new Error('Invalid token')
        }

        return {
          userId: userPayload.userId,
          email: userPayload.email,
        }
      },

      signIn: async ({ email, password }: CreateSessionDto) => {
        const response = await createSession({ email, password })

        if (response.isLeft()) {
          set.status = 401

          return {
            message: response.value,
          }
        }

        if (!response.value.canCreateSession) {
          set.status = 401

          return {
            message: 'User is not allowed to create session',
          }
        }

        const { user } = response.value

        const value = await jwt.sign({ email: user.email, userId: user.id })

        token.set({
          path: '/',
          expires: new Date(Date.now() + 1000 * 60 * 60 * 24 * 7),
          httpOnly: true,
          value,
        })
      },
    }
  })
