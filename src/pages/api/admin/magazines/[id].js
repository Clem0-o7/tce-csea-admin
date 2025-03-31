// /pages/api/admin/magazines/[id].js
import { db } from '@/db/db';
import { magazines } from '@/db/schema';
import { eq } from 'drizzle-orm';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/pages/api/auth/[...nextauth]';

export default async function handler(req, res) {
  const session = await getServerSession(req, res, authOptions);
  if (!session) {
    return res.status(401).json({ error: 'Unauthorized' });
  }

  const { id } = req.query;

  if (req.method === 'PUT') {
    try {
      const { name, year, description, pdfUrl, thumbnailUrl, in_carousal } = req.body;

      const [magazine] = await db.update(magazines)
        .set({
          name,
          year,
          description,
          pdfUrl,
          thumbnailUrl,
          in_carousal,
          updatedAt: new Date()
        })
        .where(eq(magazines.id, id))
        .returning();

      return res.status(200).json(magazine);
    } catch (error) {
      return res.status(500).json({ error: 'Failed to update magazine' });
    }
  }

  if (req.method === 'DELETE') {
    try {
      await db.delete(magazines)
        .where(eq(magazines.id, id));

      return res.status(204).end();
    } catch (error) {
      return res.status(500).json({ error: 'Failed to delete magazine' });
    }
  }
}