import prisma from '@/lib/prismadb';

export async function createActivity(data: {
  title: string;
  description?: string;
  activityTypeId: number;
  date: Date;
  duration?: number;
  location?: string;
  organizationId?: number;
}) {
  return prisma.activity.create({
    data: {
      ...data,
      updatedAt: new Date()
    },
    include: {
      activityType: true,
      organization: true
    }
  });
}

export async function updateActivity(
  id: number,
  data: {
    title?: string;
    description?: string;
    activityTypeId?: number;
    date?: Date;
    duration?: number;
    location?: string;
    organizationId?: number;
  }
) {
  return prisma.activity.update({
    where: { id },
    data: {
      ...data,
      updatedAt: new Date()
    },
    include: {
      activityType: true,
      organization: true
    }
  });
}

export async function addParticipant(
  activityId: number,
  contactId: number,
  role?: string
) {
  return prisma.activityParticipation.create({
    data: {
      activityId,
      contactId,
      role
    },
    include: {
      activity: true,
      contact: true
    }
  });
}

export async function updateParticipation(
  id: number,
  data: {
    role?: string;
    attendance?: boolean;
  }
) {
  return prisma.activityParticipation.update({
    where: { id },
    data,
    include: {
      activity: true,
      contact: true
    }
  });
}

export async function getActivityTypes() {
  return prisma.activityType.findMany({
    orderBy: { name: 'asc' }
  });
}

export async function getActivities(options?: {
  organizationId?: number;
  activityTypeId?: number;
  fromDate?: Date;
  toDate?: Date;
}) {
  const where: any = {};

  if (options?.organizationId) {
    where.organizationId = options.organizationId;
  }

  if (options?.activityTypeId) {
    where.activityTypeId = options.activityTypeId;
  }

  if (options?.fromDate || options?.toDate) {
    where.date = {};
    if (options?.fromDate) where.date.gte = options.fromDate;
    if (options?.toDate) where.date.lte = options.toDate;
  }

  return prisma.activity.findMany({
    where,
    include: {
      activityType: true,
      organization: true,
      participants: {
        include: {
          contact: true
        }
      }
    },
    orderBy: { date: 'desc' }
  });
}