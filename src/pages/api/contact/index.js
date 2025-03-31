// /pages/api/contact/index.js
import { db } from '@/db/db';
import { contactSubmissions } from '@/db/schema';

export default async function handler(req, res) {
  if (req.method === 'POST') {
    try {
      const { name, email, subject, message } = req.body;

      const [submission] = await db.insert(contactSubmissions)
        .values({
          name,
          email,
          subject,
          message,
          status: 'unread'
        })
        .returning();

      return res.status(201).json(submission);
    } catch (error) {
      return res.status(500).json({ error: 'Failed to submit message' });
    }
  }
}