-- CreateTable
CREATE TABLE `AllowedList` (
    `id` VARCHAR(191) NOT NULL,
    `email` VARCHAR(128) NOT NULL,
    `authorized` BOOLEAN NOT NULL DEFAULT false,

    UNIQUE INDEX `AllowedList_email_key`(`email`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
