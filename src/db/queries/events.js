// src/db/queries/events.js
import { db } from '../db';
import { events } from '../schema';
import { eq, and } from 'drizzle-orm';

// Fetch events marked for carousel
export async function getCarouselEvents() {
  try {
    const carouselEvents = await db
      .select({
        id: events.id,
        name: events.name,
        description: events.description,
        date: events.date,
        status: events.status,
        registrationLink: events.registrationLink,
        eventImage: events.eventImage,
        conductedBy: events.conductedBy,
        participantsCount: events.participantsCount,
        teamSizeMin: events.teamSizeMin,
        teamSizeMax: events.teamSizeMax
      })
      .from(events)
      .where(eq(events.in_carousal, true))
      .orderBy(events.date);

    return carouselEvents;
  } catch (error) {
    console.error('Error fetching carousel events:', error);
    return [];
  }
}

// Fetch upcoming events
export async function getUpcomingEvents() {
  try {
    const upcomingEvents = await db
      .select({
        id: events.id,
        name: events.name,
        description: events.description,
        date: events.date,
        registrationLink: events.registrationLink
      })
      .from(events)
      .where(eq(events.status, 'upcoming'))
      .orderBy(events.date);

    return upcomingEvents;
  } catch (error) {
    console.error('Error fetching upcoming events:', error);
    return [];
  }
}

export async function getAllEvents() {
  try {
    return await db.select().from(events).orderBy(events.date);
  } catch (error) {
    console.error('Error fetching all events:', error);
    return [];
  }
}

export async function getEventById(id) {
  try {
    const event = await db
      .select()
      .from(events)
      .where(eq(events.id, id))
      .limit(1);

    return event.length ? event[0] : null;
  } catch (error) {
    console.error('Error fetching event by ID:', error);
    return null;
  }
}

export async function createEvent(eventData) {
  try {
    return await db.insert(events).values({
      ...eventData,
      updatedAt: new Date(),
    });
  } catch (error) {
    console.error('Error creating event:', error);
    return null;
  }
}

export async function addEvent(eventData) {
  try {
    return await db.insert(events).values(eventData).returning();
  } catch (error) {
    console.error('Error adding event:', error);
    return null;
  }
}

export async function updateEvent(id, eventData) {
  try {
    return await db.update(events)
      .set({
        ...eventData,
        updatedAt: new Date(),
      })
      .where(eq(events.id, id))
      .returning();
  } catch (error) {
    console.error('Error updating event:', error);
    return null;
  }
}

export async function deleteEvent(id) {
  try {
    return await db.delete(events)
      .where(eq(events.id, id))
      .returning();
  } catch (error) {
    console.error('Error deleting event:', error);
    return null;
  }
}
