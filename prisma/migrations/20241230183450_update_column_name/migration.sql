/*
  Warnings:

  - You are about to drop the column `passwordResetDate` on the `users` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE `users` DROP COLUMN `passwordResetDate`,
    ADD COLUMN `passwordResetExpireDate` DATETIME(3) NULL;
