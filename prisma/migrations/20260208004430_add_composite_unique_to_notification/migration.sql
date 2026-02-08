/*
  Warnings:

  - A unique constraint covering the columns `[issuerId,recipientId,type,postId,commentId]` on the table `Notification` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "Notification_issuerId_recipientId_type_postId_commentId_key" ON "Notification"("issuerId", "recipientId", "type", "postId", "commentId");
