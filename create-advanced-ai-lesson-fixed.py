#!/usr/bin/env python3
"""
Advanced AI Lesson 1 Generator - Fixed Version
Creates a professional "What is Artificial Intelligence?" course with:
- High-quality voice synthesis using available system voices
- Professional visuals with enhanced graphics
- Multi-scene video production
"""

import os
import subprocess
from pathlib import Path
import tempfile
from typing import List

class AdvancedAILessonGeneratorFixed:
    def __init__(self):
        self.output_dir = Path("course_videos")
        self.output_dir.mkdir(exist_ok=True)
        
        # Complete lesson script - 10 minutes of comprehensive content
        self.full_script = """
Welcome to AI Fundamentals! I'm your instructor, and today we're embarking on an exciting journey to understand one of the most transformative technologies of our time: Artificial Intelligence.

Over the next ten minutes, we'll explore what AI really is, how it works, and why it's revolutionizing every aspect of our lives. By the end of this lesson, you'll have a clear understanding of AI fundamentals that will serve as your foundation for mastering this incredible technology.

So, what exactly IS Artificial Intelligence? At its most fundamental level, AI is the development of computer systems that can perform tasks typically requiring human intelligence. But that's just scratching the surface.

Think of AI as teaching machines to think, learn, and make decisions. It's about creating systems that can perceive their environment, understand complex information, reason through problems, and take actions to achieve specific goals.

The key insight is this: AI isn't about creating human-like robots. It's about augmenting and amplifying human capabilities through intelligent automation.

You might think AI is futuristic technology, but the truth is, you're already interacting with AI dozens of times every day. Let me show you.

When you unlock your phone with face recognition, that's AI analyzing your facial features in real-time. When you ask Siri or Google Assistant for directions, that's AI processing natural language and understanding your intent. When Netflix suggests your next binge-watch, that's AI analyzing your viewing patterns and preferences.

Your email automatically filters spam, your car's GPS reroutes you around traffic, and your online shopping experience is personalized - all powered by AI. Even your smartphone's camera automatically adjusts settings for the perfect photo using AI algorithms.

AI isn't coming to your life - it's already here, working invisibly to make your daily experiences smoother and more efficient.

But how does AI actually work? It's built on three fundamental pillars: data, algorithms, and computing power.

Data is the fuel that powers AI. Just like humans learn from experience, AI systems learn from vast amounts of data. The more quality data an AI system has, the better it can perform.

Algorithms are the mathematical recipes that process this data. These are sophisticated mathematical models that can identify patterns, make predictions, and optimize decisions based on the information they've learned.

Computing power makes it all possible at scale. Modern AI requires massive computational resources to process millions of data points and make split-second decisions.

Here's what makes AI different from traditional programming: Instead of writing explicit rules for every scenario, we train AI systems to recognize patterns and make decisions based on examples. It's like teaching a child to recognize cats by showing them thousands of cat pictures, but AI can process millions of examples in minutes.

The real power of AI lies in its ability to find patterns humans might miss. This capability is already transforming industries in remarkable ways.

In medicine, AI can detect early signs of cancer in medical scans that even experienced radiologists might overlook. Google's AI system can identify diabetic retinopathy from eye photographs, potentially preventing blindness in millions of patients.

In finance, AI spots fraudulent transactions among millions of daily purchases by recognizing subtle patterns in spending behavior. In agriculture, AI analyzes satellite imagery to optimize crop yields and predict harvest times.

This pattern recognition capability allows AI to make sense of complex, unstructured data at a scale and speed that's simply impossible for humans.

Looking ahead, AI will become even more integrated into our daily lives, but here's what's important to understand: we're still in the early stages.

Current AI is what we call "narrow" - each system excels at specific tasks but can't transfer knowledge between domains. Your chess-playing AI can't suddenly start composing music or diagnosing diseases.

The future holds exciting possibilities: AI tutors providing personalized education, autonomous vehicles revolutionizing transportation, and AI assistants that truly understand context and nuance.

But remember, the goal isn't to replace human intelligence - it's to augment it. AI handles routine, data-intensive tasks, freeing us to focus on creativity, empathy, complex problem-solving, and the uniquely human aspects of work and life.

As we continue this course, you'll discover how to harness AI's power for your own projects and business. The future belongs to those who understand and embrace these technologies thoughtfully.

In our next lesson, we'll explore the different types of AI and dive deep into machine learning. Get ready to discover how machines actually learn and evolve!

Thank you for joining me in this first lesson. Remember, AI is not just about technology - it's about enhancing human potential. See you in the next lesson!
"""

    def generate_professional_voice(self, text: str, filename: str) -> bool:
        """Generate high-quality voice using the best available system voice"""
        try:
            audio_file = self.output_dir / filename
            
            # Use Albert voice (high quality English voice on macOS)
            voice = "Albert"
            
            print(f"🎵 Generating voice with {voice}...")
            
            # Generate AIFF first with high quality settings
            aiff_file = audio_file.with_suffix('.aiff')
            subprocess.run([
                'say', '-v', voice, '-r', '180', '-o', str(aiff_file), text
            ], check=True)
            
            # Convert to high-quality MP3
            subprocess.run([
                'ffmpeg', '-i', str(aiff_file),
                '-codec:a', 'libmp3lame', '-b:a', '320k',
                '-ar', '48000', '-ac', '2', '-y', str(audio_file)
            ], check=True, capture_output=True)
            
            # Remove temporary file
            if aiff_file.exists():
                aiff_file.unlink()
            
            print(f"✅ Generated professional voice: {filename}")
            return True
            
        except subprocess.CalledProcessError as e:
            print(f"❌ Voice generation failed: {e}")
            return False
        except Exception as e:
            print(f"❌ Unexpected voice error: {e}")
            return False

    def create_professional_visuals(self) -> List[Path]:
        """Create a series of professional educational visuals"""
        try:
            from PIL import Image, ImageDraw, ImageFont, ImageFilter
            import random
            import math
            
            visuals = []
            
            # Visual themes for different sections
            themes = [
                {"name": "welcome", "title": "Welcome to AI Fundamentals", "color": "#1e88e5"},
                {"name": "definition", "title": "What is Artificial Intelligence?", "color": "#43a047"},
                {"name": "daily_life", "title": "AI in Your Daily Life", "color": "#fb8c00"},
                {"name": "how_it_works", "title": "How AI Actually Works", "color": "#8e24aa"},
                {"name": "pillars", "title": "The Three Pillars of AI", "color": "#d32f2f"},
                {"name": "patterns", "title": "Pattern Recognition Power", "color": "#00acc1"},
                {"name": "industries", "title": "AI Transforming Industries", "color": "#689f38"},
                {"name": "future", "title": "The Future of AI", "color": "#5e35b1"},
                {"name": "conclusion", "title": "Your AI Journey Begins", "color": "#1976d2"}
            ]
            
            for theme in themes:
                img_path = self.create_themed_visual(theme)
                if img_path:
                    visuals.append(img_path)
            
            return visuals
            
        except Exception as e:
            print(f"❌ Visual creation error: {e}")
            return []

    def create_themed_visual(self, theme: dict) -> Path:
        """Create a themed visual for a specific section"""
        try:
            from PIL import Image, ImageDraw, ImageFont, ImageFilter
            import random
            import math
            
            # Create high-resolution image (1920x1080 for video)
            img = Image.new('RGB', (1920, 1080), color='#0a0e27')
            draw = ImageDraw.Draw(img)
            
            # Load fonts
            try:
                title_font = ImageFont.truetype("/System/Library/Fonts/SF-Pro-Display-Bold.otf", 72)
                subtitle_font = ImageFont.truetype("/System/Library/Fonts/SF-Pro-Display-Medium.otf", 42)
                body_font = ImageFont.truetype("/System/Library/Fonts/SF-Pro-Text-Regular.otf", 28)
            except:
                try:
                    title_font = ImageFont.truetype("/System/Library/Fonts/Helvetica.ttc", 72)
                    subtitle_font = ImageFont.truetype("/System/Library/Fonts/Helvetica.ttc", 42)
                    body_font = ImageFont.truetype("/System/Library/Fonts/Helvetica.ttc", 28)
                except:
                    title_font = ImageFont.load_default()
                    subtitle_font = ImageFont.load_default()
                    body_font = ImageFont.load_default()
            
            # Create gradient background
            primary_color = theme["color"]
            for y in range(1080):
                # Create a subtle gradient
                r = int(10 + (y * 30 / 1080))
                g = int(14 + (y * 40 / 1080))
                b = int(39 + (y * 80 / 1080))
                draw.line([(0, y), (1920, y)], fill=(r, g, b))
            
            # Add geometric elements based on theme
            self.add_theme_elements(draw, theme["name"], primary_color)
            
            # Add title with shadow effect
            title = theme["title"]
            bbox = draw.textbbox((0, 0), title, font=title_font)
            text_width = bbox[2] - bbox[0]
            text_height = bbox[3] - bbox[1]
            
            # Center the title
            x = (1920 - text_width) // 2
            y = 400
            
            # Text shadow
            draw.text((x + 4, y + 4), title, fill='#000000', font=title_font)
            draw.text((x, y), title, fill='#ffffff', font=title_font)
            
            # Add subtitle
            subtitle = "AI Fundamentals Course • Expandia AI University"
            bbox = draw.textbbox((0, 0), subtitle, font=subtitle_font)
            text_width = bbox[2] - bbox[0]
            x = (1920 - text_width) // 2
            draw.text((x, y + 100), subtitle, fill=primary_color, font=subtitle_font)
            
            # Add lesson indicator
            lesson_text = "Lesson 1 of 8"
            bbox = draw.textbbox((0, 0), lesson_text, font=body_font)
            text_width = bbox[2] - bbox[0]
            draw.text(((1920 - text_width) // 2, 950), lesson_text, fill='#90a4ae', font=body_font)
            
            # Save the image
            filename = f"advanced_{theme['name']}_visual.png"
            img_path = self.output_dir / filename
            img.save(img_path, quality=95, optimize=True)
            
            print(f"✅ Created visual: {filename}")
            return img_path
            
        except Exception as e:
            print(f"❌ Theme visual creation failed: {e}")
            return None

    def add_theme_elements(self, draw, theme_name: str, color: str):
        """Add theme-specific visual elements"""
        import random
        import math
        
        if theme_name == "welcome":
            # Add welcome elements - neural network nodes
            for i in range(15):
                x = random.randint(100, 1820)
                y = random.randint(100, 300)
                size = random.randint(8, 20)
                draw.ellipse([x, y, x+size, y+size], fill=color, outline='#ffffff', width=2)
        
        elif theme_name == "definition":
            # Add brain-like neural connections
            centers = [(400, 200), (800, 250), (1200, 200), (1500, 300)]
            for center in centers:
                # Draw neural nodes
                draw.ellipse([center[0]-25, center[1]-25, center[0]+25, center[1]+25], 
                           fill=color, outline='#ffffff', width=3)
                # Connect to other nodes
                for other in centers:
                    if other != center:
                        draw.line([center, other], fill=color, width=2)
        
        elif theme_name == "daily_life":
            # Add tech device icons (simplified)
            devices = [(300, 200), (600, 180), (900, 220), (1200, 200), (1500, 180)]
            for device in devices:
                # Simple device representation
                draw.rectangle([device[0]-40, device[1]-30, device[0]+40, device[1]+30], 
                             fill=color, outline='#ffffff', width=2)
                draw.ellipse([device[0]-10, device[1]-10, device[0]+10, device[1]+10], 
                           fill='#ffffff')
        
        elif theme_name == "pillars":
            # Draw three pillars
            pillar_positions = [480, 960, 1440]
            for i, x in enumerate(pillar_positions):
                # Draw pillar
                draw.rectangle([x-60, 150, x+60, 350], fill=color, outline='#ffffff', width=3)
                # Add pillar labels
                labels = ["DATA", "ALGORITHMS", "COMPUTE"]
                draw.text((x-30, 320), labels[i], fill='#ffffff')
        
        elif theme_name == "patterns":
            # Add pattern recognition visualization
            for i in range(30):
                x = random.randint(200, 1720)
                y = random.randint(150, 350)
                size = random.randint(5, 15)
                opacity = random.randint(100, 255)
                # Create connected dots pattern
                draw.ellipse([x, y, x+size, y+size], fill=color)
        
        elif theme_name == "future":
            # Add futuristic elements
            for i in range(8):
                x = 200 + i * 200
                y = 200 + math.sin(i * 0.5) * 50
                # Futuristic shapes
                points = [
                    (x, y), (x+30, y-20), (x+60, y), (x+30, y+20)
                ]
                draw.polygon(points, fill=color, outline='#ffffff', width=2)

    def create_professional_video(self) -> bool:
        """Create the complete professional video"""
        try:
            print("🎬 Creating professional AI lesson video...")
            
            # Generate high-quality voice narration
            audio_file = "lesson_1_advanced_audio.mp3"
            if not self.generate_professional_voice(self.full_script, audio_file):
                return False
            
            # Create professional visuals
            print("🎨 Creating professional visuals...")
            visuals = self.create_professional_visuals()
            
            if not visuals:
                print("❌ No visuals created")
                return False
            
            # Create video with cycling visuals
            video_file = self.output_dir / "lesson_1_what_is_artificial_intelligence_PROFESSIONAL.mp4"
            audio_path = self.output_dir / audio_file
            
            # Get audio duration
            result = subprocess.run([
                'ffprobe', '-v', 'quiet', '-show_entries', 'format=duration',
                '-of', 'default=noprint_wrappers=1:nokey=1', str(audio_path)
            ], capture_output=True, text=True)
            
            audio_duration = float(result.stdout.strip())
            visual_duration = audio_duration / len(visuals)
            
            print(f"📊 Audio duration: {audio_duration:.1f}s, {len(visuals)} visuals")
            
            # Create video segments for each visual
            temp_dir = Path(tempfile.mkdtemp())
            segments = []
            
            for i, visual in enumerate(visuals):
                segment_file = temp_dir / f"segment_{i}.mp4"
                
                # Create video segment with fade transitions
                subprocess.run([
                    'ffmpeg', '-loop', '1', '-i', str(visual),
                    '-t', str(visual_duration), '-pix_fmt', 'yuv420p',
                    '-vf', f'scale=1920:1080,fade=in:0:30,fade=out:st={visual_duration-1}:d=30',
                    '-r', '30', '-y', str(segment_file)
                ], check=True, capture_output=True)
                
                segments.append(segment_file)
            
            # Combine all segments
            concat_file = temp_dir / "concat.txt"
            with open(concat_file, 'w') as f:
                for segment in segments:
                    f.write(f"file '{segment.absolute()}'\n")
            
            # Create combined video
            combined_video = temp_dir / "combined.mp4"
            subprocess.run([
                'ffmpeg', '-f', 'concat', '-safe', '0', '-i', str(concat_file),
                '-c', 'copy', '-y', str(combined_video)
            ], check=True, capture_output=True)
            
            # Add audio to video
            subprocess.run([
                'ffmpeg', '-i', str(combined_video), '-i', str(audio_path),
                '-c:v', 'copy', '-c:a', 'aac', '-b:a', '256k',
                '-shortest', '-y', str(video_file)
            ], check=True, capture_output=True)
            
            print(f"✅ Created professional video: {video_file.name}")
            print(f"📁 Video size: {video_file.stat().st_size / 1024 / 1024:.1f} MB")
            print(f"⏱️  Duration: {audio_duration:.1f} seconds")
            
            return True
            
        except subprocess.CalledProcessError as e:
            print(f"❌ Video creation failed: {e}")
            return False
        except Exception as e:
            print(f"❌ Unexpected error: {e}")
            return False

def main():
    print("🚀 Advanced AI Lesson Generator - Professional Edition")
    print("Creating high-quality 'What is Artificial Intelligence?' course...")
    print("=" * 80)
    
    generator = AdvancedAILessonGeneratorFixed()
    
    # Check dependencies
    try:
        subprocess.run(['ffmpeg', '-version'], capture_output=True, check=True)
        print("✅ FFmpeg available")
    except:
        print("❌ FFmpeg not found - please install: brew install ffmpeg")
        return
    
    try:
        from PIL import Image
        print("✅ PIL/Pillow available")
    except ImportError:
        print("❌ PIL/Pillow not found - please install: pip install Pillow")
        return
    
    print("\n🎬 Generating professional AI lesson...")
    
    if generator.create_professional_video():
        print("\n🎉 Professional AI Lesson Complete!")
        print("✅ High-quality voice synthesis (Albert voice)")
        print("✅ Professional visual design with themes")
        print("✅ Smooth video transitions and effects")
        print("✅ Full 10-minute comprehensive content")
        print("\n📚 Ready for your AI University!")
    else:
        print("❌ Failed to generate professional lesson")

if __name__ == "__main__":
    main() 