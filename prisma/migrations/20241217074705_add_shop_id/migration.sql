-- AlterTable
ALTER TABLE `products` ADD COLUMN `shopId` INTEGER NULL;

-- AddForeignKey
ALTER TABLE `products` ADD CONSTRAINT `products_shopId_fkey` FOREIGN KEY (`shopId`) REFERENCES `users`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;
