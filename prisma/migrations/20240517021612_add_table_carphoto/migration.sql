-- CreateTable
CREATE TABLE "CarPhoto" (
    "id" SERIAL NOT NULL,
    "path" TEXT NOT NULL,
    "description" TEXT,
    "car_id" INTEGER NOT NULL,

    CONSTRAINT "CarPhoto_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "CarPhoto" ADD CONSTRAINT "CarPhoto_car_id_fkey" FOREIGN KEY ("car_id") REFERENCES "Car"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
