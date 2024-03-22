ALTER TABLE "payments" RENAME TO "debits";--> statement-breakpoint
ALTER TABLE "debits" DROP CONSTRAINT "payments_payment_period_id_periods_id_fk";
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "debits" ADD CONSTRAINT "debits_payment_period_id_periods_id_fk" FOREIGN KEY ("payment_period_id") REFERENCES "periods"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
