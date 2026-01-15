#!/bin/bash
# Startup script for Ollama Extraction Server
# Run this before starting the Next.js development server (along with transcription server)

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

# Check if requests is installed
if ! "$PYTHON_CMD" -c "import requests" &> /dev/null; then
    echo "Error: requests is not installed"
    echo "Please install it with: $PYTHON_CMD -m pip install requests"
    exit 1
fi

# Check if Ollama is running
if ! curl -s http://127.0.0.1:11434/api/tags &> /dev/null; then
    echo "Warning: Ollama doesn't seem to be running on http://127.0.0.1:11434"
    echo "Please start Ollama with: ollama serve"
    echo "Or make sure Ollama is running and accessible"
    exit 1
fi

# Get port from environment or default to 8001
PORT="${EXTRACT_SERVER_PORT:-8001}"

echo "Starting Ollama Extraction Server..."
echo "Server will run on http://127.0.0.1:$PORT"
echo "Press Ctrl+C to stop the server"
echo ""

# Run the Python server
exec "$PYTHON_CMD" "$SCRIPT_DIR/extract_server.py"

