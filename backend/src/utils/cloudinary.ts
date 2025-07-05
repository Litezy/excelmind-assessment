import { v2 as cloudinary } from 'cloudinary';
import dotenv from 'dotenv';

dotenv.config(); // Load .env

// Cloudinary configuration
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

export { cloudinary };


export const getCloudinaryPublicId = (url: string): string | null => {
  try {
    const path = new URL(url).pathname; // e.g. /raw/upload/v1751540337/academic-crm/1751540337946-example.docx
    const parts = path.split('/');
    const fileWithExt = parts.pop()!; // 1751540337946-example.docx
    const [filenameWithoutExt] = fileWithExt.split('.');
    const folderPath = parts.slice(4).join('/'); // academic-crm
    return `${folderPath}/${filenameWithoutExt}`;
  } catch (err) {
    console.error('Failed to extract Cloudinary public_id:', err);
    return null;
  }
};