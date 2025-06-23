#!/usr/bin/env python3
"""
Hunyuan Video API Course Generator
Creates professional educational videos using Hunyuan Video API for AI University courses
"""

import os
import json
import requests
import time
from pathlib import Path
from typing import Dict, List, Optional
import tempfile
from datetime import datetime

class HunyuanCourseVideoGenerator:
    def __init__(self, api_key: str = None):
        self.api_key = api_key or os.getenv('SEGMIND_API_KEY')
        if not self.api_key:
            raise ValueError("Please set SEGMIND_API_KEY environment variable or pass api_key parameter")
        
        self.output_dir = Path("course_videos")
        self.output_dir.mkdir(exist_ok=True)
        
        self.api_url = "https://api.segmind.com/v1/hunyuan-video"
        self.headers = {'x-api-key': self.api_key}
        
        # Educational video prompts for each lesson
        self.lessons = {
            1: {
                "title": "What is Artificial Intelligence?",
                "segments": [
                    {
                        "topic": "AI Introduction",
                        "prompt": "A professional instructor in a modern classroom explaining artificial intelligence concepts, with holographic AI brain visualizations floating around, clean educational setting, professional lighting, realistic style",
                        "duration": "medium"
                    },
                    {
                        "topic": "AI Examples in Daily Life",
                        "prompt": "Split screen showing various AI applications: smartphone face recognition, voice assistant responding, Netflix recommendations, autonomous car driving, smooth transitions, modern tech aesthetic",
                        "duration": "medium"
                    },
                    {
                        "topic": "How AI Works",
                        "prompt": "Animated visualization of neural networks processing data, colorful nodes connecting and lighting up, data flowing through network layers, educational diagram style, clean background",
                        "duration": "medium"
                    },
                    {
                        "topic": "AI Applications",
                        "prompt": "Montage of AI in different industries: medical AI analyzing scans, robots in manufacturing, AI trading systems, agricultural drones, professional documentary style",
                        "duration": "long"
                    }
                ]
            },
            2: {
                "title": "Types of AI & Machine Learning",
                "segments": [
                    {
                        "topic": "AI Categories Overview",
                        "prompt": "Professional presentation showing AI hierarchy diagram, narrow AI to general AI progression, clean educational graphics, instructor pointing to visual elements",
                        "duration": "medium"
                    },
                    {
                        "topic": "Narrow AI Examples",
                        "prompt": "Demonstration of specific AI tasks: chess-playing computer, language translation app, image recognition system, each focused on single task, modern tech style",
                        "duration": "medium"
                    },
                    {
                        "topic": "Machine Learning Types",
                        "prompt": "Animated explanation of supervised learning with labeled data, unsupervised learning finding patterns, reinforcement learning through trial and error, educational animation style",
                        "duration": "long"
                    },
                    {
                        "topic": "Learning Algorithms",
                        "prompt": "Visual representation of algorithms processing data, pattern recognition in action, decision trees forming, neural networks training, scientific visualization style",
                        "duration": "medium"
                    }
                ]
            },
            3: {
                "title": "AI in Business & Industry",
                "segments": [
                    {
                        "topic": "Healthcare AI",
                        "prompt": "Modern hospital setting with AI analyzing medical scans, doctors reviewing AI recommendations, robotic surgery assistance, professional medical environment",
                        "duration": "medium"
                    },
                    {
                        "topic": "Financial AI",
                        "prompt": "Trading floor with AI systems processing market data, fraud detection algorithms analyzing transactions, automated investment decisions, financial technology center",
                        "duration": "medium"
                    },
                    {
                        "topic": "Retail & E-commerce",
                        "prompt": "AI-powered recommendation engines in action, inventory management systems, customer behavior analysis, personalized shopping experiences, modern retail technology",
                        "duration": "medium"
                    },
                    {
                        "topic": "Manufacturing & Automation",
                        "prompt": "Smart factory with AI-controlled robots, predictive maintenance systems, quality control AI inspecting products, industrial automation in action",
                        "duration": "long"
                    }
                ]
            },
            4: {
                "title": "Getting Started with AI",
                "segments": [
                    {
                        "topic": "AI Strategy Development",
                        "prompt": "Business meeting discussing AI implementation strategy, executives reviewing AI roadmap, strategic planning session, professional corporate environment",
                        "duration": "medium"
                    },
                    {
                        "topic": "AI Tools Showcase",
                        "prompt": "Demonstration of popular AI tools: ChatGPT interface, design AI platforms, data analysis tools, user-friendly AI applications, modern workspace setting",
                        "duration": "long"
                    },
                    {
                        "topic": "Implementation Best Practices",
                        "prompt": "Step-by-step AI implementation process, team training sessions, data preparation workflows, successful AI project deployment, collaborative work environment",
                        "duration": "medium"
                    },
                    {
                        "topic": "Future of AI",
                        "prompt": "Futuristic vision of AI integration in society, emerging technologies, human-AI collaboration, innovative applications, inspiring technological advancement",
                        "duration": "medium"
                    }
                ]
            }
        }

    def generate_video_segment(self, prompt: str, filename: str, aspect_ratio: str = "16:9", 
                             resolution: str = "720p", num_frames: int = 129) -> bool:
        """Generate a single video segment using Hunyuan Video API"""
        
        data = {
            "seed": int(time.time()) % 100000,  # Random seed based on timestamp
            "width": 1280 if aspect_ratio == "16:9" else 720,
            "height": 720 if aspect_ratio == "16:9" else 1280,
            "prompt": prompt,
            "flow_shift": 7,
            "infer_steps": 40,  # Good balance of quality and speed
            "video_length": num_frames,
            "negative_prompt": "blurry, low quality, distorted, amateur, unprofessional, bad lighting, pixelated, artifacts",
            "embedded_guidance_scale": 6
        }
        
        print(f"🎬 Generating video: {filename}")
        print(f"📝 Prompt: {prompt[:100]}...")
        
        try:
            response = requests.post(self.api_url, json=data, headers=self.headers)
            
            if response.status_code == 200:
                # Save the video content
                video_path = self.output_dir / f"{filename}.mp4"
                with open(video_path, 'wb') as f:
                    f.write(response.content)
                
                print(f"✅ Video saved: {video_path}")
                return True
            else:
                print(f"❌ API Error {response.status_code}: {response.text}")
                return False
                
        except Exception as e:
            print(f"❌ Error generating video: {str(e)}")
            return False

    def generate_lesson_videos(self, lesson_num: int, max_segments: int = None) -> List[str]:
        """Generate all video segments for a specific lesson"""
        
        if lesson_num not in self.lessons:
            print(f"❌ Lesson {lesson_num} not found")
            return []
        
        lesson = self.lessons[lesson_num]
        print(f"\n🎓 Generating videos for Lesson {lesson_num}: {lesson['title']}")
        
        generated_videos = []
        segments = lesson['segments'][:max_segments] if max_segments else lesson['segments']
        
        for i, segment in enumerate(segments, 1):
            # Determine video length based on duration
            num_frames = {
                "short": 85,    # ~3.5 seconds
                "medium": 129,  # ~5 seconds  
                "long": 193     # ~8 seconds
            }.get(segment.get('duration', 'medium'), 129)
            
            filename = f"lesson_{lesson_num}_segment_{i:02d}_{segment['topic'].lower().replace(' ', '_')}"
            
            success = self.generate_video_segment(
                prompt=segment['prompt'],
                filename=filename,
                num_frames=num_frames
            )
            
            if success:
                generated_videos.append(f"{filename}.mp4")
            
            # Add delay between API calls to avoid rate limiting
            time.sleep(5)
        
        return generated_videos

    def create_lesson_playlist(self, lesson_num: int, video_files: List[str]) -> str:
        """Create a simple playlist file for the lesson videos"""
        
        if lesson_num not in self.lessons:
            return ""
        
        lesson = self.lessons[lesson_num]
        playlist_content = f"# {lesson['title']} - Video Playlist\n\n"
        
        for i, video_file in enumerate(video_files, 1):
            segment_info = lesson['segments'][i-1] if i-1 < len(lesson['segments']) else {}
            topic = segment_info.get('topic', f'Segment {i}')
            playlist_content += f"{i}. {topic}: {video_file}\n"
        
        playlist_file = self.output_dir / f"lesson_{lesson_num}_playlist.txt"
        with open(playlist_file, 'w') as f:
            f.write(playlist_content)
        
        return str(playlist_file)

    def generate_all_lessons(self, max_segments_per_lesson: int = None):
        """Generate videos for all lessons"""
        
        print("🚀 Starting Hunyuan Video Course Generation")
        print(f"📁 Output directory: {self.output_dir.absolute()}")
        
        total_generated = 0
        
        for lesson_num in sorted(self.lessons.keys()):
            try:
                videos = self.generate_lesson_videos(lesson_num, max_segments_per_lesson)
                
                if videos:
                    playlist = self.create_lesson_playlist(lesson_num, videos)
                    print(f"📋 Playlist created: {playlist}")
                    total_generated += len(videos)
                
                print(f"✅ Lesson {lesson_num} completed: {len(videos)} videos generated")
                
                # Longer delay between lessons
                if lesson_num < max(self.lessons.keys()):
                    print("⏳ Waiting before next lesson...")
                    time.sleep(10)
                    
            except Exception as e:
                print(f"❌ Error generating lesson {lesson_num}: {str(e)}")
                continue
        
        print(f"\n🎉 Course generation completed!")
        print(f"📊 Total videos generated: {total_generated}")
        print(f"📁 All files saved to: {self.output_dir.absolute()}")

    def test_api_connection(self) -> bool:
        """Test the API connection with a simple request"""
        
        test_data = {
            "seed": 12345,
            "width": 854,
            "height": 480,
            "prompt": "A simple test: a cat walking on grass, realistic style",
            "flow_shift": 7,
            "infer_steps": 20,  # Fewer steps for testing
            "video_length": 85,  # Shorter for testing
            "negative_prompt": "low quality",
            "embedded_guidance_scale": 6
        }
        
        print("🔍 Testing API connection...")
        
        try:
            response = requests.post(self.api_url, json=test_data, headers=self.headers)
            
            if response.status_code == 200:
                test_file = self.output_dir / "api_test.mp4"
                with open(test_file, 'wb') as f:
                    f.write(response.content)
                print(f"✅ API test successful! Test video saved: {test_file}")
                return True
            else:
                print(f"❌ API test failed: {response.status_code} - {response.text}")
                return False
                
        except Exception as e:
            print(f"❌ API connection error: {str(e)}")
            return False

