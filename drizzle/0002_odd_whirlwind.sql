ALTER TABLE "student_progress" ADD COLUMN "explanation_done" boolean DEFAULT false NOT NULL;--> statement-breakpoint
ALTER TABLE "student_progress" ADD COLUMN "board_done" boolean DEFAULT false NOT NULL;--> statement-breakpoint
ALTER TABLE "student_progress" ADD COLUMN "checkpoint_done" boolean DEFAULT false NOT NULL;--> statement-breakpoint
ALTER TABLE "student_progress" ADD COLUMN "exercise_done" boolean DEFAULT false NOT NULL;--> statement-breakpoint
ALTER TABLE "student_progress" ADD COLUMN "completed_at" timestamp;--> statement-breakpoint
CREATE UNIQUE INDEX "student_progress_user_lesson_unique" ON "student_progress" USING btree ("user_id","lesson_id");