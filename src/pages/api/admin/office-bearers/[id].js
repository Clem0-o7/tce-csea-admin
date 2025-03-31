// pages/api/admin/office-bearers/[id].js
import { db } from '@/db/db';
import { persons, officeBearers } from '@/db/schema';
import { eq } from 'drizzle-orm';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/pages/api/auth/[...nextauth]';

const formatDateFields = (data) => {
  return {
    ...data,
    // Extract just the year from the date strings
    startYear: data.startYear ? new Date(data.startYear).getFullYear().toString() : null,
    endYear: data.endYear ? new Date(data.endYear).getFullYear().toString() : null,
    createdAt: data.createdAt ? new Date(data.createdAt) : new Date(),
    updatedAt: new Date()
  };
};

export default async function handler(req, res) {
  const session = await getServerSession(req, res, authOptions);
  if (!session) {
    return res.status(401).json({ error: 'Unauthorized' });
  }

  const { id } = req.query;

  if (!id) {
    return res.status(400).json({ error: 'ID is required' });
  }

  if (req.method === 'PUT') {
    try {
      // First, fetch the existing record to get the personId
      const [existingBearer] = await db
        .select()
        .from(officeBearers)
        .where(eq(officeBearers.id, id));

      if (!existingBearer) {
        return res.status(404).json({ error: 'Office bearer not found' });
      }

      const {
        name, email, registerNumber, department, batch, contactNumber,
        profileImage, socialLinks, position, startYear, endYear, isCurrent,
      } = req.body;

      const formattedData = formatDateFields({
        startYear,
        endYear
      });

      // Update the office bearer details with formatted years
      const [updatedBearer] = await db.update(officeBearers)
        .set({
          position,
          startYear: formattedData.startYear,
          endYear: formattedData.endYear,
          isCurrent
        })
        .where(eq(officeBearers.id, id))
        .returning();

      // Update the person details
      const [updatedPerson] = await db.update(persons)
        .set({
          name,
          email,
          registerNumber,
          department,
          batch,
          contactNumber,
          profileImage,
          socialLinks,
          updatedAt: new Date()
        })
        .where(eq(persons.id, existingBearer.personId))
        .returning();

      // Return the complete updated record
      const updatedRecord = {
        id,
        personId: existingBearer.personId,
        ...updatedPerson,
        position: updatedBearer.position,
        startYear: updatedBearer.startYear,
        endYear: updatedBearer.endYear,
        isCurrent: updatedBearer.isCurrent
      };

      return res.status(200).json(updatedRecord);
    } catch (error) {
      console.error('Error updating office bearer:', error);
      return res.status(500).json({ error: 'Failed to update office bearer' });
    }
  }

  if (req.method === 'DELETE') {
    try {
      const [deletedBearer] = await db
        .delete(officeBearers)
        .where(eq(officeBearers.id, id))
        .returning();

      if (!deletedBearer) {
        return res.status(404).json({ error: 'Office bearer not found' });
      }

      return res.status(200).json({ message: 'Office bearer deleted successfully' });
    } catch (error) {
      console.error('Error deleting office bearer:', error);
      return res.status(500).json({ error: 'Failed to delete office bearer' });
    }
  }

  res.setHeader('Allow', ['PUT', 'DELETE']);
  res.status(405).end(`Method ${req.method} Not Allowed`);
}