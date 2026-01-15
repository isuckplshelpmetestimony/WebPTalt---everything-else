#!/bin/bash
# Startup script for Whisper Transcription Server
# Run this before starting the Next.js development server

# Get the script directory
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"

# Use Python executable from environment or default to python3
PYTHON_CMD="${PYTHON_PATH:-python3}"

# Check if Python is available
if ! command -v "$PYTHON_CMD" &> /dev/null; then
    echo "Error: Python command '$PYTHON_CMD' not found"
    exit 1
fi

# Check if Flask is installed
if ! "$PYTHON_CMD" -c "import flask" &> /dev/null; then
    echo "Error: Flask is not installed"
    echo "Please install it with: $PYTHON_CMD -m pip install flask"
    exit 1
fi

# Check if Whisper is installed
if ! "$PYTHON_CMD" -c "import whisper" &> /dev/null; then
    echo "Error: Whisper is not installed"
    echo "Please install it with: $PYTHON_CMD -m pip install openai-whisper"
    exit 1
fi

# Get port from environment or default to 8000
PORT="${TRANSCRIBE_SERVER_PORT:-8000}"

echo "Starting Whisper Transcription Server..."
echo "Server will run on http://127.0.0.1:$PORT"
echo "Press Ctrl+C to stop the server"
echo ""

# Run the Python server
exec "$PYTHON_CMD" "$SCRIPT_DIR/transcribe_server.py"

