import { db } from '@/db/db';
import { events, galleryImages, officeBearers, contactSubmissions, magazines } from '@/db/schema';
import { eq, sql } from 'drizzle-orm';

export default async function handler(req, res) {
  if (req.method !== 'GET') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  try {
    const [
      eventsCount,
      galleryCount,
      officeBearersCount,
      unreadMessagesCount,
      magazinesCount
    ] = await Promise.all([
      db.select({ count: sql`count(*)` }).from(events).then(rows => rows[0].count),
      db.select({ count: sql`count(*)` }).from(galleryImages).then(rows => rows[0].count),
      db.select({ count: sql`count(*)` }).from(officeBearers).then(rows => rows[0].count),
      db.select({ count: sql`count(*)` }).from(contactSubmissions).where(eq(contactSubmissions.status, 'unread')).then(rows => rows[0].count),
      db.select({ count: sql`count(*)` }).from(magazines).then(rows => rows[0].count)
    ]);

    res.status(200).json({
      events: eventsCount,
      gallery: galleryCount,
      officeBearers: officeBearersCount,
      messages: unreadMessagesCount,
      magazines: magazinesCount
    });
  } catch (error) {
    console.error('Error fetching dashboard stats:', error);
    res.status(500).json({ message: 'Error fetching dashboard stats' });
  }
}