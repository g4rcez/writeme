/*
  Warnings:

  - You are about to drop the column `authorId` on the `Documents` table. All the data in the column will be lost.

*/
-- DropForeignKey
ALTER TABLE "Documents" DROP CONSTRAINT "Documents_authorId_fkey";

-- AlterTable
ALTER TABLE "Documents" DROP COLUMN "authorId",
ADD COLUMN     "authorsId" UUID;

-- CreateTable
CREATE TABLE "DocumentAuthors" (
    "id" UUID NOT NULL,
    "authorsId" UUID NOT NULL,
    "documentsId" UUID NOT NULL,

    CONSTRAINT "DocumentAuthors_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "Documents" ADD CONSTRAINT "Documents_authorsId_fkey" FOREIGN KEY ("authorsId") REFERENCES "Authors"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "DocumentAuthors" ADD CONSTRAINT "DocumentAuthors_authorsId_fkey" FOREIGN KEY ("authorsId") REFERENCES "Authors"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "DocumentAuthors" ADD CONSTRAINT "DocumentAuthors_documentsId_fkey" FOREIGN KEY ("documentsId") REFERENCES "Documents"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
