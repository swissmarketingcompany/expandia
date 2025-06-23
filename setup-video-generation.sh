#!/bin/bash

echo "🚀 Setting up AI Course Video Generation Environment"
echo "=================================================="

# Check if Python is installed
if ! command -v python3 &> /dev/null; then
    echo "❌ Python 3 is required but not installed."
    echo "Please install Python 3 and try again."
    exit 1
fi

echo "✅ Python 3 found"

# Check if pip is installed
if ! command -v pip3 &> /dev/null; then
    echo "❌ pip3 is required but not installed."
    echo "Please install pip3 and try again."
    exit 1
fi

echo "✅ pip3 found"

# Install Python dependencies
echo "📦 Installing Python dependencies..."
pip3 install -r requirements.txt

# Check if FFmpeg is installed
if ! command -v ffmpeg &> /dev/null; then
    echo "⚠️  FFmpeg not found. Installing..."
    
    # Check if we're on macOS
    if [[ "$OSTYPE" == "darwin"* ]]; then
        # Check if Homebrew is installed
        if command -v brew &> /dev/null; then
            brew install ffmpeg
            echo "✅ FFmpeg installed via Homebrew"
        else
            echo "❌ Homebrew not found. Please install FFmpeg manually:"
            echo "   Visit: https://ffmpeg.org/download.html"
            echo "   Or install Homebrew first: https://brew.sh/"
        fi
    else
        echo "❌ Please install FFmpeg manually for your system:"
        echo "   Ubuntu/Debian: sudo apt update && sudo apt install ffmpeg"
        echo "   CentOS/RHEL: sudo yum install ffmpeg"
        echo "   Windows: Download from https://ffmpeg.org/download.html"
    fi
else
    echo "✅ FFmpeg found"
fi

# Create course_videos directory
mkdir -p course_videos
echo "✅ Created course_videos directory"

# Check API keys setup
if [ ! -f ".env" ]; then
    echo "⚠️  .env file not found. Please set up your API keys:"
    echo "   1. Copy api-keys-example.txt to .env"
    echo "   2. Add your actual API keys to .env"
    echo "   3. Get ElevenLabs key from: https://elevenlabs.io/"
    echo "   4. Get OpenAI key from: https://platform.openai.com/api-keys"
else
    echo "✅ .env file found"
fi

echo ""
echo "🎬 Setup complete! You can now generate course videos:"
echo "   python3 create-course-videos.py        # Generate all lessons"
echo "   python3 create-course-videos.py 1      # Generate lesson 1 only"
echo ""
echo "💡 Tips:"
echo "   - Videos will be saved to the course_videos/ directory"
echo "   - Without API keys, the script will use fallback methods"
echo "   - Make sure you have a stable internet connection for API calls" 