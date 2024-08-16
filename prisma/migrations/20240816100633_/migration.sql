/*
  Warnings:

  - You are about to drop the column `Label` on the `dict` table. All the data in the column will be lost.
  - Added the required column `label` to the `Dict` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `dict` DROP COLUMN `Label`,
    ADD COLUMN `label` VARCHAR(191) NOT NULL;
