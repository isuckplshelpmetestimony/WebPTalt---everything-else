#!/usr/bin/env python3
"""
Whisper Audio Transcription Script
Takes an audio file path as command-line argument and transcribes it using Whisper.
Returns transcript text to stdout.
"""

import sys
import os
import argparse

# Import whisper at module level for better error handling
try:
    import whisper
except ImportError:
    print("Error: Whisper library not installed. Please install it with: pip install openai-whisper", file=sys.stderr)
    sys.exit(1)

def transcribe_audio(audio_path: str, model_name: str = "medium") -> str:
    """
    Transcribe audio file using Whisper.
    
    Args:
        audio_path: Path to audio file
        model_name: Whisper model to use (tiny, base, small, medium, large, turbo)
    
    Returns:
        Transcribed text
    """
    
    try:
        # Validate file exists and is readable
        if not os.path.exists(audio_path):
            print(f"Error: Audio file not found: {audio_path}", file=sys.stderr)
            sys.exit(1)
        
        if not os.access(audio_path, os.R_OK):
            print(f"Error: Audio file is not readable: {audio_path}", file=sys.stderr)
            sys.exit(1)
        
        # Check file size (not empty)
        file_size = os.path.getsize(audio_path)
        if file_size == 0:
            print(f"Error: Audio file is empty: {audio_path}", file=sys.stderr)
            sys.exit(1)
        
        # Load Whisper model (will download on first use)
        print(f"Loading Whisper model: {model_name}...", file=sys.stderr)
        try:
            model = whisper.load_model(model_name)
        except Exception as e:
            print(f"Error loading Whisper model '{model_name}': {str(e)}", file=sys.stderr)
            print(f"Available models: tiny, base, small, medium, large, turbo", file=sys.stderr)
            sys.exit(1)
        
        # Transcribe audio
        print(f"Transcribing audio file: {audio_path} (size: {file_size} bytes)...", file=sys.stderr)
        try:
            result = model.transcribe(audio_path)
        except Exception as e:
            print(f"Error during transcription: {str(e)}", file=sys.stderr)
            sys.exit(1)
        
        # Validate result
        if not result or "text" not in result:
            print(f"Error: Transcription returned invalid result", file=sys.stderr)
            sys.exit(1)
        
        # Return transcript text
        transcript = result["text"].strip()
        if not transcript:
            print(f"Warning: Transcription returned empty text", file=sys.stderr)
        
        print(f"Transcription complete. Length: {len(transcript)} characters", file=sys.stderr)
        return transcript
        
    except KeyboardInterrupt:
        print("\nTranscription interrupted by user", file=sys.stderr)
        sys.exit(130)
    except Exception as e:
        import traceback
        error_msg = f"Unexpected error during transcription: {str(e)}"
        print(error_msg, file=sys.stderr)
        print("Full traceback:", file=sys.stderr)
        traceback.print_exc(file=sys.stderr)
        sys.exit(1)

if __name__ == "__main__":
    try:
        parser = argparse.ArgumentParser(description="Transcribe audio using Whisper")
        parser.add_argument("audio_path", help="Path to audio file")
        parser.add_argument("--model", default="medium", help="Whisper model to use (default: medium)")
        
        args = parser.parse_args()
        
        # Transcribe and output to stdout (only transcript, errors go to stderr)
        transcript = transcribe_audio(args.audio_path, args.model)
        print(transcript)
    except KeyboardInterrupt:
        print("\nScript interrupted by user", file=sys.stderr)
        sys.exit(130)
    except Exception as e:
        import traceback
        print(f"Fatal error in main: {str(e)}", file=sys.stderr)
        print("Full traceback:", file=sys.stderr)
        traceback.print_exc(file=sys.stderr)
        sys.exit(1)

