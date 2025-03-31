// filepath: /D:/Projects/tce-csea/src/pages/api/gallery.js
import { getCarouselGalleryImages } from '@/db/queries/gallery';

export default async function handler(req, res) {
  try {
    const galleryImages = await getCarouselGalleryImages();
    res.status(200).json(galleryImages);
  } catch (error) {
    console.error('Error fetching gallery images:', error);
    res.status(500).json({ error: 'Failed to fetch gallery images' });
  }
}