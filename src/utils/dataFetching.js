// filepath: /d:/Projects/tce-csea/src/utils/dataFetching.js
import { formatISO } from 'date-fns';

export async function fetchData(baseUrl) {
  try {
    const [eventsRes, officeBearersRes, magazinesRes, galleryImagesRes] = await Promise.all([
      fetch(`${baseUrl}/api/events`),
      fetch(`${baseUrl}/api/officeBearers`),
      fetch(`${baseUrl}/api/magazines`),
      fetch(`${baseUrl}/api/gallery`)
    ]);

    const [eventsData, officeBearersData, magazinesData, galleryImagesData] = await Promise.all([
      eventsRes.json(),
      officeBearersRes.json(),
      magazinesRes.json(),
      galleryImagesRes.json()
    ]);

    // Convert Date objects to ISO strings
    const formattedGalleryImages = galleryImagesData.map((image) => ({
      ...image,
      uploadedAt: formatISO(new Date(image.uploadedAt)),
      createdAt: formatISO(new Date(image.createdAt)),
      updatedAt: formatISO(new Date(image.updatedAt)),
    }));

    return {
      carouselEvents: eventsData,
      officeBearers: officeBearersData,
      magazines: magazinesData,
      galleryImages: formattedGalleryImages,
    };
  } catch (error) {
    throw new Error('Failed to fetch data');
  }
}