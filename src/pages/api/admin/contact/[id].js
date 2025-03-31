// /pages/api/admin/contact/[id].js
import { db } from '@/db/db';
import { contactSubmissions } from '@/db/schema';
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
      const { status } = req.body;

      const [message] = await db.update(contactSubmissions)
        .set({ status })
        .where(eq(contactSubmissions.id, id))
        .returning();

      return res.status(200).json(message);
    } catch (error) {
      return res.status(500).json({ error: 'Failed to update message' });
    }
  }
}