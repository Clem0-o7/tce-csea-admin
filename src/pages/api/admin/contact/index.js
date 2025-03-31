// /pages/api/admin/contact/index.js
import { db } from '@/db/db';
import { contactSubmissions } from '@/db/schema';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/pages/api/auth/[...nextauth]';
import { desc } from 'drizzle-orm';

export default async function handler(req, res) {
  const session = await getServerSession(req, res, authOptions);
  if (!session) {
    return res.status(401).json({ error: 'Unauthorized' });
  }

  if (req.method === 'GET') {
    try {
      const messages = await db.select()
        .from(contactSubmissions)
        .orderBy(desc(contactSubmissions.submittedAt));
      
      return res.status(200).json(messages);
    } catch (error) {
      return res.status(500).json({ error: 'Failed to fetch messages' });
    }
  }
}