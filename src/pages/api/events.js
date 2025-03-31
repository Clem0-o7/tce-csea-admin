// filepath: /D:/Projects/tce-csea/src/pages/api/events.js
import { getCarouselEvents } from '@/db/queries/events';

export default async function handler(req, res) {
  try {
    const events = await getCarouselEvents();
    res.status(200).json(events);
  } catch (error) {
    console.error('Error fetching events:', error);
    res.status(500).json({ error: 'Failed to fetch events' });
  }
}