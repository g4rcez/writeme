/*
  Warnings:

  - You are about to drop the column `authorsId` on the `Documents` table. All the data in the column will be lost.
  - You are about to drop the column `categoryId` on the `Documents` table. All the data in the column will be lost.
  - You are about to drop the `DocumentAuthors` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `DocumentTags` table. If the table is not empty, all the data it contains will be lost.
  - Added the required column `links` to the `Authors` table without a default value. This is not possible if the table is not empty.
  - Added the required column `authors` to the `Documents` table without a default value. This is not possible if the table is not empty.
  - Added the required column `categories` to the `Documents` table without a default value. This is not possible if the table is not empty.
  - Added the required column `tags` to the `Documents` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "DocumentAuthors" DROP CONSTRAINT "DocumentAuthors_authorsId_fkey";

-- DropForeignKey
ALTER TABLE "DocumentAuthors" DROP CONSTRAINT "DocumentAuthors_documentsId_fkey";

-- DropForeignKey
ALTER TABLE "DocumentTags" DROP CONSTRAINT "DocumentTags_documentId_fkey";

-- DropForeignKey
ALTER TABLE "DocumentTags" DROP CONSTRAINT "DocumentTags_tagsId_fkey";

-- DropForeignKey
ALTER TABLE "Documents" DROP CONSTRAINT "Documents_authorsId_fkey";

-- DropForeignKey
ALTER TABLE "Documents" DROP CONSTRAINT "Documents_categoryId_fkey";

-- AlterTable
ALTER TABLE "Authors" ADD COLUMN     "links" JSONB NOT NULL;

-- AlterTable
ALTER TABLE "Documents" DROP COLUMN "authorsId",
DROP COLUMN "categoryId",
ADD COLUMN     "authors" JSONB NOT NULL,
ADD COLUMN     "categories" JSONB NOT NULL,
ADD COLUMN     "tags" JSONB NOT NULL;

-- DropTable
DROP TABLE "DocumentAuthors";

-- DropTable
DROP TABLE "DocumentTags";
