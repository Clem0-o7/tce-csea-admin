import { withEventValidation } from '@/middleware/with-validation';
import { db } from '@/db/db';
import { events } from '@/db/schema';

const handler = async (req, res) => {
  if (req.method === 'GET') {
    try {
      const allEvents = await db.select().from(events);
      res.status(200).json(allEvents);
    } catch (error) {
      console.error('Error fetching events:', error);
      res.status(500).json({ error: 'Error fetching events' });
    }
  } else if (req.method === 'POST') {
    try {
      const newEvent = req.body;
      await db.insert(events).values(newEvent);
      res.status(201).json({ message: 'Event created successfully' });
    } catch (error) {
      console.error('Error creating event:', error);
      res.status(500).json({ error: 'Error creating event' });
    }
  } else {
    res.setHeader('Allow', ['GET', 'POST']);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
};

export default withEventValidation(handler);