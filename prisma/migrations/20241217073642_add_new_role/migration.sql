-- AlterTable
ALTER TABLE `users` MODIFY `role` ENUM('USER', 'ADMIN', 'SHOP') NOT NULL DEFAULT 'USER';