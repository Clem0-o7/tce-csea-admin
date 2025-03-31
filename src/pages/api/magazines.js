// filepath: /D:/Projects/tce-csea/src/pages/api/magazines.js
import { getMagazines } from '@/db/queries/magazines';

export default async function handler(req, res) {
  try {
    const magazines = await getMagazines();
    res.status(200).json(magazines);
  } catch (error) {
    console.error('Error fetching magazines:', error);
    res.status(500).json({ error: 'Failed to fetch magazines' });
  }
}