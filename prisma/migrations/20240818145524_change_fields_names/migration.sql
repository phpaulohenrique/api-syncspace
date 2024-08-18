/*
  Warnings:

  - You are about to drop the column `userId1` on the `Friendship` table. All the data in the column will be lost.
  - You are about to drop the column `userId2` on the `Friendship` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[userIdInitiated,userIdReceived]` on the table `Friendship` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `userIdInitiated` to the `Friendship` table without a default value. This is not possible if the table is not empty.
  - Added the required column `userIdReceived` to the `Friendship` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "Friendship" DROP CONSTRAINT "Friendship_userId1_fkey";

-- DropForeignKey
ALTER TABLE "Friendship" DROP CONSTRAINT "Friendship_userId2_fkey";

-- DropIndex
DROP INDEX "Friendship_userId1_userId2_key";

-- AlterTable
ALTER TABLE "Friendship" DROP COLUMN "userId1",
DROP COLUMN "userId2",
ADD COLUMN     "userIdInitiated" INTEGER NOT NULL,
ADD COLUMN     "userIdReceived" INTEGER NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "Friendship_userIdInitiated_userIdReceived_key" ON "Friendship"("userIdInitiated", "userIdReceived");

-- AddForeignKey
ALTER TABLE "Friendship" ADD CONSTRAINT "Friendship_userIdInitiated_fkey" FOREIGN KEY ("userIdInitiated") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Friendship" ADD CONSTRAINT "Friendship_userIdReceived_fkey" FOREIGN KEY ("userIdReceived") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
