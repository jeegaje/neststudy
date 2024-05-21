/*
  Warnings:

  - Added the required column `size` to the `CarPhoto` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "CarPhoto" ADD COLUMN     "size" INTEGER NOT NULL;
