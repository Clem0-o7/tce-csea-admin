// @/db/queries/officeBearers.js
import { db } from '@/db/db';
import { officeBearers, persons } from '@/db/schema';
import { eq } from 'drizzle-orm';

export async function getCurrentOfficeBearers() {
  try {
    const currentBearers = await db
      .select({
        id: officeBearers.id,
        position: officeBearers.position,
        startYear: officeBearers.startYear,
        endYear: officeBearers.endYear,
        personId: officeBearers.personId,
        name: persons.name,
        department: persons.department,
        batch: persons.batch,
        profileImage: persons.profileImage,
        socialLinks: persons.socialLinks,
      })
      .from(officeBearers)
      .innerJoin(persons, eq(officeBearers.personId, persons.id))
      .where(eq(officeBearers.isCurrent, true))
      .orderBy(officeBearers.position);

    return currentBearers;
  } catch (error) {
    console.error('Error fetching current office bearers:', error);
    return [];
  }
}