// /pages/api/admin/magazines/index.js
import { db } from '@/db/db';
import { magazines } from '@/db/schema';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/pages/api/auth/[...nextauth]';

export default async function handler(req, res) {
  const session = await getServerSession(req, res, authOptions);
  if (!session) {
    return res.status(401).json({ error: 'Unauthorized' });
  }

  if (req.method === 'GET') {
    try {
      const results = await db.select().from(magazines);
      return res.status(200).json(results);
    } catch (error) {
      return res.status(500).json({ error: 'Failed to fetch magazines' });
    }
  }

  if (req.method === 'POST') {
    try {
      const { name, year, description, pdfUrl, thumbnailUrl, in_carousal } = req.body;

      const [magazine] = await db.insert(magazines)
        .values({
          name,
          year,
          description,
          pdfUrl,
          thumbnailUrl,
          in_carousal
        })
        .returning();

      return res.status(201).json(magazine);
    } catch (error) {
      return res.status(500).json({ error: 'Failed to create magazine' });
    }
  }
}