// filepath: /D:/Projects/tce-csea/src/pages/api/officeBearers.js
import { getCurrentOfficeBearers } from '@/db/queries/officeBearers';

export default async function handler(req, res) {
  try {
    const officeBearers = await getCurrentOfficeBearers();
    res.status(200).json(officeBearers);
  } catch (error) {
    console.error('Error fetching office bearers:', error);
    res.status(500).json({ error: 'Failed to fetch office bearers' });
  }
}