import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcrypt';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Iniciando seed de la base de datos NOVAX...');

  // ── 3. GEOLOCALIZACIÓN ──
  console.log('🌍 Cargando Departamentos, Provincias y Zonas...');
  
  const departamentos = [
    'Beni', 'Chuquisaca', 'Cochabamba', 'La Paz', 'Oruro', 'Pando', 'Potosí', 'Santa Cruz', 'Tarija'
  ];

  for (const dep of departamentos) {
    await prisma.departamento.upsert({
      where: { nombre: dep },
      update: {},
      create: { nombre: dep },
    });
  }

  const depCbba = await prisma.departamento.findUnique({ where: { nombre: 'Cochabamba' } });
  
  if (depCbba) {
    const provinciasCbba = ['Cercado', 'Quillacollo', 'Sacaba', 'Punata', 'Tapacarí', 'Chapare'];
    for (const prov of provinciasCbba) {
      await prisma.provincia.upsert({
        where: { nombre_departamento_id: { nombre: prov, departamento_id: depCbba.id } },
        update: {},
        create: { nombre: prov, departamento_id: depCbba.id },
      });
    }

    const provCercado = await prisma.provincia.findFirst({ where: { nombre: 'Cercado', departamento_id: depCbba.id } });
    if (provCercado) {
      const zonasCercado = ['Zona Norte', 'Zona Centro', 'Zona Sur', 'Calacala', 'Queru Queru', 'Sarco'];
      for (const zona of zonasCercado) {
        await prisma.zona.upsert({
          where: { nombre_provincia_id: { nombre: zona, provincia_id: provCercado.id } },
          update: {},
          create: { nombre: zona, provincia_id: provCercado.id },
        });
      }
    }
  }

  const defaultZona = await prisma.zona.findFirst({ where: { nombre: 'Zona Norte' } });

  // ── 4. ADMINISTRADOR Y CLIENTE CON GEOLOCALIZACIÓN ──
  const adminPassword = await bcrypt.hash('admin1234', 10);
  await prisma.usuario.upsert({
    where: { correo: 'admin@novax.com' },
    update: {
      latitud: -17.37,
      longitud: -66.15,
      zona_id: defaultZona?.id
    },
    create: {
      nombre: 'Administrador Novax',
      ci: '0000001',
      telefono: '77700001',
      direccion: 'Av. Principal 100, La Paz',
      correo: 'admin@novax.com',
      password: adminPassword,
      rol: 'ADMINISTRADOR',
      latitud: -17.37,
      longitud: -66.15,
      zona_id: defaultZona?.id
    },
  });

  const clientPassword = await bcrypt.hash('cliente1234', 10);
  await prisma.usuario.upsert({
    where: { correo: 'cliente@novax.com' },
    update: {
      latitud: -17.38,
      longitud: -66.16,
      zona_id: defaultZona?.id
    },
    create: {
      nombre: 'Juan Pérez',
      ci: '1234567',
      telefono: '77712345',
      direccion: 'Calle Comercio 25, Cochabamba',
      correo: 'cliente@novax.com',
      password: clientPassword,
      rol: 'CLIENTE',
      latitud: -17.38,
      longitud: -66.16,
      zona_id: defaultZona?.id
    },
  });
  console.log('✅ Usuarios con geolocalización actualizados');

  // ── 5. CATEGORÍAS & SUBCATEGORÍAS ──
  const catHogar = await prisma.categoria.upsert({
    where: { id: 1 },
    update: {},
    create: { nombre: 'Hogar', descripcion: 'Productos de limpieza para el hogar' },
  });
  const catIndustrial = await prisma.categoria.upsert({
    where: { id: 2 },
    update: {},
    create: { nombre: 'Industrial', descripcion: 'Productos para limpieza industrial y comercial' },
  });
  const catPersonal = await prisma.categoria.upsert({
    where: { id: 3 },
    update: {},
    create: { nombre: 'Higiene Personal', descripcion: 'Productos de higiene y cuidado personal' },
  });

  const subLavavajillas = await prisma.subcategoria.upsert({
    where: { id: 1 },
    update: {},
    create: { nombre: 'Lavavajillas', descripcion: 'Detergentes para loza', categoria_id: catHogar.id },
  });
  const subSuelos = await prisma.subcategoria.upsert({
    where: { id: 2 },
    update: {},
    create: { nombre: 'Limpia Suelos', descripcion: 'Desinfectantes y limpiadores de pisos', categoria_id: catHogar.id },
  });
  const subRopa = await prisma.subcategoria.upsert({
    where: { id: 3 },
    update: {},
    create: { nombre: 'Lavandería', descripcion: 'Detergentes y suavizantes para ropa', categoria_id: catHogar.id },
  });
  const subDesinfectantes = await prisma.subcategoria.upsert({
    where: { id: 4 },
    update: {},
    create: { nombre: 'Desinfectantes', descripcion: 'Productos desinfectantes industriales', categoria_id: catIndustrial.id },
  });
  const subDesgrasantes = await prisma.subcategoria.upsert({
    where: { id: 5 },
    update: {},
    create: { nombre: 'Desgrasantes', descripcion: 'Removedores de grasa industriales', categoria_id: catIndustrial.id },
  });
  const subJabon = await prisma.subcategoria.upsert({
    where: { id: 6 },
    update: {},
    create: { nombre: 'Jabones', descripcion: 'Jabones líquidos y en barra', categoria_id: catPersonal.id },
  });
  console.log('✅ Categorías y subcategorías creadas');

  // ── 4. PRODUCTOS ──
  const productos = [
    {
      nombre: 'Lavavajillas Limón 1L',
      descripcion: 'Concentrado lavavajillas con aroma a limón, limpia y desengrasas eficazmente.',
      precio_minorista: 12.50,
      precio_mayorista: 9.00,
      presentacion: 'Botella 1 Litro',
      olor: 'Limón',
      color: 'Amarillo',
      imagen: '/images/lavavajillas-limon.png',
      stock: 200,
      subcategoria_id: subLavavajillas.id,
    },
    {
      nombre: 'Lavavajillas Naranja 500ml',
      descripcion: 'Fórmula extra concentrada con aroma a naranja.',
      precio_minorista: 8.00,
      precio_mayorista: 5.50,
      presentacion: 'Botella 500ml',
      olor: 'Naranja',
      color: 'Naranja',
      imagen: '/images/lavavajillas-naranja.png',
      stock: 150,
      subcategoria_id: subLavavajillas.id,
    },
    {
      nombre: 'Limpia Pisos Menta 2L',
      descripcion: 'Desinfectante de pisos con aroma a menta, actúa contra gérmenes y bacterias.',
      precio_minorista: 18.00,
      precio_mayorista: 13.50,
      presentacion: 'Bidón 2 Litros',
      olor: 'Menta',
      color: 'Verde',
      imagen: '/images/limpia-pisos-menta.png',
      stock: 120,
      subcategoria_id: subSuelos.id,
    },
    {
      nombre: 'Limpia Pisos Lavanda 1L',
      descripcion: 'Limpiador de suelos con extracto de lavanda, deja fragancia duradera.',
      precio_minorista: 15.00,
      precio_mayorista: 11.00,
      presentacion: 'Botella 1 Litro',
      olor: 'Lavanda',
      color: 'Morado',
      imagen: '/images/limpia-pisos-lavanda.png',
      stock: 90,
      subcategoria_id: subSuelos.id,
    },
    {
      nombre: 'Detergente Ropa Floral 2kg',
      descripcion: 'Detergente en polvo para ropa blanca y de color, con enzimas activas.',
      precio_minorista: 25.00,
      precio_mayorista: 18.00,
      presentacion: 'Bolsa 2 Kilogramos',
      olor: 'Floral',
      color: 'Blanco',
      imagen: '/images/detergente-ropa-floral.png',
      stock: 80,
      subcategoria_id: subRopa.id,
    },
    {
      nombre: 'Suavizante Ropa Brisa 1L',
      descripcion: 'Suavizante concentrado para ropa, efecto antiestático.',
      precio_minorista: 14.00,
      precio_mayorista: 10.00,
      presentacion: 'Botella 1 Litro',
      olor: 'Brisa Marina',
      color: 'Azul claro',
      imagen: '/images/suavizante-brisa.png',
      stock: 110,
      subcategoria_id: subRopa.id,
    },
    {
      nombre: 'Desinfectante Industrial Cloro 4L',
      descripcion: 'Hipoclorito de sodio al 5%, ideal para hospitales, restaurantes y oficinas.',
      precio_minorista: 30.00,
      precio_mayorista: 22.00,
      presentacion: 'Bidón 4 Litros',
      olor: 'Cloro',
      color: 'Transparente',
      imagen: '/images/desinfectante-cloro.png',
      stock: 60,
      subcategoria_id: subDesinfectantes.id,
    },
    {
      nombre: 'Desinfectante Amonio Cuaternario 5L',
      descripcion: 'Desinfectante de amplio espectro sin olor. Uso hospitalario.',
      precio_minorista: 55.00,
      precio_mayorista: 42.00,
      presentacion: 'Bidón 5 Litros',
      olor: 'Sin olor',
      color: 'Transparente',
      imagen: '/images/desinfectante-amonio.png',
      stock: 40,
      subcategoria_id: subDesinfectantes.id,
    },
    {
      nombre: 'Desgrasante Industrial 1L',
      descripcion: 'Removedor de grasa para cocinas industriales y maquinaria.',
      precio_minorista: 22.00,
      precio_mayorista: 16.00,
      presentacion: 'Botella 1 Litro',
      olor: 'Cítrico',
      color: 'Amarillo',
      imagen: '/images/desgrasante-industrial.png',
      stock: 55,
      subcategoria_id: subDesgrasantes.id,
    },
    {
      nombre: 'Jabón Líquido Antibacterial 500ml',
      descripcion: 'Jabón líquido para manos con efecto antibacterial. Apto para dispensadores.',
      precio_minorista: 10.00,
      precio_mayorista: 7.00,
      presentacion: 'Repuesto 500ml',
      olor: 'Almendras',
      color: 'Beige',
      imagen: '/images/jabon-antibacterial.png',
      stock: 180,
      subcategoria_id: subJabon.id,
    },
  ];

  for (const prod of productos) {
    await prisma.producto.upsert({
      where: { id: productos.indexOf(prod) + 1 },
      update: {},
      create: prod,
    });
  }
  console.log(`✅ ${productos.length} productos creados`);

  console.log('\n🎉 Seed completado exitosamente.');
  console.log('─────────────────────────────────');
  console.log('📧 Admin:   admin@novax.com   / admin1234');
  console.log('📧 Cliente: cliente@novax.com / cliente1234');
}

main()
  .catch((e) => {
    console.error('❌ Error en el seed:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
