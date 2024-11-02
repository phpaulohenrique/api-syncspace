-- CreateTable
CREATE TABLE "Chat" (
    "id" SERIAL NOT NULL,
    "friendshipId" INTEGER NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "available" BOOLEAN NOT NULL DEFAULT true,

    CONSTRAINT "Chat_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Chat_friendshipId_key" ON "Chat"("friendshipId");

-- AddForeignKey
ALTER TABLE "Chat" ADD CONSTRAINT "Chat_friendshipId_fkey" FOREIGN KEY ("friendshipId") REFERENCES "Friendship"("id") ON DELETE CASCADE ON UPDATE CASCADE;
