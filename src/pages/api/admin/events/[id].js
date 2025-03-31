// filepath: /d:/Projects/tce-csea/src/pages/api/admin/events/[id].js
import { withEventValidation } from '@/middleware/with-validation';
import { db } from '@/db/db';
import { events } from '@/db/schema';
import { eq } from 'drizzle-orm';


const handler = async (req, res) => {
  const { id } = req.query;

  if (req.method === 'GET') {
    try {
      const event = await db.select().from(events).where(eq(events.id, id)).first();
      if (event) {
        res.status(200).json(event);
      } else {
        res.status(404).json({ error: 'Event not found' });
      }
    } catch (error) {
      console.error('Error fetching event:', error);
      res.status(500).json({ error: 'Error fetching event' });
    }
  } 
  else if (req.method === 'PUT') {
    try {
      console.log("Updating event with data:", req.body);
  
      const updatedEvent = {
        ...req.body,
        date: req.body.date ? new Date(req.body.date) : null, // Convert if exists
        createdAt: req.body.createdAt ? new Date(req.body.createdAt) : null,
        updatedAt: new Date(), // Always set to current Date
      };
  
      await db.update(events).set(updatedEvent).where(eq(events.id, id));
      res.status(200).json({ message: 'Event updated successfully' });
    } catch (error) {
      console.error('Error updating event:', error);
      res.status(500).json({ error: 'Error updating event' });
    }
  }
  
  
  
   else if (req.method === 'DELETE') {
    try {
      

await db.delete(events).where(eq(events.id, id));
      res.status(200).json({ message: 'Event deleted successfully' });
    } catch (error) {
      console.error('Error deleting event:', error);
      res.status(500).json({ error: 'Error deleting event' });
    }
  } else {
    res.setHeader('Allow', ['GET', 'PUT', 'DELETE']);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
};

export default withEventValidation(handler);