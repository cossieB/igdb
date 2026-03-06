CREATE TABLE `accounts` (
	`id` text PRIMARY KEY,
	`account_id` text NOT NULL,
	`provider_id` text NOT NULL,
	`user_id` text NOT NULL,
	`access_token` text,
	`refresh_token` text,
	`id_token` text,
	`access_token_expires_at` integer,
	`refresh_token_expires_at` integer,
	`scope` text,
	`password` text,
	`created_at` integer DEFAULT (cast(unixepoch('subsecond') * 1000 as integer)) NOT NULL,
	`updated_at` integer NOT NULL,
	CONSTRAINT `fk_accounts_user_id_users_id_fk` FOREIGN KEY (`user_id`) REFERENCES `users`(`id`) ON DELETE CASCADE
);
--> statement-breakpoint
CREATE TABLE `apikeys` (
	`id` text PRIMARY KEY,
	`config_id` text DEFAULT 'default' NOT NULL,
	`name` text,
	`start` text,
	`reference_id` text NOT NULL,
	`prefix` text,
	`key` text NOT NULL,
	`refill_interval` integer,
	`refill_amount` integer,
	`last_refill_at` integer,
	`enabled` integer DEFAULT true,
	`rate_limit_enabled` integer DEFAULT true,
	`rate_limit_time_window` integer DEFAULT 86400000,
	`rate_limit_max` integer DEFAULT 10,
	`request_count` integer DEFAULT 0,
	`remaining` integer,
	`last_request` integer,
	`expires_at` integer,
	`created_at` integer NOT NULL,
	`updated_at` integer NOT NULL,
	`permissions` text,
	`metadata` text
);
--> statement-breakpoint
CREATE TABLE `sessions` (
	`id` text PRIMARY KEY,
	`expires_at` integer NOT NULL,
	`token` text NOT NULL UNIQUE,
	`created_at` integer DEFAULT (cast(unixepoch('subsecond') * 1000 as integer)) NOT NULL,
	`updated_at` integer NOT NULL,
	`ip_address` text,
	`user_agent` text,
	`user_id` text NOT NULL,
	CONSTRAINT `fk_sessions_user_id_users_id_fk` FOREIGN KEY (`user_id`) REFERENCES `users`(`id`) ON DELETE CASCADE
);
--> statement-breakpoint
CREATE TABLE `users` (
	`id` text PRIMARY KEY,
	`name` text NOT NULL,
	`email` text NOT NULL UNIQUE,
	`email_verified` integer DEFAULT false NOT NULL,
	`image` text,
	`created_at` integer DEFAULT (cast(unixepoch('subsecond') * 1000 as integer)) NOT NULL,
	`updated_at` integer DEFAULT (cast(unixepoch('subsecond') * 1000 as integer)) NOT NULL,
	`role` text DEFAULT 'user' NOT NULL
);
--> statement-breakpoint
CREATE TABLE `verifications` (
	`id` text PRIMARY KEY,
	`identifier` text NOT NULL,
	`value` text NOT NULL,
	`expires_at` integer NOT NULL,
	`created_at` integer DEFAULT (cast(unixepoch('subsecond') * 1000 as integer)) NOT NULL,
	`updated_at` integer DEFAULT (cast(unixepoch('subsecond') * 1000 as integer)) NOT NULL
);
--> statement-breakpoint
CREATE TABLE `actors` (
	`actor_id` integer PRIMARY KEY,
	`name` text NOT NULL,
	`photo` text,
	`bio` text DEFAULT '' NOT NULL,
	`date_added` text DEFAULT CURRENT_TIMESTAMP NOT NULL,
	`date_modified` text NOT NULL
);
--> statement-breakpoint
CREATE TABLE `developers` (
	`developer_id` integer PRIMARY KEY,
	`name` text NOT NULL,
	`logo` text NOT NULL,
	`location` text,
	`summary` text DEFAULT '' NOT NULL,
	`country` text,
	`date_added` text DEFAULT CURRENT_TIMESTAMP NOT NULL,
	`date_modified` text NOT NULL
);
--> statement-breakpoint
CREATE TABLE `game_actors` (
	`appearance_id` integer PRIMARY KEY,
	`game_id` integer NOT NULL,
	`actor_id` integer NOT NULL,
	`character` text NOT NULL,
	`role_type` text DEFAULT 'major character' NOT NULL,
	CONSTRAINT `fk_game_actors_game_id_games_game_id_fk` FOREIGN KEY (`game_id`) REFERENCES `games`(`game_id`) ON DELETE CASCADE,
	CONSTRAINT `fk_game_actors_actor_id_actors_actor_id_fk` FOREIGN KEY (`actor_id`) REFERENCES `actors`(`actor_id`) ON DELETE CASCADE,
	CONSTRAINT `game_actors_game_id_actor_id_unique` UNIQUE(`game_id`,`actor_id`)
);
--> statement-breakpoint
CREATE TABLE `game_genres` (
	`game_id` integer NOT NULL,
	`genre` text NOT NULL,
	CONSTRAINT `game_genres_pk` PRIMARY KEY(`game_id`, `genre`),
	CONSTRAINT `fk_game_genres_game_id_games_game_id_fk` FOREIGN KEY (`game_id`) REFERENCES `games`(`game_id`) ON DELETE CASCADE,
	CONSTRAINT `fk_game_genres_genre_genres_name_fk` FOREIGN KEY (`genre`) REFERENCES `genres`(`name`) ON UPDATE CASCADE ON DELETE CASCADE
);
--> statement-breakpoint
CREATE TABLE `game_platforms` (
	`game_id` integer NOT NULL,
	`platform_id` integer NOT NULL,
	CONSTRAINT `game_platforms_pk` PRIMARY KEY(`game_id`, `platform_id`),
	CONSTRAINT `fk_game_platforms_game_id_games_game_id_fk` FOREIGN KEY (`game_id`) REFERENCES `games`(`game_id`) ON DELETE CASCADE,
	CONSTRAINT `fk_game_platforms_platform_id_platforms_platform_id_fk` FOREIGN KEY (`platform_id`) REFERENCES `platforms`(`platform_id`) ON DELETE CASCADE
);
--> statement-breakpoint
CREATE TABLE `games` (
	`game_id` integer PRIMARY KEY,
	`title` text NOT NULL,
	`summary` text DEFAULT '' NOT NULL,
	`developer_id` integer NOT NULL,
	`publisher_id` integer NOT NULL,
	`release_date` text NOT NULL,
	`cover` text NOT NULL,
	`banner` text NOT NULL,
	`trailer` text,
	`date_added` text DEFAULT CURRENT_TIMESTAMP NOT NULL,
	`date_modified` text NOT NULL,
	CONSTRAINT `fk_games_developer_id_developers_developer_id_fk` FOREIGN KEY (`developer_id`) REFERENCES `developers`(`developer_id`),
	CONSTRAINT `fk_games_publisher_id_publishers_publisher_id_fk` FOREIGN KEY (`publisher_id`) REFERENCES `publishers`(`publisher_id`)
);
--> statement-breakpoint
CREATE TABLE `genres` (
	`name` text PRIMARY KEY,
	`description` text DEFAULT '' NOT NULL,
	`date_added` text DEFAULT CURRENT_TIMESTAMP NOT NULL,
	`date_modified` text NOT NULL
);
--> statement-breakpoint
CREATE TABLE `media` (
	`key` text PRIMARY KEY,
	`content_type` text NOT NULL,
	`game_id` integer,
	`metadata` text DEFAULT '{}' NOT NULL,
	`created_at` text DEFAULT CURRENT_TIMESTAMP NOT NULL,
	CONSTRAINT `fk_media_game_id_games_game_id_fk` FOREIGN KEY (`game_id`) REFERENCES `games`(`game_id`) ON DELETE SET NULL
);
--> statement-breakpoint
CREATE TABLE `platforms` (
	`platform_id` integer PRIMARY KEY,
	`name` text NOT NULL,
	`logo` text NOT NULL,
	`release_date` text NOT NULL,
	`summary` text DEFAULT '' NOT NULL,
	`date_added` text DEFAULT CURRENT_TIMESTAMP NOT NULL,
	`date_modified` text NOT NULL
);
--> statement-breakpoint
CREATE TABLE `publishers` (
	`publisher_id` integer PRIMARY KEY,
	`name` text NOT NULL,
	`logo` text NOT NULL,
	`headquarters` text,
	`summary` text DEFAULT '' NOT NULL,
	`country` text,
	`date_added` text DEFAULT CURRENT_TIMESTAMP NOT NULL,
	`date_modified` text NOT NULL
);
--> statement-breakpoint
CREATE TABLE `review` (
	`review_id` integer PRIMARY KEY,
	`user_id` text NOT NULL,
	`game_id` integer NOT NULL,
	`date_added` text DEFAULT CURRENT_TIMESTAMP NOT NULL,
	`date_modified` text NOT NULL,
	`text` text NOT NULL,
	`score` integer NOT NULL,
	CONSTRAINT `fk_review_user_id_users_id_fk` FOREIGN KEY (`user_id`) REFERENCES `users`(`id`),
	CONSTRAINT `fk_review_game_id_games_game_id_fk` FOREIGN KEY (`game_id`) REFERENCES `games`(`game_id`),
	CONSTRAINT `review_user_id_game_id_unique` UNIQUE(`user_id`,`game_id`),
	CONSTRAINT "review_length" CHECK(LENGTH("text") > 3),
	CONSTRAINT "valid_score" CHECK("score" > 0 AND "score" < 6)
);
--> statement-breakpoint
CREATE INDEX `accounts_userId_idx` ON `accounts` (`user_id`);--> statement-breakpoint
CREATE INDEX `apikeys_configId_idx` ON `apikeys` (`config_id`);--> statement-breakpoint
CREATE INDEX `apikeys_referenceId_idx` ON `apikeys` (`reference_id`);--> statement-breakpoint
CREATE INDEX `apikeys_key_idx` ON `apikeys` (`key`);--> statement-breakpoint
CREATE INDEX `sessions_userId_idx` ON `sessions` (`user_id`);--> statement-breakpoint
CREATE INDEX `verifications_identifier_idx` ON `verifications` (`identifier`);--> statement-breakpoint
CREATE INDEX `games_dev_id_idx` ON `games` (`developer_id`);--> statement-breakpoint
CREATE INDEX `games_pub_id_idx` ON `games` (`publisher_id`);--> statement-breakpoint
CREATE INDEX `media_game_id_idx` ON `media` (`game_id`);