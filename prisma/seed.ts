import { PrismaClient } from '@prisma/client'
import { Slug } from '../src/domain/value-objects/slug'

const prisma = new PrismaClient()

async function main() {
  console.log('Start seeding...')

  // 1. Create a Restaurant
  const restaurant = await prisma.restaurant.upsert({
    where: { slug: 'syma' },
    update: {},
    create: {
      slug: 'syma',
      name: 'Syma Restaurante',
      logo: 'https://cdn-icons-png.flaticon.com/512/3170/3170733.png',
      plan: 'pro',
      isActive: true,
      config: { accentColor: '#10b981' },
      admins: {
        create: {
          name: 'Admin Syma',
          email: 'admin@syma.com',
          passwordHash: 'fake-hash',
        },
      },
    }
  })

  // 2. Create Categories
  const categoryPrincipais = await prisma.category.create({
    data: {
      name: 'Pratos Principais',
      displayOrder: 0,
      restaurantId: restaurant.id,
    }
  })

  const categoryEntradas = await prisma.category.create({
    data: {
      name: 'Entradas',
      displayOrder: 1,
      restaurantId: restaurant.id,
    }
  })

  // 3. Create Dishes with video placeholders
  const dish1 = await prisma.dish.create({
    data: {
      restaurantId: restaurant.id,
      categoryId: categoryPrincipais.id,
      name: 'Filé Mignon ao Molho Madeira',
      description: 'Suculento filé mignon grelhado na manteiga, acompanhado de risoto de parmesão.',
      price: 8990, // R$ 89,90
      videoUrl: 'http://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerJoyrides.mp4',
      thumbnailUrl: null,
      highlighted: true,
      active: true,
      viewCount: 154,
      averageRating: 4.8,
      ratingCount: 42,
      displayOrder: 0,
    }
  })

  const dish2 = await prisma.dish.create({
    data: {
      restaurantId: restaurant.id,
      categoryId: categoryPrincipais.id,
      name: 'Salmão Grelhado',
      description: 'Salmão fresco grelhado com legumes na manteiga de ervas.',
      price: 7550, // R$ 75,50
      videoUrl: 'http://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4',
      thumbnailUrl: null,
      highlighted: false,
      active: true,
      viewCount: 89,
      averageRating: 4.5,
      ratingCount: 15,
      displayOrder: 1,
    }
  })

  const dish3 = await prisma.dish.create({
    data: {
      restaurantId: restaurant.id,
      categoryId: categoryEntradas.id,
      name: 'Dadinhos de Tapioca',
      description: 'Dadinhos de tapioca com queijo coalho e geleia de pimenta.',
      price: 3200, // R$ 32,00
      videoUrl: 'http://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerMeltdowns.mp4',
      thumbnailUrl: null,
      highlighted: true,
      active: true,
      viewCount: 210,
      averageRating: 4.9,
      ratingCount: 87,
      displayOrder: 0,
    }
  })

  console.log(`Created restaurant with id: ${restaurant.id}`)
  console.log('Seeding finished.')
}

main()
  .then(async () => {
    await prisma.$disconnect()
  })
  .catch(async (e) => {
    console.error(e)
    await prisma.$disconnect()
    process.exit(1)
  })
