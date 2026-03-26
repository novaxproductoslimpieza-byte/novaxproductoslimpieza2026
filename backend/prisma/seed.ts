import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Iniciando seed corporativo NOVAX 1.0...');

  // 1. Limpieza total (en orden de dependencias)
  console.log('🧹 Limpiando tablas...');
  await prisma.detallePedido.deleteMany({});
  await prisma.pedido.deleteMany({});
  await prisma.productoProveedor.deleteMany({});
  await prisma.proveedor.deleteMany({});
  await prisma.producto.deleteMany({});
  await prisma.subcategoria.deleteMany({});
  await prisma.categoria.deleteMany({});
  await prisma.usuario.deleteMany({});
  await prisma.zona.deleteMany({});
  await prisma.provincia.deleteMany({});
  await prisma.departamento.deleteMany({});

  // 2. Geoubicación Demo
  console.log('🌍 Generando departamentos, provincias y zonas...');
  const departamentos = [
    {
      nombre: 'Santa Cruz',
      provincias: {
        create: [
          {
            nombre: 'Andrés Ibáñez',
            zonas: {
              create: [
                { nombre: 'Equipetrol' },
                { nombre: 'Las Palmas' },
                { nombre: 'Urbarí' },
                { nombre: 'Plan 3000' }
              ]
            }
          },
          {
            nombre: 'Warnes',
            zonas: {
              create: [
                { nombre: 'Centro Warnes' },
                { nombre: 'Satélite Norte' }
              ]
            }
          }
        ]
      }
    },
    {
      nombre: 'La Paz',
      provincias: {
        create: [
          {
            nombre: 'Murillo',
            zonas: {
              create: [
                { nombre: 'Sopocachi' },
                { nombre: 'Miraflores' },
                { nombre: 'Calacoto' },
                { nombre: 'Obrajes' }
              ]
            }
          }
        ]
      }
    },
    {
      nombre: 'Cochabamba',
      provincias: {
        create: [
          {
            nombre: 'Cercado',
            zonas: {
              create: [
                { nombre: 'Cala Cala' },
                { nombre: 'Queru Queru' },
                { nombre: 'Centro Cochabamba' }
              ]
            }
          }
        ]
      }
    }
  ];

  for (const dep of departamentos) {
    await prisma.departamento.create({ data: dep });
  }

  // Obtener zonas para asociar usuarios
  const allZonas = await prisma.zona.findMany();

  // 3. Usuarios (Admin + Clientes Demo)
  console.log('👤 Generando usuarios demo...');
  const password = await bcrypt.hash('admin1234', 10);
  
  // Admin
  await prisma.usuario.create({
    data: {
      nombre: 'Admin Novax',
      ci: '0000001',
      correo: 'admin@novax.com',
      password: password,
      rol: 'ADMINISTRADOR',
    },
  });

  // Clientes Demo
  const clientesData = [
    { nombre: 'Juan Pérez', ci: '1234567', correo: 'juan@demo.com', zona_id: allZonas[0].id },
    { nombre: 'María García', ci: '2345678', correo: 'maria@demo.com', zona_id: allZonas[1].id },
    { nombre: 'Carlos Rodríguez', ci: '3456789', correo: 'carlos@demo.com', zona_id: allZonas[2].id },
  ];

  const clientes = [];
  for (const cli of clientesData) {
    const user = await prisma.usuario.create({
      data: {
        ...cli,
        password: password,
        rol: 'CLIENTE',
        telefono: '70000000',
        direccion: 'Calle Falsa 123'
      }
    });
    clientes.push(user);
  }

  // 4. Categorías y Subcategorías (Basadas en el catálogo real)
  console.log('📂 Generando categorías y subcategorías...');
  
  const catalogData = [
    {
      nombre: 'Limpieza Hogar',
      subcategorias: [
        { nombre: 'Lava Vajilla', descripcion: 'Detergentes para platos y utensilios' },
        { nombre: 'Cuidado de Ropa', descripcion: 'Detergentes y suavizantes' },
        { nombre: 'Desinfectantes', descripcion: 'Líquidos desinfectantes y aromatizantes' }
      ]
    },
    {
      nombre: 'Línea Bebé',
      subcategorias: [
        { nombre: 'Baby Plus', descripcion: 'Productos hipoalergénicos para bebés' }
      ]
    },
    {
      nombre: 'Cuidado Personal',
      subcategorias: [
        { nombre: 'Jabón de Manos', descripcion: 'Jabones líquidos cremosos' }
      ]
    }
  ];

  const subMap: any = {};
  for (const cat of catalogData) {
    const createdCat = await prisma.categoria.create({
      data: {
        nombre: cat.nombre,
        subcategorias: {
          create: cat.subcategorias
        }
      },
      include: { subcategorias: true }
    });
    createdCat.subcategorias.forEach(sub => {
      subMap[sub.nombre] = sub.id;
    });
  }

  // 5. Imágenes Reales Detectadas
  const images = {
    vajilla: '/images/catogo-novax-plus/VAJILLA PLUS/VAJILLERO.png',
    ropa: [
      '/images/catogo-novax-plus/LAVA PLUS/ROPA CELESTE.png',
      '/images/catogo-novax-plus/LAVA PLUS/ROPA ROSADO.png',
      '/images/catogo-novax-plus/LAVA PLUS/ROPA VIOLETA.png',
      '/images/catogo-novax-plus/LAVA PLUS/ROPA NEUTRO.png',
      '/images/catogo-novax-plus/SUAVE PLUS/SUAVIZANTE AZUL.png',
      '/images/catogo-novax-plus/SUAVE PLUS/SUAVIZANTE ROSA.png',
      '/images/catogo-novax-plus/SUAVE PLUS/SUAVIZANTE VIOLETA.png',
    ],
    baby: [
      '/images/catogo-novax-plus/BABY PLUS/ROPA BEBE CELESTE.png',
      '/images/catogo-novax-plus/BABY PLUS/ROPA BEBE ROSADO.png',
      '/images/catogo-novax-plus/BABY PLUS/ROPA BEBE VIOLETA.png',
    ],
    manos: [
      '/images/catogo-novax-plus/MANOS PLUS/MANOS VINO.png',
      '/images/catogo-novax-plus/MANOS PLUS/MANOS VINO DOS.png',
    ],
    general: [
      '/images/catogo-novax-plus/1.png',
      '/images/catogo-novax-plus/3.png',
      '/images/catogo-novax-plus/5.png',
    ]
  };

  // 6. Generación de Productos Específicos
  console.log('📦 Generando productos demo...');
  
  const productsToCreate = [
    // Vajilla
    { nombre: 'Vajilla Plus Limón', sub: 'Lava Vajilla', img: images.vajilla, precio: 15.50 },
    { nombre: 'Vajilla Plus Manzana', sub: 'Lava Vajilla', img: images.vajilla, precio: 15.50 },
    
    // Ropa
    { nombre: 'Lava Plus Celeste Fresh', sub: 'Cuidado de Ropa', img: images.ropa[0], precio: 25.00 },
    { nombre: 'Lava Plus Rosado Floral', sub: 'Cuidado de Ropa', img: images.ropa[1], precio: 25.00 },
    { nombre: 'Suave Plus Azul Brisa', sub: 'Cuidado de Ropa', img: images.ropa[4], precio: 18.50 },
    { nombre: 'Suave Plus Rosa Ternura', sub: 'Cuidado de Ropa', img: images.ropa[5], precio: 18.50 },
    
    // Baby
    { nombre: 'Baby Plus Celeste', sub: 'Baby Plus', img: images.baby[0], precio: 30.00 },
    { nombre: 'Baby Plus Rosado', sub: 'Baby Plus', img: images.baby[1], precio: 30.00 },
    { nombre: 'Baby Plus Violeta', sub: 'Baby Plus', img: images.baby[2], precio: 30.00 },
    
    // Manos
    { nombre: 'Manos Plus Vino Cremoso', sub: 'Jabón de Manos', img: images.manos[0], precio: 12.00 },
    { nombre: 'Manos Plus Frutos Rojos', sub: 'Jabón de Manos', img: images.manos[1], precio: 12.00 },
    
    // Desinfectantes
    { nombre: 'Desinfectante Novax Plus 1', sub: 'Desinfectantes', img: images.general[0], precio: 20.00 },
    { nombre: 'Desinfectante Novax Plus 3', sub: 'Desinfectantes', img: images.general[1], precio: 20.00 },
    { nombre: 'Desinfectante Novax Plus 5', sub: 'Desinfectantes', img: images.general[2], precio: 20.00 },
  ];

  const createdProducts = [];
  for (const p of productsToCreate) {
    const prod = await prisma.producto.create({
      data: {
        nombre: p.nombre,
        descripcion: `Fórmula avanzada NOVAX para profesionales y hogar. Máxima limpieza y rendimiento en su presentación de 1L.`,
        precio_minorista: p.precio,
        precio_mayorista: p.precio * 0.85,
        presentacion: 'Botella 1L',
        olor: 'Fragancia Premium',
        color: 'Multicolor',
        imagen: p.img,
        stock: 100,
        subcategoria_id: subMap[p.sub]
      }
    });
    createdProducts.push(prod);
  }

  // 7. Pedidos Demo (Para verificar relaciones)
  console.log('🛒 Generando pedidos demo...');
  for (const client of clientes) {
    const numPedidos = Math.floor(Math.random() * 2) + 1; // 1 o 2 pedidos por cliente
    for (let i = 0; i < numPedidos; i++) {
        // Seleccionar 2-4 productos aleatorios
        const selectedProds = createdProducts.sort(() => 0.5 - Math.random()).slice(0, Math.floor(Math.random() * 3) + 2);
        
        await prisma.pedido.create({
           data: {
             cliente_id: client.id,
             estado: i === 0 ? 'PENDIENTE' : 'APROBADO',
             detalles: {
               create: selectedProds.map(p => ({
                 producto_id: p.id,
                 cantidad: Math.floor(Math.random() * 5) + 1,
                 precio: p.precio_minorista
               }))
             }
           }
        });
    }
  }

  console.log(`✅ Seed finalizado exitosamente.`);
  console.log(`📊 Resumen:`);
  console.log(` - Departamentos: ${departamentos.length}`);
  console.log(` - Usuarios: ${clientes.length + 1}`);
  console.log(` - Categorías: ${catalogData.length}`);
  console.log(` - Productos: ${createdProducts.length}`);
  console.log(` - Pedidos: Generados para todos los clientes`);
}

main()
  .catch((e) => {
    console.error('❌ Error en el seed:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
