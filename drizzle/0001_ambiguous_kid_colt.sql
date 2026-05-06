CREATE TABLE `agent_logs` (
	`id` int AUTO_INCREMENT NOT NULL,
	`taskId` int NOT NULL,
	`agentType` varchar(64) NOT NULL,
	`agentName` varchar(128) NOT NULL,
	`status` enum('pending','running','completed','failed') DEFAULT 'pending',
	`startTime` timestamp,
	`endTime` timestamp,
	`durationMs` int,
	`input` text,
	`output` text,
	`errorMessage` text,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `agent_logs_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `review_issues` (
	`id` int AUTO_INCREMENT NOT NULL,
	`taskId` int NOT NULL,
	`agentType` varchar(64) NOT NULL,
	`severity` enum('error','warning','suggestion') NOT NULL,
	`title` varchar(255) NOT NULL,
	`description` text,
	`lineNumber` int,
	`suggestion` text,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `review_issues_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `review_statistics` (
	`id` int AUTO_INCREMENT NOT NULL,
	`userId` int NOT NULL,
	`totalReviews` int DEFAULT 0,
	`totalIssuesFound` int DEFAULT 0,
	`errorCount` int DEFAULT 0,
	`warningCount` int DEFAULT 0,
	`suggestionCount` int DEFAULT 0,
	`fixedIssuesCount` int DEFAULT 0,
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `review_statistics_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `review_tasks` (
	`id` int AUTO_INCREMENT NOT NULL,
	`userId` int NOT NULL,
	`codeContent` text NOT NULL,
	`language` varchar(32) NOT NULL,
	`title` varchar(255),
	`status` enum('pending','processing','completed','failed') DEFAULT 'pending',
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	`completedAt` timestamp,
	CONSTRAINT `review_tasks_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
ALTER TABLE `agent_logs` ADD CONSTRAINT `agent_logs_taskId_review_tasks_id_fk` FOREIGN KEY (`taskId`) REFERENCES `review_tasks`(`id`) ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `review_issues` ADD CONSTRAINT `review_issues_taskId_review_tasks_id_fk` FOREIGN KEY (`taskId`) REFERENCES `review_tasks`(`id`) ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `review_statistics` ADD CONSTRAINT `review_statistics_userId_users_id_fk` FOREIGN KEY (`userId`) REFERENCES `users`(`id`) ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `review_tasks` ADD CONSTRAINT `review_tasks_userId_users_id_fk` FOREIGN KEY (`userId`) REFERENCES `users`(`id`) ON DELETE no action ON UPDATE no action;