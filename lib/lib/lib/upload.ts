export const saveFile = async (
  file: File,
  userId: number
): Promise<{ filename: string; filepath: string }> => {
  // Temporary: Uploads disabled on Vercel
  // TODO: Integrate Vercel Blob Storage
  throw new Error('File uploads temporarily disabled. Coming soon!');
};
