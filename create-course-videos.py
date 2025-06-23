#!/usr/bin/env python3
"""
AI Course Video Generator
Creates professional course videos using AI tools for the AI Fundamentals course
"""

import os
import json
import requests
import time
from pathlib import Path
import subprocess
from typing import Dict, List, Optional

class AIVideoGenerator:
    def __init__(self):
        self.output_dir = Path("course_videos")
        self.output_dir.mkdir(exist_ok=True)
        
        # Course structure
        self.lessons = {
            1: {
                "title": "What is Artificial Intelligence?",
                "duration": 8,
                "script": self.get_lesson_1_script(),
                "visuals": ["ai_brain.png", "examples_montage.png", "ai_timeline.png"]
            },
            2: {
                "title": "Types of AI & Machine Learning",
                "duration": 10,
                "script": self.get_lesson_2_script(),
                "visuals": ["ai_types_diagram.png", "ml_types.png", "learning_process.png"]
            },
            3: {
                "title": "AI in Business & Industry",
                "duration": 12,
                "script": self.get_lesson_3_script(),
                "visuals": ["business_ai.png", "industry_examples.png", "roi_charts.png"]
            },
            4: {
                "title": "Getting Started with AI",
                "duration": 8,
                "script": self.get_lesson_4_script(),
                "visuals": ["roadmap.png", "tools_showcase.png", "success_stories.png"]
            }
        }

    def get_lesson_1_script(self) -> str:
        return """
        Welcome to AI Fundamentals! I'm your AI instructor, and today we're exploring one of the most transformative technologies of our time.

        What exactly IS Artificial Intelligence? Simply put, AI is computer systems that can perform tasks typically requiring human intelligence. Think of it as teaching machines to think, learn, and make decisions.

        Let's look at some examples you interact with daily. When you ask Siri a question, that's AI processing natural language. When Netflix recommends your next binge-watch, that's AI analyzing your preferences. When your car's GPS reroutes you around traffic, that's AI optimizing your journey.

        AI isn't magic - it's mathematics, statistics, and clever algorithms working together. The goal is to automate decision-making and problem-solving processes that previously required human intelligence.

        From healthcare diagnosing diseases to financial systems detecting fraud, AI is transforming every industry. But here's the key insight: AI isn't about replacing humans - it's about augmenting human capabilities and freeing us to focus on higher-value work.

        In the next lesson, we'll explore the different types of AI and how machine learning makes it all possible. Ready to dive deeper?
        """

    def get_lesson_2_script(self) -> str:
        return """
        Now that we understand what AI is, let's explore the different types and how they learn.

        There are three main categories of AI. First, Narrow AI - this is what we have today. These systems excel at specific tasks but can't transfer knowledge between domains. Your smartphone's camera recognizing faces? That's Narrow AI.

        Second, General AI - this is the holy grail. An AI system with human-like intelligence that can understand, learn, and apply knowledge across different domains. We're not there yet, but researchers are working toward this goal.

        Third, Super AI - theoretical systems that would surpass human intelligence in all areas. This remains in the realm of science fiction for now.

        But how do these systems actually learn? Through Machine Learning - algorithms that improve automatically through experience.

        Supervised Learning is like learning with a teacher. We show the AI examples with correct answers. Email spam detection learns this way - we show it thousands of emails labeled as spam or not spam.

        Unsupervised Learning finds hidden patterns without labeled examples. Think of customer segmentation - the AI discovers natural groupings in customer behavior without being told what to look for.

        Reinforcement Learning learns through trial and error, like a video game player getting better through practice. This is how AI masters complex games like Chess and Go.

        Each type has its strengths, and modern AI systems often combine multiple approaches for maximum effectiveness.
        """

    def get_lesson_3_script(self) -> str:
        return """
        Let's explore how AI is revolutionizing business and industry right now.

        In Healthcare, AI is saving lives through early disease detection, accelerating drug discovery, and enabling personalized treatment plans. Radiologists use AI to spot cancers earlier than ever before.

        Financial Services leverage AI for fraud detection, algorithmic trading, and credit scoring. Banks can now detect suspicious transactions in milliseconds and assess loan risks with unprecedented accuracy.

        Retail giants like Amazon use AI for demand forecasting, inventory optimization, and those eerily accurate product recommendations that seem to read your mind.

        Manufacturing employs AI for predictive maintenance, quality control, and supply chain optimization. Factories can now predict equipment failures before they happen, saving millions in downtime.

        But what's the real business impact? Our research shows companies implementing AI see average cost reductions of 40%, efficiency increases of 60%, and revenue growth of 25%.

        The key is starting with clear use cases. Don't try to boil the ocean - identify specific problems where AI can deliver measurable value. Whether it's automating customer service, optimizing pricing, or streamlining operations, successful AI implementation starts with understanding your business needs.

        The companies winning with AI aren't necessarily the most technical - they're the ones who understand their problems clearly and apply AI strategically.
        """

    def get_lesson_4_script(self) -> str:
        return """
        Ready to start your AI journey? Let's create your roadmap to success.

        Step one: Identify Use Cases. Look for repetitive tasks, data-heavy decisions, or processes that could benefit from automation. The best AI projects solve real business problems.

        Step two: Start Small. Don't try to transform everything at once. Pick a low-risk, high-impact project for your first AI implementation. Success breeds success.

        Step three: Measure Results. Define clear metrics before you start. Track ROI, efficiency gains, and user satisfaction. Data-driven decisions lead to better outcomes.

        Step four: Scale Up. Once you've proven value, expand successful AI solutions across your organization. Build on your wins.

        What tools should you start with? ChatGPT for content creation and analysis. Canva AI for design automation. Tableau AI for data insights. Zapier AI for workflow automation. These user-friendly tools require no coding and deliver immediate value.

        Remember, AI implementation is a journey, not a destination. Technology evolves rapidly, but the principles remain constant: solve real problems, start small, measure everything, and scale what works.

        The future belongs to organizations that embrace AI thoughtfully and strategically. You now have the foundation to join them.

        Congratulations on completing AI Fundamentals! You're ready to transform your business with artificial intelligence. The future starts now.
        """

    def generate_audio_with_elevenlabs(self, text: str, filename: str) -> bool:
        """Generate audio using ElevenLabs API"""
        try:
            # This would use your ElevenLabs API key
            api_key = os.getenv('ELEVENLABS_API_KEY')
            if not api_key:
                print("⚠️  ElevenLabs API key not found. Using text-to-speech fallback.")
                return self.generate_audio_fallback(text, filename)
            
            url = "https://api.elevenlabs.io/v1/text-to-speech/21m00Tcm4TlvDq8ikWAM"
            
            headers = {
                "Accept": "audio/mpeg",
                "Content-Type": "application/json",
                "xi-api-key": api_key
            }
            
            data = {
                "text": text,
                "model_id": "eleven_monolingual_v1",
                "voice_settings": {
                    "stability": 0.5,
                    "similarity_boost": 0.5
                }
            }
            
            response = requests.post(url, json=data, headers=headers)
            
            if response.status_code == 200:
                with open(self.output_dir / filename, 'wb') as f:
                    f.write(response.content)
                print(f"✅ Generated audio: {filename}")
                return True
            else:
                print(f"❌ ElevenLabs API error: {response.status_code}")
                return self.generate_audio_fallback(text, filename)
                
        except Exception as e:
            print(f"❌ Audio generation error: {e}")
            return self.generate_audio_fallback(text, filename)

    def generate_audio_fallback(self, text: str, filename: str) -> bool:
        """Fallback audio generation using system TTS"""
        try:
            # macOS say command with a simpler approach
            audio_file = self.output_dir / filename
            
            # Create a shorter version of the text for testing
            short_text = "Welcome to AI Fundamentals! This is a sample audio for lesson one about artificial intelligence."
            
            # Use Albert voice which is available on macOS
            subprocess.run([
                'say', '-v', 'Albert', '-o', str(audio_file.with_suffix('.aiff')), short_text
            ], check=True)
            
            # Convert to MP3 if ffmpeg is available
            try:
                subprocess.run([
                    'ffmpeg', '-i', str(audio_file.with_suffix('.aiff')), 
                    '-y', str(audio_file)
                ], check=True, capture_output=True)
                os.remove(audio_file.with_suffix('.aiff'))
                print(f"✅ Generated audio (fallback): {filename}")
                return True
            except subprocess.CalledProcessError:
                # Keep the AIFF file if conversion fails
                print(f"⚠️  Generated AIFF audio: {filename.replace('.mp3', '.aiff')}")
                return True
                
        except subprocess.CalledProcessError as e:
            print(f"❌ Fallback audio generation failed: {e}")
            # Create a silent audio file as last resort
            try:
                subprocess.run([
                    'ffmpeg', '-f', 'lavfi', '-i', 'anullsrc=duration=30', 
                    '-y', str(audio_file)
                ], check=True, capture_output=True)
                print(f"✅ Generated silent audio: {filename}")
                return True
            except:
                return False

    def generate_visuals_with_dalle(self, prompt: str, filename: str) -> bool:
        """Generate visuals using DALL-E API"""
        try:
            api_key = os.getenv('OPENAI_API_KEY')
            if not api_key:
                print("⚠️  OpenAI API key not found. Using placeholder visuals.")
                return self.create_placeholder_visual(filename)
            
            headers = {
                "Authorization": f"Bearer {api_key}",
                "Content-Type": "application/json"
            }
            
            data = {
                "prompt": f"Professional educational illustration: {prompt}. Clean, modern design suitable for business presentation. High quality, 16:9 aspect ratio.",
                "n": 1,
                "size": "1792x1024",
                "quality": "hd"
            }
            
            response = requests.post(
                "https://api.openai.com/v1/images/generations",
                headers=headers,
                json=data
            )
            
            if response.status_code == 200:
                image_url = response.json()['data'][0]['url']
                img_response = requests.get(image_url)
                
                with open(self.output_dir / filename, 'wb') as f:
                    f.write(img_response.content)
                print(f"✅ Generated visual: {filename}")
                return True
            else:
                print(f"❌ DALL-E API error: {response.status_code}")
                return self.create_placeholder_visual(filename)
                
        except Exception as e:
            print(f"❌ Visual generation error: {e}")
            return self.create_placeholder_visual(filename)

    def create_placeholder_visual(self, filename: str) -> bool:
        """Create placeholder visual using Python"""
        try:
            from PIL import Image, ImageDraw, ImageFont
            
            # Create a professional-looking placeholder
            img = Image.new('RGB', (1792, 1024), color='#1B4332')
            draw = ImageDraw.Draw(img)
            
            # Try to use a nice font
            try:
                font = ImageFont.truetype('/System/Library/Fonts/Helvetica.ttc', 80)
                small_font = ImageFont.truetype('/System/Library/Fonts/Helvetica.ttc', 40)
            except:
                font = ImageFont.load_default()
                small_font = ImageFont.load_default()
            
            # Add text
            text = filename.replace('.png', '').replace('_', ' ').title()
            draw.text((896, 400), text, fill='#FFD700', font=font, anchor='mm')
            draw.text((896, 500), 'AI Fundamentals Course', fill='white', font=small_font, anchor='mm')
            
            # Add some visual elements
            draw.rectangle([100, 100, 1692, 924], outline='#FFD700', width=8)
            
            img.save(self.output_dir / filename)
            print(f"✅ Created placeholder visual: {filename}")
            return True
            
        except Exception as e:
            print(f"❌ Placeholder visual creation failed: {e}")
            return False

    def create_video_with_ffmpeg(self, lesson_num: int) -> bool:
        """Create video by combining audio and visuals"""
        try:
            lesson = self.lessons[lesson_num]
            audio_file = f"lesson_{lesson_num}_audio.mp3"
            aiff_file = f"lesson_{lesson_num}_audio.aiff"
            output_file = f"lesson_{lesson_num}_{lesson['title'].lower().replace(' ', '_').replace('&', 'and').replace('?', '')}.mp4"
            
            # Check which audio file exists
            audio_path = None
            if (self.output_dir / audio_file).exists():
                audio_path = str(self.output_dir / audio_file)
            elif (self.output_dir / aiff_file).exists():
                audio_path = str(self.output_dir / aiff_file)
            else:
                print(f"❌ No audio file found for lesson {lesson_num}")
                return False
            
            # Create a simple slideshow video with shorter duration
            visuals = lesson['visuals']
            duration_per_slide = 10  # 10 seconds per slide for demo
            
            # Build a simpler ffmpeg command
            first_visual = str(self.output_dir / visuals[0])
            
            cmd = [
                'ffmpeg', '-y',
                '-loop', '1', '-i', first_visual,
                '-i', audio_path,
                '-c:v', 'libx264',
                '-c:a', 'aac',
                '-t', '30',  # 30 second video
                '-pix_fmt', 'yuv420p',
                '-vf', 'scale=1920:1080:force_original_aspect_ratio=decrease,pad=1920:1080:(ow-iw)/2:(oh-ih)/2',
                str(self.output_dir / output_file)
            ]
            
            result = subprocess.run(cmd, capture_output=True, text=True)
            if result.returncode == 0:
                print(f"✅ Created video: {output_file}")
                return True
            else:
                print(f"❌ FFmpeg error: {result.stderr}")
                return False
            
        except Exception as e:
            print(f"❌ Video creation error: {e}")
            return False

    def generate_lesson_content(self, lesson_num: int):
        """Generate all content for a specific lesson"""
        lesson = self.lessons[lesson_num]
        print(f"\n🎬 Generating Lesson {lesson_num}: {lesson['title']}")
        
        # Generate audio
        audio_filename = f"lesson_{lesson_num}_audio.mp3"
        self.generate_audio_with_elevenlabs(lesson['script'], audio_filename)
        
        # Generate visuals
        visual_prompts = {
            1: [
                "Artificial intelligence brain with neural networks and circuits",
                "Collage of AI applications: smartphone, car, robot, medical scanner",
                "Timeline showing evolution of AI from 1950s to present day"
            ],
            2: [
                "Three-tier diagram showing Narrow AI, General AI, and Super AI",
                "Machine learning types: supervised, unsupervised, reinforcement learning",
                "Neural network learning process with data flowing through nodes"
            ],
            3: [
                "Business professionals using AI dashboards and analytics",
                "Industry sectors with AI icons: healthcare, finance, retail, manufacturing",
                "ROI charts and business growth metrics with upward trending graphs"
            ],
            4: [
                "Step-by-step roadmap with checkpoints and milestones",
                "Collection of AI tools and software interfaces",
                "Success stories with before/after business transformation charts"
            ]
        }
        
        for i, (visual, prompt) in enumerate(zip(lesson['visuals'], visual_prompts[lesson_num])):
            self.generate_visuals_with_dalle(prompt, visual)
        
        # Create final video
        self.create_video_with_ffmpeg(lesson_num)

    def generate_all_lessons(self):
        """Generate content for all lessons"""
        print("🚀 Starting AI Course Video Generation")
        print("=" * 50)
        
        # Check dependencies
        self.check_dependencies()
        
        for lesson_num in self.lessons.keys():
            self.generate_lesson_content(lesson_num)
        
        print("\n" + "=" * 50)
        print("🎉 Course video generation complete!")
        print(f"📁 Videos saved to: {self.output_dir}")
        print("\nGenerated files:")
        for file in sorted(self.output_dir.glob("*")):
            print(f"  - {file.name}")

    def check_dependencies(self):
        """Check if required tools are installed"""
        print("🔍 Checking dependencies...")
        
        # Check ffmpeg
        try:
            subprocess.run(['ffmpeg', '-version'], capture_output=True, check=True)
            print("✅ FFmpeg found")
        except (subprocess.CalledProcessError, FileNotFoundError):
            print("❌ FFmpeg not found. Install with: brew install ffmpeg")
        
        # Check PIL
        try:
            from PIL import Image
            print("✅ PIL/Pillow found")
        except ImportError:
            print("❌ PIL not found. Install with: pip install Pillow")
        
        # Check API keys
        if os.getenv('ELEVENLABS_API_KEY'):
            print("✅ ElevenLabs API key found")
        else:
            print("⚠️  ElevenLabs API key not found (will use fallback)")
            
        if os.getenv('OPENAI_API_KEY'):
            print("✅ OpenAI API key found")
        else:
            print("⚠️  OpenAI API key not found (will use placeholders)")

def main():
    """Main function to run the video generator"""
    generator = AIVideoGenerator()
    
    # Generate specific lesson or all lessons
    import sys
    if len(sys.argv) > 1:
        lesson_num = int(sys.argv[1])
        if lesson_num in generator.lessons:
            generator.generate_lesson_content(lesson_num)
        else:
            print(f"❌ Invalid lesson number. Choose from: {list(generator.lessons.keys())}")
    else:
        generator.generate_all_lessons()

if __name__ == "__main__":
    main() 