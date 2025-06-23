# Hunyuan Video API Course Generator Guide

## Overview

This guide explains how to use the Hunyuan Video API to generate professional educational videos for your AI University courses. Hunyuan Video is a state-of-the-art open-source video generation model that creates high-quality videos from text descriptions.

## Features

- **Professional Quality**: Generate high-resolution educational videos (720p/1280x720)
- **Educational Content**: Pre-configured prompts for AI fundamentals course
- **API-Based**: Uses Segmind's hosted Hunyuan Video API (no local setup required)
- **Flexible Generation**: Generate single segments, full lessons, or entire courses
- **Cost Effective**: Pay-per-use API model

## Setup Instructions

### 1. Get API Key

1. Visit [Segmind.com](https://www.segmind.com/)
2. Sign up for an account
3. Navigate to your API dashboard
4. Copy your API key

### 2. Set Environment Variable

```bash
# On macOS/Linux
export SEGMIND_API_KEY="your_api_key_here"

# On Windows
set SEGMIND_API_KEY=your_api_key_here
```

### 3. Install Dependencies

```bash
pip install -r requirements-hunyuan.txt
```

## Usage

### Quick Start

```bash
# Test the API connection first
python3 create-hunyuan-course-videos.py
# Choose option 1 to test

# Generate a specific lesson
python3 create-hunyuan-course-videos.py
# Choose option 2, then enter lesson number (1-4)
```

### Available Lessons

1. **What is Artificial Intelligence?**
   - AI Introduction
   - AI Examples in Daily Life
   - How AI Works
   - AI Applications

2. **Types of AI & Machine Learning**
   - AI Categories Overview
   - Narrow AI Examples
   - Machine Learning Types
   - Learning Algorithms

3. **AI in Business & Industry**
   - Healthcare AI
   - Financial AI
   - Retail & E-commerce
   - Manufacturing & Automation

4. **Getting Started with AI**
   - AI Strategy Development
   - AI Tools Showcase
   - Implementation Best Practices
   - Future of AI

### Generation Options

- **Option 1**: Test single video segment (recommended first)
- **Option 2**: Generate specific lesson (4 segments per lesson)
- **Option 3**: Generate all lessons with limited segments (2 per lesson)
- **Option 4**: Generate complete course (16+ videos total)

## Video Specifications

- **Resolution**: 1280x720 (720p HD)
- **Aspect Ratio**: 16:9
- **Frame Rates**: 
  - Short segments: 85 frames (~3.5 seconds)
  - Medium segments: 129 frames (~5 seconds)
  - Long segments: 193 frames (~8 seconds)
- **Quality**: 40 inference steps (balanced quality/speed)

## API Costs

Hunyuan Video API pricing (approximate):
- Short video (85 frames): ~$0.10-0.20
- Medium video (129 frames): ~$0.15-0.30
- Long video (193 frames): ~$0.25-0.40

**Estimated costs**:
- Single lesson (4 segments): $0.80-1.20
- Complete course (16 segments): $3.20-4.80

## Output Files

Generated videos are saved to `course_videos/` directory:

```
course_videos/
├── lesson_1_segment_01_ai_introduction.mp4
├── lesson_1_segment_02_ai_examples_in_daily_life.mp4
├── lesson_1_segment_03_how_ai_works.mp4
├── lesson_1_segment_04_ai_applications.mp4
├── lesson_1_playlist.txt
└── api_test.mp4
```

## Advanced Usage

### Custom Video Generation

```python
from create_hunyuan_course_videos import HunyuanCourseVideoGenerator

# Initialize generator
generator = HunyuanCourseVideoGenerator("your_api_key")

# Generate custom video
success = generator.generate_video_segment(
    prompt="Your custom educational prompt here",
    filename="custom_video",
    num_frames=129
)
```

### Batch Processing

```python
# Generate multiple lessons
for lesson_num in [1, 2, 3]:
    videos = generator.generate_lesson_videos(lesson_num, max_segments=2)
    print(f"Generated {len(videos)} videos for lesson {lesson_num}")
```

## Best Practices

### Prompt Engineering

- **Be Specific**: Include details about setting, style, and content
- **Educational Focus**: Mention "educational", "professional", "instructional"
- **Visual Style**: Specify "realistic style", "modern", "clean"
- **Avoid**: Generic prompts, copyrighted content, inappropriate material

### Example Prompts

```python
# Good prompt
"A professional instructor in a modern classroom explaining neural networks, 
with animated diagrams showing data flow, educational setting, realistic style"

# Better prompt
"Professional AI instructor at whiteboard drawing neural network diagram, 
students taking notes, modern university classroom, natural lighting, 
educational documentary style, high quality"
```

### Rate Limiting

- Built-in delays: 5 seconds between segments, 10 seconds between lessons
- Monitor API usage to avoid hitting rate limits
- Consider generating during off-peak hours for better performance

## Troubleshooting

### Common Issues

1. **API Key Error**
   ```
   ❌ Error: SEGMIND_API_KEY environment variable not set
   ```
   **Solution**: Set your API key as environment variable

2. **API Connection Failed**
   ```
   ❌ API test failed: 401 - Unauthorized
   ```
   **Solution**: Check API key validity and account credits

3. **Video Generation Failed**
   ```
   ❌ API Error 429: Too Many Requests
   ```
   **Solution**: Wait and retry, or reduce generation speed

4. **Low Quality Results**
   - Improve prompt specificity
   - Add negative prompts for unwanted elements
   - Increase inference steps (costs more)

### Getting Help

- Check API status at [Segmind Status](https://status.segmind.com/)
- Review Hunyuan Video documentation
- Monitor API usage in Segmind dashboard

## Integration with AI University

### Adding Videos to Course Page

1. Generate lesson videos using the script
2. Upload videos to your hosting platform
3. Update `ai-fundamentals-course.html` with video links:

```html
<video controls class="w-full rounded-lg">
    <source src="course_videos/lesson_1_segment_01_ai_introduction.mp4" type="video/mp4">
    Your browser does not support the video tag.
</video>
```

### Creating Video Playlists

The script automatically generates playlist files for each lesson:

```
# What is Artificial Intelligence? - Video Playlist

1. AI Introduction: lesson_1_segment_01_ai_introduction.mp4
2. AI Examples in Daily Life: lesson_1_segment_02_ai_examples_in_daily_life.mp4
3. How AI Works: lesson_1_segment_03_how_ai_works.mp4
4. AI Applications: lesson_1_segment_04_ai_applications.mp4
```

## Next Steps

1. **Test the API**: Start with option 1 to verify setup
2. **Generate Sample**: Create one lesson to evaluate quality
3. **Refine Prompts**: Adjust prompts based on results
4. **Scale Production**: Generate full course content
5. **Integrate**: Add videos to your AI University platform

## Support

For technical issues:
- Check the troubleshooting section above
- Review Segmind API documentation
- Contact Segmind support for API-related issues

For course content questions:
- Review the lesson structure in the script
- Customize prompts for your specific needs
- Consider adding more segments or lessons 