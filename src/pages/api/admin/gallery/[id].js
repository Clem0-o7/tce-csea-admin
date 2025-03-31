// pages/api/admin/gallery/[id].js
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/pages/api/auth/[...nextauth]";
import { 
  updateGalleryImage, 
  deleteGalleryImage, 
  getGalleryImageById 
} from '@/db/queries/gallery';

export default async function handler(req, res) {
  const session = await getServerSession(req, res, authOptions);
  
  if (!session || !session.user) {
    return res.status(401).json({ error: 'Unauthorized' });
  }

  const { id } = req.query;
  if (!id) {
    return res.status(400).json({ error: 'Missing image ID' });
  }

  switch (req.method) {
    case 'GET':
      try {
        const image = await getGalleryImageById(id);
        if (!image) {
          return res.status(404).json({ error: 'Image not found' });
        }
        return res.status(200).json(image);
      } catch (error) {
        console.error('Gallery GET by ID error:', error);
        return res.status(500).json({ error: 'Failed to fetch image' });
      }

    case 'PUT':
      try {
        const { imageUrl, academicYear } = req.body;
        if (!imageUrl || !academicYear) {
          return res.status(400).json({ 
            error: 'Missing required fields: imageUrl and academicYear are required' 
          });
        }

        const imageData = {
          ...req.body,
          updatedAt: new Date(),
          tags: Array.isArray(req.body.tags) ? req.body.tags : [],
          in_carousal: Boolean(req.body.in_carousal)
        };

        const updatedImage = await updateGalleryImage(id, imageData);
        if (!updatedImage) {
          return res.status(404).json({ error: 'Image not found' });
        }
        return res.status(200).json(updatedImage);
      } catch (error) {
        console.error('Gallery PUT error:', error);
        return res.status(500).json({ 
          error: 'Failed to update image',
          details: error.message 
        });
      }

    case 'DELETE':
      try {
        const deletedImage = await deleteGalleryImage(id);
        if (!deletedImage) {
          return res.status(404).json({ error: 'Image not found' });
        }
        return res.status(200).json({ message: 'Image deleted successfully' });
      } catch (error) {
        console.error('Gallery DELETE error:', error);
        return res.status(500).json({ 
          error: 'Failed to delete image',
          details: error.message 
        });
      }

    default:
      res.setHeader('Allow', ['GET', 'PUT', 'DELETE']);
      return res.status(405).json({ error: `Method ${req.method} Not Allowed` });
  }
}