import { NextRequest, NextResponse } from 'next/server';
import { query } from '@/lib/db';
import { verifyToken } from '@/lib/auth';
import { saveFile } from '@/lib/upload';

export async function POST(request: NextRequest) {
  try {
    const token = request.headers.get('authorization')?.replace('Bearer ', '');
    
    if (!token) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const decoded = verifyToken(token);
    if (!decoded) {
      return NextResponse.json({ error: 'Invalid token' }, { status: 401 });
    }

    const formData = await request.formData();
    const file = formData.get('file') as File;

    if (!file) {
      return NextResponse.json(
        { error: 'No file provided' },
        { status: 400 }
      );
    }

    // Save file
    const { filename, filepath } = await saveFile(file, decoded.userId);

    // Save to database
    const result = await query(
      `INSERT INTO uploaded_files 
       (user_id, filename, original_name, file_path, file_size, mime_type) 
       VALUES ($1, $2, $3, $4, $5, $6) 
       RETURNING *`,
      [
        decoded.userId,
        filename,
        file.name,
        filepath,
        file.size,
        file.type,
      ]
    );

    return NextResponse.json({
      message: 'File uploaded successfully',
      file: result.rows[0],
    });
  } catch (error: any) {
    console.error('Upload error:', error);
    return NextResponse.json(
      { error: error.message || 'Internal server error' },
      { status: 500 }
    );
  }
}
