// pages/api/admin/gallery/index.js
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/pages/api/auth/[...nextauth]";
import { getAllGalleryImages, createGalleryImage } from '@/db/queries/gallery';

export default async function handler(req, res) {
  // Use getServerSession instead of getSession
  const session = await getServerSession(req, res, authOptions);
  
  if (!session || !session.user) {
    return res.status(401).json({ error: 'Unauthorized' });
  }

  switch (req.method) {
    case 'GET':
      try {
        const images = await getAllGalleryImages();
        return res.status(200).json(images);
      } catch (error) {
        console.error('Gallery GET error:', error);
        return res.status(500).json({ error: 'Failed to fetch gallery images' });
      }

    case 'POST':
      try {
        // Validate required fields
        const { imageUrl, academicYear } = req.body;
        if (!imageUrl || !academicYear) {
          return res.status(400).json({ 
            error: 'Missing required fields: imageUrl and academicYear are required' 
          });
        }

        const imageData = {
          ...req.body,
          uploadedAt: new Date(),
          createdAt: new Date(),
          updatedAt: new Date(),
          // Ensure tags is an array even if empty
          tags: Array.isArray(req.body.tags) ? req.body.tags : [],
          // Ensure boolean fields are actually booleans
          in_carousal: Boolean(req.body.in_carousal)
        };

        const image = await createGalleryImage(imageData);
        return res.status(201).json(image);
      } catch (error) {
        console.error('Gallery POST error:', error);
        return res.status(500).json({ 
          error: 'Failed to add image to gallery',
          details: error.message 
        });
      }

    default:
      res.setHeader('Allow', ['GET', 'POST']);
      return res.status(405).json({ error: `Method ${req.method} Not Allowed` });
  }
}