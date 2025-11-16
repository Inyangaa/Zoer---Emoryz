import { NextRequest, NextResponse } from 'next/server';
import { query } from '@/lib/db';
import { verifyToken } from '@/lib/auth';
import { analyzeEmotion } from '@/lib/openai';

export async function GET(request: NextRequest) {
  try {
    const token = request.headers.get('authorization')?.replace('Bearer ', '');
    
    if (!token) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const decoded = verifyToken(token);
    if (!decoded) {
      return NextResponse.json({ error: 'Invalid token' }, { status: 401 });
    }

    const result = await query(
      'SELECT * FROM journal_entries WHERE user_id = $1 ORDER BY created_at DESC',
      [decoded.userId]
    );

    return NextResponse.json({ entries: result.rows });
  } catch (error: any) {
    console.error('Get journal entries error:', error);
    return NextResponse.json(
      { error: error.message || 'Internal server error' },
      { status: 500 }
    );
  }
}

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

    const { title, content } = await request.json();

    if (!title || !content) {
      return NextResponse.json(
        { error: 'Title and content are required' },
        { status: 400 }
      );
    }

    // Analyze emotion using AI
    const emotionData = await analyzeEmotion(content);

    // Save journal entry
    const result = await query(
      `INSERT INTO journal_entries 
       (user_id, title, content, emotion, emotion_score, ai_analysis) 
       VALUES ($1, $2, $3, $4, $5, $6) 
       RETURNING *`,
      [
        decoded.userId,
        title,
        content,
        emotionData.emotion,
        emotionData.score,
        emotionData.analysis,
      ]
    );

    return NextResponse.json({
      message: 'Journal entry created successfully',
      entry: result.rows[0],
    });
  } catch (error: any) {
    console.error('Create journal entry error:', error);
    return NextResponse.json(
      { error: error.message || 'Internal server error' },
      { status: 500 }
    );
  }
}
