import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

async function main() {
  // Create activity types
  const activityTypes = await Promise.all([
    prisma.activityType.upsert({
      where: { name: 'Webinar' },
      update: {},
      create: { name: 'Webinar' }
    }),
    prisma.activityType.upsert({
      where: { name: 'Workshop' },
      update: {},
      create: { name: 'Workshop' }
    }),
    prisma.activityType.upsert({
      where: { name: 'Survey' },
      update: {},
      create: { name: 'Survey' }
    }),
    prisma.activityType.upsert({
      where: { name: 'Interview' },
      update: {},
      create: { name: 'Interview' }
    }),
    prisma.activityType.upsert({
      where: { name: 'Focus Group' },
      update: {},
      create: { name: 'Focus Group' }
    })
  ]);

  // Create sectors if they don't exist
  const sectors = await Promise.all([
    prisma.sector.upsert({
      where: { id: 1 },
      update: { name: 'Research' },
      create: { name: 'Research' }
    }),
    prisma.sector.upsert({
      where: { id: 2 },
      update: { name: 'Government' },
      create: { name: 'Government' }
    }),
    prisma.sector.upsert({
      where: { id: 3 },
      update: { name: 'Private Sector' },
      create: { name: 'Private Sector' }
    }),
    prisma.sector.upsert({
      where: { id: 4 },
      update: { name: 'NGO' },
      create: { name: 'NGO' }
    }),
    prisma.sector.upsert({
      where: { id: 5 },
      update: { name: 'Education' },
      create: { name: 'Education' }
    })
  ]);

  // Create terms
  const terms = await prisma.terms.upsert({
    where: { id: 1 },
    update: {
      description: 'I agree to the terms and conditions of the Climateurope2 platform.'
    },
    create: {
      description: 'I agree to the terms and conditions of the Climateurope2 platform.'
    }
  });

  console.log({
    activityTypes,
    sectors,
    terms
  });
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });