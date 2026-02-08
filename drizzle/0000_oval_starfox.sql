CREATE TABLE `logs` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`clerk_user_id` text NOT NULL,
	`email` text NOT NULL,
	`name` text NOT NULL,
	`transaction_time` text NOT NULL,
	`transaction_type` text NOT NULL,
	`affected_table` text NOT NULL,
	`affected_user_id` text
);
