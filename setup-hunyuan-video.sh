#!/bin/bash

echo "🎬 Hunyuan Video API Setup for AI University"
echo "============================================="

# Check if Python is available
if ! command -v python3 &> /dev/null; then
    echo "❌ Python 3 is required but not installed."
    exit 1
fi

echo "✅ Python 3 found"

# Install requirements
echo "📦 Installing Python dependencies..."
if pip3 install -r requirements-hunyuan.txt; then
    echo "✅ Dependencies installed successfully"
else
    echo "❌ Failed to install dependencies"
    exit 1
fi

# Check for API key
if [ -z "$SEGMIND_API_KEY" ]; then
    echo ""
    echo "🔑 API Key Setup Required"
    echo "========================"
    echo "You need a Segmind API key to use Hunyuan Video."
    echo ""
    echo "Steps to get your API key:"
    echo "1. Visit https://www.segmind.com/"
    echo "2. Sign up for an account"
    echo "3. Navigate to your API dashboard"
    echo "4. Copy your API key"
    echo ""
    echo "Then set it as an environment variable:"
    echo "export SEGMIND_API_KEY='your_api_key_here'"
    echo ""
    echo "Or add it to your ~/.bashrc or ~/.zshrc file for persistence."
    echo ""
    read -p "Do you have your API key ready? (y/N): " -n 1 -r
    echo
    if [[ $REPLY =~ ^[Yy]$ ]]; then
        read -p "Enter your Segmind API key: " api_key
        export SEGMIND_API_KEY="$api_key"
        echo "✅ API key set for this session"
        echo ""
        echo "To make it permanent, add this to your shell profile:"
        echo "export SEGMIND_API_KEY='$api_key'"
    else
        echo "⚠️  Setup complete, but you'll need to set SEGMIND_API_KEY before generating videos."
        exit 0
    fi
else
    echo "✅ SEGMIND_API_KEY environment variable found"
fi

# Create output directory
mkdir -p course_videos
echo "✅ Output directory created: course_videos/"

# Test the setup
echo ""
echo "🧪 Testing API connection..."
if python3 -c "
from create_hunyuan_course_videos import HunyuanCourseVideoGenerator
import os
try:
    generator = HunyuanCourseVideoGenerator()
    print('✅ API connection test setup complete')
except Exception as e:
    print(f'❌ Setup issue: {e}')
    exit(1)
"; then
    echo "✅ Setup test passed"
else
    echo "❌ Setup test failed"
    exit 1
fi

echo ""
echo "🎉 Setup Complete!"
echo "=================="
echo ""
echo "Next steps:"
echo "1. Run: python3 create-hunyuan-course-videos.py"
echo "2. Choose option 1 to test API connection"
echo "3. Generate your first lesson with option 2"
echo ""
echo "📖 For detailed instructions, see: HUNYUAN_VIDEO_GUIDE.md"
echo ""
echo "💡 Estimated costs:"
echo "   - Test video: ~$0.15"
echo "   - Single lesson (4 segments): ~$0.80-1.20"
echo "   - Complete course: ~$3.20-4.80"
echo ""
echo "🚀 Ready to create amazing AI course videos!" 