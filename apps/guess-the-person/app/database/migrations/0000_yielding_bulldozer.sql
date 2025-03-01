CREATE TABLE `answers` (
	`id` text PRIMARY KEY NOT NULL,
	`game_code` text NOT NULL,
	`user_code` text NOT NULL,
	`guessed_user_code` text NOT NULL,
	`round_number` integer NOT NULL,
	`number_of_tries` integer DEFAULT 0,
	FOREIGN KEY (`game_code`) REFERENCES `games`(`game_code`) ON UPDATE no action ON DELETE no action,
	FOREIGN KEY (`user_code`) REFERENCES `users`(`user_code`) ON UPDATE no action ON DELETE no action,
	FOREIGN KEY (`guessed_user_code`) REFERENCES `users`(`user_code`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
CREATE TABLE `games` (
	`game_code` text PRIMARY KEY NOT NULL,
	`name` text NOT NULL,
	`started` integer DEFAULT false,
	`current_round` integer DEFAULT 1,
	`current_unknown_user` text
);
--> statement-breakpoint
CREATE UNIQUE INDEX `games_game_code_unique` ON `games` (`game_code`);--> statement-breakpoint
CREATE TABLE `users` (
	`user_code` text PRIMARY KEY NOT NULL,
	`game_code` text NOT NULL,
	`name` text NOT NULL,
	`personality_type` text,
	`cartoon_character` text,
	`eye_color` text,
	`guilty_pleasure_song` text,
	`user_was_selected` integer DEFAULT false,
	FOREIGN KEY (`game_code`) REFERENCES `games`(`game_code`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
CREATE UNIQUE INDEX `users_user_code_unique` ON `users` (`user_code`);