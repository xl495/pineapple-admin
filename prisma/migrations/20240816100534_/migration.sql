/*
  Warnings:

  - You are about to alter the column `value` on the `dict` table. The data in that column could be lost. The data in that column will be cast from `VarChar(191)` to `Int`.

*/
-- AlterTable
ALTER TABLE `dict` MODIFY `value` INTEGER NOT NULL;
