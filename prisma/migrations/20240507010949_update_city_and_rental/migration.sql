/*
  Warnings:

  - You are about to drop the column `active` on the `City` table. All the data in the column will be lost.
  - You are about to drop the column `description` on the `City` table. All the data in the column will be lost.
  - Added the required column `city_id` to the `Rental` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "City" DROP COLUMN "active",
DROP COLUMN "description";

-- AlterTable
ALTER TABLE "Rental" ADD COLUMN     "city_id" INTEGER NOT NULL;

-- AddForeignKey
ALTER TABLE "Rental" ADD CONSTRAINT "Rental_city_id_fkey" FOREIGN KEY ("city_id") REFERENCES "City"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
