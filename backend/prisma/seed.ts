import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcrypt';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Iniciando seed corporativo NOVAX...');

  // 1. Limpieza
  console.log('🧹 Limpiando tablas...');
  await prisma.detallePedido.deleteMany({});
  await prisma.pedido.deleteMany({});
  await prisma.producto.deleteMany({});
  await prisma.subcategoria.deleteMany({});
  await prisma.categoria.deleteMany({});

  // 2. Usuarios
  const password = await bcrypt.hash('admin1234', 10);
  await prisma.usuario.upsert({
    where: { correo: 'admin@novax.com' },
    update: {},
    create: {
      nombre: 'Admin Novax',
      ci: '0000001',
      correo: 'admin@novax.com',
      password: password,
      rol: 'ADMINISTRADOR',
    },
  });

  // 3. Grupos Principales (Categorías)
  const categories = [
    { nombre: 'Limpieza Líquido', descripcion: 'Detergentes, suavizantes y desinfectantes líquidos.' },
    { nombre: 'Limpieza General', descripcion: 'Productos para limpieza del hogar y multisuperficies.' },
    { nombre: 'Accesorios Limpieza', descripcion: 'Esponjas, paños, cepillos y herramientas.' },
    { nombre: 'Químicos Limpieza', descripcion: 'Desengrasantes y químicos de alto rendimiento.' }
  ];

  const catMap: any = {};
  for (const cat of categories) {
    catMap[cat.nombre] = await prisma.categoria.create({ data: cat });
  }

  // 4. Subgrupos (Subcategorías)
  const subcategoriesData = [
    { nombre: 'Detergentes', parent: 'Limpieza Líquido' },
    { nombre: 'Suavizantes', parent: 'Limpieza Líquido' },
    { nombre: 'Lavatrastes', parent: 'Limpieza Líquido' },
    { nombre: 'Desinfectantes', parent: 'Limpieza Líquido' },

    { nombre: 'Multiusos', parent: 'Limpieza General' },
    { nombre: 'Limpiavidrios', parent: 'Limpieza General' },
    { nombre: 'Pisos', parent: 'Limpieza General' },

    { nombre: 'Esponjas', parent: 'Accesorios Limpieza' },
    { nombre: 'Paños', parent: 'Accesorios Limpieza' },
    { nombre: 'Escobas', parent: 'Accesorios Limpieza' },

    { nombre: 'Desengrasantes', parent: 'Químicos Limpieza' },
    { nombre: 'Ácidos', parent: 'Químicos Limpieza' },
    { nombre: 'Solventes', parent: 'Químicos Limpieza' },
  ];

  const subMap: any = {};
  for (const sub of subcategoriesData) {
    subMap[sub.nombre] = await prisma.subcategoria.create({
      data: {
        nombre: sub.nombre,
        categoria_id: catMap[sub.parent].id
      }
    });
  }

  // 5. Imágenes Disponibles
  const imagePaths = [
    '/images/CATALOGO NOVAX PLUS/1.png',
    '/images/CATALOGO NOVAX PLUS/3.png',
    '/images/CATALOGO NOVAX PLUS/5.png',
    '/images/CATALOGO NOVAX PLUS/BABY PLUS/ROPA BEBE CELESTE.png',
    '/images/CATALOGO NOVAX PLUS/BABY PLUS/ROPA BEBE ROSADO.png',
    '/images/CATALOGO NOVAX PLUS/BABY PLUS/ROPA BEBE VIOLETA.png',
    '/images/CATALOGO NOVAX PLUS/LAVA PLUS/ROPA CELESTE.png',
    '/images/CATALOGO NOVAX PLUS/LAVA PLUS/ROPA ROSADO.png',
    '/images/CATALOGO NOVAX PLUS/LAVA PLUS/ROPA VIOLETA.png',
    '/images/CATALOGO NOVAX PLUS/MANOS PLUS/MANOS VINO.png',
    '/images/CATALOGO NOVAX PLUS/VAJILLA PLUS/VAJILLERO.png'
  ];

  const getRandomImage = () => imagePaths[Math.floor(Math.random() * imagePaths.length)];

  // 6. Productos (Min 6 por subcategoría)
  console.log('📦 Generando productos demo...');
  for (const subName in subMap) {
    const subId = subMap[subName].id;
    for (let i = 1; i <= 6; i++) {
        await prisma.producto.create({
          data: {
            nombre: `${subName} Novax Premium ${i}`,
            descripcion: `Poderosa fórmula de ${subName.toLowerCase()} para resultados profesionales. Calidad NOVAX garantizada.`,
            precio_minorista: 10 + Math.random() * 50,
            precio_mayorista: 8 + Math.random() * 40,
            presentacion: i % 2 === 0 ? 'Bidón 5L' : 'Botella 1L',
            olor: i % 2 === 0 ? 'Limón' : 'Lavanda',
            color: 'Azul Pastel',
            imagen: getRandomImage(),
            stock: 50 + Math.floor(Math.random() * 200),
            subcategoria_id: subId
          }
        });
    }
  }

  console.log(`✅ Seed finalizado exitosamente.`);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
