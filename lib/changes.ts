import prisma from '@/lib/prismadb';

export async function trackContactChange(
  contactId: number,
  field: string,
  oldValue: string | null,
  newValue: string | null,
  changedBy: number
) {
  return prisma.contactChange.create({
    data: {
      contactId,
      field,
      oldValue,
      newValue,
      changedBy
    }
  });
}

export async function trackOrganizationChange(
  organizationId: number,
  field: string,
  oldValue: string | null,
  newValue: string | null,
  changedBy: number
) {
  return prisma.organizationChange.create({
    data: {
      organizationId,
      field,
      oldValue,
      newValue,
      changedBy
    }
  });
}

export async function getContactChanges(contactId: number) {
  return prisma.contactChange.findMany({
    where: { contactId },
    orderBy: { createdAt: 'desc' },
    include: {
      contact: {
        select: {
          name: true
        }
      }
    }
  });
}

export async function getOrganizationChanges(organizationId: number) {
  return prisma.organizationChange.findMany({
    where: { organizationId },
    orderBy: { createdAt: 'desc' },
    include: {
      organization: {
        select: {
          fullName: true
        }
      }
    }
  });
}