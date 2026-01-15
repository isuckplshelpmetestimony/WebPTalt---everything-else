#!/bin/bash
# Wrapper script to ensure PyTorch loads correctly when called from Node.js
# This script sets up the environment and then calls the Python transcription script

# Get the script directory
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"

# Get arguments
AUDIO_FILE="$1"
MODEL="${2:-medium}"

# Use the Python executable from the environment
PYTHON_CMD="${PYTHON_PATH:-python3}"

# Export environment variables for PyTorch
export PYTHONUNBUFFERED=1
export PYTORCH_ENABLE_MPS_FALLBACK=1
export OMP_NUM_THREADS=1
export MKL_NUM_THREADS=1

# Run the Python script
exec "$PYTHON_CMD" "$SCRIPT_DIR/transcribe_audio.py" "$AUDIO_FILE" --model "$MODEL"



