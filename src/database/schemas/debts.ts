import { createId } from '@paralleldrive/cuid2'
import { type InferSelectModel, relations } from 'drizzle-orm'
import { integer, pgTable, text, timestamp } from 'drizzle-orm/pg-core'

import { periods } from './periods'

export const debits = pgTable('debits', {
  id: text('id')
    .$defaultFn(() => createId())
    .primaryKey(),

  description: text('name').notNull(),
  amount: integer('amount').notNull(),
  expiresAt: timestamp('expires_at'),
  periodId: text('payment_period_id').references(() => periods.id),
  createdAt: timestamp('created_at').notNull().defaultNow(),
  updatedAt: timestamp('updated_at').notNull().defaultNow(),
})

export const debitsRelations = relations(debits, ({ one }) => {
  return {
    period: one(periods, {
      fields: [debits.periodId],
      references: [periods.id],
    }),
  }
})

export type Debit = InferSelectModel<typeof debits>
