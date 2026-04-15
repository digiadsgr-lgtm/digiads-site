import fs from 'fs';
import path from 'path';
import sharp from 'sharp';

const dir = path.join(process.cwd(), 'public/logo');
const files = fs.readdirSync(dir);

files.forEach(file => {
  if (file.endsWith('.png') || file.endsWith('.jpg')) {
    const filePath = path.join(dir, file);
    const newFilePath = path.join(dir, file.replace(/\.(png|jpg)$/, '.webp'));
    
    sharp(filePath)
      .webp({ quality: 80 })
      .toFile(newFilePath)
      .then(() => console.log(`Converted ${file} to WebP`))
      .catch(err => console.error(`Error converting ${file}:`, err));
  }
});
