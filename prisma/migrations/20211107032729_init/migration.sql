/*
  Warnings:

  - The primary key for the `document` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - The primary key for the `group` table will be changed. If it partially fails, the table could be left without primary key constraint.

*/
-- DropForeignKey
ALTER TABLE "document" DROP CONSTRAINT "document_groupId_fkey";

-- AlterTable
ALTER TABLE "document" DROP CONSTRAINT "document_pkey",
ALTER COLUMN "id" SET DATA TYPE TEXT,
ALTER COLUMN "groupId" SET DATA TYPE TEXT,
ADD CONSTRAINT "document_pkey" PRIMARY KEY ("id");

-- AlterTable
ALTER TABLE "group" DROP CONSTRAINT "group_pkey",
ALTER COLUMN "id" SET DATA TYPE TEXT,
ADD CONSTRAINT "group_pkey" PRIMARY KEY ("id");

-- AddForeignKey
ALTER TABLE "document" ADD CONSTRAINT "document_groupId_fkey" FOREIGN KEY ("groupId") REFERENCES "group"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
