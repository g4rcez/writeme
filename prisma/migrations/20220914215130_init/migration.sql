/*
  Warnings:

  - Added the required column `description` to the `Categories` table without a default value. This is not possible if the table is not empty.
  - Added the required column `description` to the `Documents` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Categories" ADD COLUMN     "banner" VARCHAR(256),
ADD COLUMN     "description" VARCHAR(512) NOT NULL,
ADD COLUMN     "icon" VARCHAR(256);

-- AlterTable
ALTER TABLE "Documents" ADD COLUMN     "description" VARCHAR(512) NOT NULL;
