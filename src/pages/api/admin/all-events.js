// filepath: /d:/Projects/tce-csea/src/pages/api/admin/all-events.js
import { db } from '@/db/db';
import { events } from '@/db/schema';

export default async function handler(req, res) {
  if (req.method !== 'GET') {
    res.setHeader('Allow', ['GET']);
    return res.status(405).end(`Method ${req.method} Not Allowed`);
  }

  try {
    const allEvents = await db.select().from(events);
    res.status(200).json({ events: allEvents });
  } catch (error) {
    console.error('Error fetching events:', error);
    res.status(500).json({ error: 'Failed to fetch events' });
  }
}