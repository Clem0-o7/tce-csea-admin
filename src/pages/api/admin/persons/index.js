//src/pages/api/admin/persons/index.js:

import { db } from '@/db/db';
import { persons } from '@/db/schema';
import { desc, eq } from 'drizzle-orm';

export default async function handler(req, res) {
  if (req.method === 'GET') {
    try {
      const allPersons = await db
        .select()
        .from(persons)
        .orderBy(persons.name);
      
      return res.status(200).json({ persons: allPersons });
    } catch (error) {
      console.error('Error fetching persons:', error);
      return res.status(500).json({ error: 'Failed to fetch persons' });
    }
  }

  if (req.method === 'POST') {
    try {
      const { name, registerNumber, email, department } = req.body;

      // Validate required fields
      if (!name || !registerNumber) {
        return res.status(400).json({ 
          error: 'Name and register number are required' 
        });
      }

      // Check for existing person with same register number
      const existing = await db
        .select()
        .from(persons)
        .where(eq(persons.registerNumber, registerNumber))
        .limit(1);

      if (existing.length > 0) {
        return res.status(409).json({ 
          error: 'Person with this register number already exists' 
        });
      }

      // Create new person
      const [newPerson] = await db
        .insert(persons)
        .values({
          name,
          registerNumber,
          email,
          department,
          totalEventPoints: 0, // Initialize points to 0
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString()
        })
        .returning();

      return res.status(201).json({ person: newPerson });
    } catch (error) {
      console.error('Error creating person:', error);
      return res.status(500).json({ error: 'Failed to create person' });
    }
  }

  if (req.method === 'PUT') {
    try {
      const { id, name, registerNumber, email, department } = req.body;

      if (!id || !name || !registerNumber) {
        return res.status(400).json({ 
          error: 'ID, name and register number are required' 
        });
      }

      // Check if person exists
      const existing = await db
        .select()
        .from(persons)
        .where(eq(persons.id, id));

      if (existing.length === 0) {
        return res.status(404).json({ error: 'Person not found' });
      }

      // Update person
      const [updatedPerson] = await db
        .update(persons)
        .set({
          name,
          registerNumber,
          email,
          department,
          updatedAt: new Date().toISOString()
        })
        .where(eq(persons.id, id))
        .returning();

      return res.status(200).json({ person: updatedPerson });
    } catch (error) {
      console.error('Error updating person:', error);
      return res.status(500).json({ error: 'Failed to update person' });
    }
  }

  // Method not allowed for other HTTP methods
  return res.status(405).json({ error: 'Method not allowed' });
}