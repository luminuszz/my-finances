import { createId } from '@paralleldrive/cuid2'
import { InferSelectModel, relations } from 'drizzle-orm'
import { pgTable, real, text, timestamp } from 'drizzle-orm/pg-core'

import { periods } from './periods'

export const payments = pgTable('payments', {
  id: text('id')
    .$defaultFn(() => createId())
    .primaryKey(),

  description: text('name').notNull(),
  amount: real('amount').notNull(),
  expiresAt: timestamp('expires_at'),
  paymentPeriodId: text('payment_period_id').references(() => periods.id),
  createdAt: timestamp('created_at').notNull().defaultNow(),
  updatedAt: timestamp('updated_at').notNull().defaultNow(),
})

export const paymentRelations = relations(payments, ({ one }) => {
  return {
    period: one(periods, {
      fields: [payments.paymentPeriodId],
      references: [periods.id],
    }),
  }
})

export type Payment = InferSelectModel<typeof payments>
