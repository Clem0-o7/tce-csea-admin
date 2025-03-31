// pages/api/admin/office-bearers/index.js
import { db } from '@/db/db';
import { persons, officeBearers } from '@/db/schema';
import { eq } from 'drizzle-orm';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/pages/api/auth/[...nextauth]';

const formatDateFields = (data) => {
  return {
    ...data,
    startYear: data.startYear ? new Date(data.startYear).getFullYear() : null,
    endYear: data.endYear ? new Date(data.endYear).getFullYear() : null,
    createdAt: data.createdAt ? new Date(data.createdAt) : new Date(),
    updatedAt: new Date()
  };
};

export default async function handler(req, res) {
  const session = await getServerSession(req, res, authOptions);
  if (!session) {
    return res.status(401).json({ error: 'Unauthorized' });
  }

  if (req.method === 'GET') {
    try {
      const results = await db.select()
        .from(officeBearers)
        .leftJoin(persons, eq(officeBearers.personId, persons.id));
      
      const bearers = results.map(({ office_bearers, persons }) => ({
        id: office_bearers.id,
        personId: persons.id,
        name: persons.name,
        email: persons.email,
        registerNumber: persons.registerNumber,
        department: persons.department,
        batch: persons.batch,
        contactNumber: persons.contactNumber,
        profileImage: persons.profileImage,
        socialLinks: persons.socialLinks,
        position: office_bearers.position,
        startYear: office_bearers.startYear,
        endYear: office_bearers.endYear,
        isCurrent: office_bearers.isCurrent,
        createdAt: persons.createdAt,
        updatedAt: persons.updatedAt
      }));
      
      return res.status(200).json(bearers);
    } catch (error) {
      console.error('Error fetching office bearers:', error);
      return res.status(500).json({ error: 'Failed to fetch office bearers' });
    }
  }

  if (req.method === 'POST') {
    try {
      const {
        name, email, registerNumber, department, batch, contactNumber,
        profileImage, socialLinks, position, startYear, endYear, isCurrent
      } = req.body;

      const formattedData = formatDateFields({
        startYear,
        endYear
      });

      const [person] = await db.insert(persons)
        .values({
          name,
          email,
          registerNumber,
          department,
          batch,
          contactNumber,
          profileImage,
          socialLinks,
          createdAt: new Date(),
          updatedAt: new Date()
        })
        .onConflictDoUpdate({
          target: [persons.registerNumber],
          set: {
            ...(name && { name }),
            ...(contactNumber && { contactNumber }),
            ...(profileImage && { profileImage }),
            ...(socialLinks && { socialLinks }),
            updatedAt: new Date()
          }
        })
        
        
        .returning();

      const [bearer] = await db.insert(officeBearers)
        .values({
          personId: person.id,
          position,
          startYear: formattedData.startYear,
          endYear: formattedData.endYear,
          isCurrent
        })
        .returning();

      return res.status(201).json({ ...person, ...bearer });
    } catch (error) {
      console.error('Error creating office bearer:', error);
      return res.status(500).json({ error: 'Failed to create office bearer' });
    }
  }

  res.setHeader('Allow', ['GET', 'POST']);
  res.status(405).end(`Method ${req.method} Not Allowed`);
}