/*
  Warnings:

  - You are about to drop the column `medecine_id` on the `transaction_detail` table. All the data in the column will be lost.

*/
-- DropForeignKey
ALTER TABLE `transaction_detail` DROP FOREIGN KEY `transaction_detail_medecine_id_fkey`;

-- AlterTable
ALTER TABLE `transaction_detail` DROP COLUMN `medecine_id`,
    ADD COLUMN `medicine_id` INTEGER NOT NULL DEFAULT 0;

-- AddForeignKey
ALTER TABLE `transaction_detail` ADD CONSTRAINT `transaction_detail_medicine_id_fkey` FOREIGN KEY (`medicine_id`) REFERENCES `medicine`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;
