import { createId } from '@paralleldrive/cuid2'
import { type InferSelectModel, relations } from 'drizzle-orm'
import { pgTable, text, timestamp } from 'drizzle-orm/pg-core'

import { debits } from './debts'
import { users } from './users'

export const periods = pgTable('periods', {
  id: text('id')
    .$defaultFn(() => createId())
    .primaryKey(),

  startPeriod: timestamp('start_period').notNull(),
  endPeriod: timestamp('end_period').notNull(),
  userId: text('user_id')
    .notNull()
    .references(() => users.id),

  createdAt: timestamp('created_at').notNull().defaultNow(),
  updatedAt: timestamp('updated_at').notNull().defaultNow(),
})

export const periodRelations = relations(periods, ({ one, many }) => {
  return {
    user: one(users, {
      fields: [periods.userId],
      references: [users.id],
      relationName: 'userPeriods',
    }),
    debits: many(debits),
  }
})

export type Period = InferSelectModel<typeof periods>
