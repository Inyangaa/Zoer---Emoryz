import { NextRequest, NextResponse } from 'next/server';
import { query } from '@/lib/db';
import { verifyToken } from '@/lib/auth';
import { generateImage } from '@/lib/openai';

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

    const { entryId, prompt } = await request.json();

    if (!entryId || !prompt) {
      return NextResponse.json(
        { error: 'Entry ID and prompt are required' },
        { status: 400 }
      );
    }

    // Verify entry belongs to user
    const entryResult = await query(
      'SELECT id FROM journal_entries WHERE id = $1 AND user_id = $2',
      [entryId, decoded.userId]
    );

    if (entryResult.rows.length === 0) {
      return NextResponse.json(
        { error: 'Journal entry not found' },
        { status: 404 }
      );
    }

    // Generate image using AI
    const imageUrl = await generateImage(prompt);

    // Update journal entry with image URL
    await query(
      'UPDATE journal_entries SET image_url = $1 WHERE id = $2',
      [imageUrl, entryId]
    );

    return NextResponse.json({
      message: 'Image generated successfully',
      imageUrl,
    });
  } catch (error: any) {
    console.error('Generate image error:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to generate image' },
      { status: 500 }
    );
  }
}
