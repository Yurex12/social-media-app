/*
  Warnings:

  - You are about to drop the column `coverPhoto` on the `user` table. All the data in the column will be lost.
  - You are about to alter the column `bio` on the `user` table. The data in that column could be lost. The data in that column will be cast from `Text` to `VarChar(160)`.

*/
-- AlterTable
ALTER TABLE "user" DROP COLUMN "coverPhoto",
ADD COLUMN     "coverImage" TEXT,
ALTER COLUMN "bio" SET DATA TYPE VARCHAR(160);
