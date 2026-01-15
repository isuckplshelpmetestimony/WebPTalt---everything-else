import { NextRequest, NextResponse } from 'next/server';

// Local Ollama extraction server URL (default: localhost:8001)
const EXTRACT_SERVER_URL = process.env.EXTRACT_SERVER_URL || 'http://127.0.0.1:8001';

export async function POST(request: NextRequest) {
  try {
    const { transcript } = await request.json();
    const sectionId = request.nextUrl.searchParams.get('sectionId');

    if (!transcript || typeof transcript !== 'string') {
      return NextResponse.json(
        { error: 'Transcript is required' },
        { status: 400 }
      );
    }

    if (!sectionId) {
      return NextResponse.json(
        { error: 'Section ID is required' },
        { status: 400 }
      );
    }

    // Get model from query parameter or environment (default: llama3.2)
    const model = request.nextUrl.searchParams.get('model') || process.env.OLLAMA_MODEL || 'llama3.2';

    // Call local Ollama extraction server with section ID
    const serverUrl = `${EXTRACT_SERVER_URL}/extract-section?model=${encodeURIComponent(model)}&sectionId=${encodeURIComponent(sectionId)}`;
    
    try {
      const response = await fetch(serverUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ transcript }),
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({ 
          error: response.status === 404 
            ? 'Extraction server endpoint not found. Please restart the extraction server to load the new /extract-section endpoint.'
            : `Extraction server returned ${response.status}` 
        }));
        console.error('Extraction server error:', errorData);
        return NextResponse.json(
          { error: errorData.error || `Extraction server returned ${response.status}` },
          { status: response.status >= 500 ? 502 : response.status }
        );
      }

      const data = await response.json();
      const extractedData = data.extractedData;

      if (!extractedData || typeof extractedData !== 'object') {
        return NextResponse.json(
          { error: 'Invalid response from extraction server' },
          { status: 500 }
        );
      }

      return NextResponse.json({ extractedData });
    } catch (fetchError: any) {
      console.error('Error calling extraction server:', fetchError);
      
      // Check if it's a connection error (server not running)
      if (fetchError.code === 'ECONNREFUSED' || fetchError.message?.includes('fetch failed')) {
        return NextResponse.json(
          { 
            error: 'Extraction server is not running. Please start it with: bash scripts/start-extract-server.sh' 
          },
          { status: 503 }
        );
      }

      return NextResponse.json(
        { error: `Failed to connect to extraction server: ${fetchError.message || 'Unknown error'}` },
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

