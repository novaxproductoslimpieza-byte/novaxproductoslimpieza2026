/*
  Warnings:

  - The values [CANCELADO] on the enum `EstadoPedido` will be removed. If these variants are still used in the database, this will fail.

*/
-- AlterEnum
BEGIN;
CREATE TYPE "EstadoPedido_new" AS ENUM ('PENDIENTE', 'APROBADO', 'EN_DESPACHO', 'ENTREGADO');
ALTER TABLE "Pedido" ALTER COLUMN "estado" DROP DEFAULT;
ALTER TABLE "Pedido" ALTER COLUMN "estado" TYPE "EstadoPedido_new" USING ("estado"::text::"EstadoPedido_new");
ALTER TYPE "EstadoPedido" RENAME TO "EstadoPedido_old";
ALTER TYPE "EstadoPedido_new" RENAME TO "EstadoPedido";
DROP TYPE "EstadoPedido_old";
ALTER TABLE "Pedido" ALTER COLUMN "estado" SET DEFAULT 'PENDIENTE';
COMMIT;

-- AlterTable
ALTER TABLE "Usuario" ADD COLUMN     "latitud" DOUBLE PRECISION,
ADD COLUMN     "longitud" DOUBLE PRECISION,
ADD COLUMN     "zona_id" INTEGER;

-- CreateTable
CREATE TABLE "Departamento" (
    "id" SERIAL NOT NULL,
    "nombre" TEXT NOT NULL,

    CONSTRAINT "Departamento_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Provincia" (
    "id" SERIAL NOT NULL,
    "nombre" TEXT NOT NULL,
    "departamento_id" INTEGER NOT NULL,

    CONSTRAINT "Provincia_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Zona" (
    "id" SERIAL NOT NULL,
    "nombre" TEXT NOT NULL,
    "provincia_id" INTEGER NOT NULL,

    CONSTRAINT "Zona_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Departamento_nombre_key" ON "Departamento"("nombre");

-- CreateIndex
CREATE UNIQUE INDEX "Provincia_nombre_departamento_id_key" ON "Provincia"("nombre", "departamento_id");

-- CreateIndex
CREATE UNIQUE INDEX "Zona_nombre_provincia_id_key" ON "Zona"("nombre", "provincia_id");

-- AddForeignKey
ALTER TABLE "Usuario" ADD CONSTRAINT "Usuario_zona_id_fkey" FOREIGN KEY ("zona_id") REFERENCES "Zona"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Provincia" ADD CONSTRAINT "Provincia_departamento_id_fkey" FOREIGN KEY ("departamento_id") REFERENCES "Departamento"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Zona" ADD CONSTRAINT "Zona_provincia_id_fkey" FOREIGN KEY ("provincia_id") REFERENCES "Provincia"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
