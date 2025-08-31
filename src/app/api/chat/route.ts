import { NextRequest, NextResponse } from 'next/server';
import { getCharacterResponse } from '@/lib/claude';

export async function POST(request: NextRequest) {
  try {
    const { characterId, message, conversationHistory } = await request.json();

    if (!characterId || !message) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    const response = await getCharacterResponse(
      characterId,
      message,
      conversationHistory || []
    );

    return NextResponse.json({ response });
  } catch (error) {
    console.error('Chat API Error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
