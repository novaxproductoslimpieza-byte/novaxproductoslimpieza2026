import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcrypt';

const prisma = new PrismaClient();

async function main() {
  console.log('Iniciando el seeding de la base de datos NOVAX...');

  // Crear usuario administrador si no existe
  const adminEmail = 'admin@novax.com';
  const existingAdmin = await prisma.usuario.findUnique({ where: { correo: adminEmail } });

  if (!existingAdmin) {
    const hashedPassword = await bcrypt.hash('admin123', 10);
    await prisma.usuario.create({
      data: {
        nombre: 'Administrador Principal',
        ci: '9999999',
        correo: adminEmail,
        password: hashedPassword,
        rol: 'ADMINISTRADOR',
        telefono: '12345678',
        direccion: 'Oficina Central NOVAX'
      }
    });
    console.log('✓ Usuario administrador creado');
  }

  // Crear categorías de ejemplo si no hay
  const countCategorias = await prisma.categoria.count();
  if (countCategorias === 0) {
    await prisma.categoria.createMany({
      data: [
        { nombre: 'Hogar', descripcion: 'Productos de limpieza para el hogar' },
        { nombre: 'Automotriz', descripcion: 'Detergentes y ceras para autos' },
        { nombre: 'Industrial', descripcion: 'Químicos de limpieza pesada' }
      ]
    });
    console.log('✓ Categorías base creadas');
  }
}

main()
  .catch((e) => {
    console.error('Error al hacer el seed:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
    console.log('Seeding terminado');
  });
