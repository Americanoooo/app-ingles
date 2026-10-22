/*
  Warnings:

  - A unique constraint covering the columns `[google_sub]` on the table `usuario` will be added. If there are existing duplicate values, this will fail.

*/
-- AlterTable
ALTER TABLE `usuario` ADD COLUMN `email_verificado` BOOLEAN NOT NULL DEFAULT false,
    ADD COLUMN `google_sub` VARCHAR(255) NULL,
    MODIFY `senha_hash` VARCHAR(255) NULL;

-- CreateIndex
CREATE UNIQUE INDEX `usuario_google_sub_key` ON `usuario`(`google_sub`);
