import { writeFile } from 'fs/promises';
import { join } from 'path';
import { randomBytes } from 'crypto';

export const saveFile = async (
  file: File,
  userId: number
): Promise<{ filename: string; filepath: string }> => {
  try {
    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    // Generate unique filename
    const ext = file.name.split('.').pop();
    const filename = `${userId}_${randomBytes(16).toString('hex')}.${ext}`;
    const filepath = join(process.cwd(), 'public', 'uploads', filename);

    // Save file
    await writeFile(filepath, buffer);

    return {
      filename,
      filepath: `/uploads/${filename}`,
    };
  } catch (error) {
    console.error('File save error:', error);
    throw new Error('Failed to save file');
  }
};
