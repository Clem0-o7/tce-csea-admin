// pages/api/admin/events/carousel.js
import { getSession } from 'next-auth/react';
import { getCarouselEvents } from '@/db/queries/events';

export default async function handler(req, res) {
  const session = await getSession({ req });
  if (!session) {
    return res.status(401).json({ error: 'Unauthorized' });
  }

  if (req.method !== 'GET') {
    res.setHeader('Allow', ['GET']);
    return res.status(405).json({ error: `Method ${req.method} Not Allowed` });
  }

  try {
    const carouselEvents = await getCarouselEvents();
    return res.status(200).json(carouselEvents);
  } catch (error) {
    return res.status(500).json({ error: 'Failed to fetch carousel events' });
  }
}