def main():
    """Main function to run the course video generator"""
    
    print("🎬 Hunyuan Video API Course Generator")
    print("=" * 50)
    
    # Check for API key
    api_key = os.getenv('SEGMIND_API_KEY')
    if not api_key:
        print("❌ Error: SEGMIND_API_KEY environment variable not set")
        print("📝 Please get your API key from: https://www.segmind.com/")
        print("🔧 Set it with: export SEGMIND_API_KEY='your_api_key_here'")
        return
    
    try:
        # Initialize generator
        generator = HunyuanCourseVideoGenerator(api_key)
        
        # Test API connection first
        if not generator.test_api_connection():
            print("❌ API connection failed. Please check your API key and internet connection.")
            return
        
        # Ask user what to generate
        print("\n📚 What would you like to generate?")
        print("1. Test single video segment")
        print("2. Generate specific lesson")
        print("3. Generate all lessons (limited segments)")
        print("4. Generate all lessons (full course)")
        
        choice = input("\nEnter your choice (1-4): ").strip()
        
        if choice == "1":
            # Generate test segment
            success = generator.generate_video_segment(
                prompt="A professional instructor explaining AI concepts in a modern classroom, educational setting, realistic style",
                filename="test_ai_explanation"
            )
            if success:
                print("✅ Test video generated successfully!")
        
        elif choice == "2":
            lesson_num = int(input("Enter lesson number (1-4): "))
            videos = generator.generate_lesson_videos(lesson_num)
            print(f"✅ Generated {len(videos)} videos for lesson {lesson_num}")
        
        elif choice == "3":
            # Generate all lessons with limited segments (2 per lesson)
            generator.generate_all_lessons(max_segments_per_lesson=2)
        
        elif choice == "4":
            # Generate full course
            confirm = input("⚠️  This will generate many videos and may take hours. Continue? (y/N): ")
            if confirm.lower() == 'y':
                generator.generate_all_lessons()
        
        else:
            print("❌ Invalid choice")
    
    except KeyboardInterrupt:
        print("\n⏹️  Generation stopped by user")
    except Exception as e:
        print(f"❌ Unexpected error: {str(e)}")

if __name__ == "__main__":
    main() 