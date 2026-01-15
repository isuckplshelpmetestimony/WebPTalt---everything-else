import { NextRequest, NextResponse } from 'next/server';

// Python transcription server URL (default: localhost:8000)
const TRANSCRIBE_SERVER_URL = process.env.TRANSCRIBE_SERVER_URL || 'http://127.0.0.1:8000';

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    const audioFile = formData.get('audio') as File;

    if (!audioFile) {
      return NextResponse.json(
        { error: 'No audio file provided' },
        { status: 400 }
      );
    }

    // Validate file size (max 50MB)
    if (audioFile.size > 50 * 1024 * 1024) {
      return NextResponse.json(
        { error: 'Audio file too large. Maximum size is 50MB.' },
        { status: 400 }
      );
    }

    // Get Whisper model from environment (default: medium)
    const whisperModel = process.env.WHISPER_MODEL || 'medium';

    // Create FormData for Python server
    const serverFormData = new FormData();
    serverFormData.append('audio', audioFile);

    // Call Python transcription server
    const serverUrl = `${TRANSCRIBE_SERVER_URL}/transcribe?model=${encodeURIComponent(whisperModel)}`;
    
    try {
      const response = await fetch(serverUrl, {
        method: 'POST',
        body: serverFormData,
        // Note: Don't set Content-Type header - let fetch set it with boundary for FormData
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({ error: 'Unknown error' }));
        console.error('Transcription server error:', errorData);
        return NextResponse.json(
          { error: errorData.error || `Transcription server returned ${response.status}` },
          { status: response.status >= 500 ? 502 : response.status }
        );
      }

      const data = await response.json();
      const transcript = data.transcript;

      if (!transcript || typeof transcript !== 'string') {
        return NextResponse.json(
          { error: 'Transcription returned invalid result' },
          { status: 500 }
        );
      }

      return NextResponse.json({ transcript });
    } catch (fetchError: any) {
      console.error('Error calling transcription server:', fetchError);
      
      // Check if it's a connection error (server not running)
      if (fetchError.code === 'ECONNREFUSED' || fetchError.message?.includes('fetch failed')) {
        return NextResponse.json(
          { 
            error: 'Transcription server is not running. Please start it with: bash scripts/start-transcribe-server.sh' 
          },
          { status: 503 }
        );
      }

      return NextResponse.json(
        { error: `Failed to connect to transcription server: ${fetchError.message || 'Unknown error'}` },
        { status: 502 }
      );
    }
  } catch (error: any) {
    console.error('API error:', error);
    return NextResponse.json(
      { error: error.message || 'Internal server error' },
      { status: 500 }
    );
  }
}

