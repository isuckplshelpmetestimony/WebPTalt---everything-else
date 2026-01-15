#!/usr/bin/env python3
"""
Whisper Transcription HTTP Server
Simple Flask server that provides transcription via HTTP API.
Run this server before starting the Next.js application.
"""

import os
import sys
import traceback
from flask import Flask, request, jsonify
from werkzeug.utils import secure_filename
import whisper

app = Flask(__name__)

# Global variable to store the loaded model
whisper_model = None
current_model_name = None

# Store last transcript for debugging
last_transcript = None

def load_whisper_model(model_name: str = "medium"):
    """Load Whisper model (or reload if model name changed)."""
    global whisper_model, current_model_name
    
    if whisper_model is None or current_model_name != model_name:
        print(f"Loading Whisper model: {model_name}...", file=sys.stderr, flush=True)
        try:
            whisper_model = whisper.load_model(model_name)
            current_model_name = model_name
            print(f"Whisper model '{model_name}' loaded successfully", file=sys.stderr, flush=True)
        except Exception as e:
            print(f"Error loading Whisper model: {str(e)}", file=sys.stderr, flush=True)
            raise
    return whisper_model

@app.route('/health', methods=['GET'])
def health():
    """Health check endpoint."""
    return jsonify({"status": "ok", "model": current_model_name or "not loaded"})

@app.route('/debug/last-transcript', methods=['GET'])
def last_transcript_debug():
    """Debug endpoint to get the last transcript."""
    global last_transcript
    if last_transcript:
        return jsonify({
            "transcript": last_transcript,
            "length": len(last_transcript)
        })
    return jsonify({"error": "No transcript available yet"}), 404

@app.route('/transcribe', methods=['POST'])
def transcribe():
    """Transcribe audio file endpoint."""
    try:
        # Check if audio file is in request
        if 'audio' not in request.files:
            return jsonify({"error": "No audio file provided"}), 400
        
        audio_file = request.files['audio']
        
        if audio_file.filename == '':
            return jsonify({"error": "No audio file selected"}), 400
        
        # Get model name from query parameter or environment (default: medium)
        model_name = request.args.get('model', os.getenv('WHISPER_MODEL', 'medium'))
        
        # Load model (cached after first load)
        try:
            model = load_whisper_model(model_name)
        except Exception as e:
            return jsonify({"error": f"Failed to load Whisper model: {str(e)}"}), 500
        
        # Save uploaded file temporarily
        import tempfile
        temp_dir = tempfile.gettempdir()
        temp_filename = secure_filename(audio_file.filename) or 'audio.webm'
        temp_path = os.path.join(temp_dir, temp_filename)
        
        try:
            audio_file.save(temp_path)
            
            # Validate file exists and is not empty
            if not os.path.exists(temp_path):
                return jsonify({"error": "Failed to save audio file"}), 500
            
            file_size = os.path.getsize(temp_path)
            if file_size == 0:
                return jsonify({"error": "Audio file is empty"}), 400
            
            # Transcribe audio
            print(f"Transcribing audio file: {temp_path} (size: {file_size} bytes)...", file=sys.stderr, flush=True)
            result = model.transcribe(temp_path)
            
            # Extract transcript
            transcript = result.get("text", "").strip()
            
            if not transcript:
                print("Warning: Transcription returned empty text", file=sys.stderr, flush=True)
            
            # Store transcript for debugging
            global last_transcript
            last_transcript = transcript
            
            print(f"\n{'='*80}", file=sys.stderr, flush=True)
            print(f"TRANSCRIPTION COMPLETE ({len(transcript)} characters):", file=sys.stderr, flush=True)
            print(f"{'='*80}", file=sys.stderr, flush=True)
            print(transcript, file=sys.stderr, flush=True)
            print(f"{'='*80}\n", file=sys.stderr, flush=True)
            
            return jsonify({"transcript": transcript})
            
        finally:
            # Clean up temporary file
            try:
                if os.path.exists(temp_path):
                    os.remove(temp_path)
            except Exception as e:
                print(f"Warning: Failed to delete temp file: {str(e)}", file=sys.stderr, flush=True)
    
    except Exception as e:
        error_msg = f"Transcription error: {str(e)}"
        print(error_msg, file=sys.stderr, flush=True)
        print(traceback.format_exc(), file=sys.stderr, flush=True)
        return jsonify({"error": error_msg}), 500

if __name__ == '__main__':
    # Get port from environment or default to 8000
    port = int(os.getenv('TRANSCRIBE_SERVER_PORT', 8000))
    
    print(f"Starting Whisper Transcription Server on port {port}...", file=sys.stderr, flush=True)
    print("Press Ctrl+C to stop the server", file=sys.stderr, flush=True)
    
    # Run Flask app
    app.run(host='127.0.0.1', port=port, debug=False)

