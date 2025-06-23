#!/usr/bin/env python3
"""
Advanced AI Lesson 1 Generator
Creates a professional "What is Artificial Intelligence?" course with:
- Realistic visuals and animations
- High-quality voice synthesis
- Professional video production
- Multiple visual scenes and transitions
"""

import os
import json
import requests
import time
from pathlib import Path
import subprocess
from typing import Dict, List, Optional
import tempfile

class AdvancedAILessonGenerator:
    def __init__(self):
        self.output_dir = Path("course_videos")
        self.output_dir.mkdir(exist_ok=True)
        
        # Detailed lesson structure with multiple scenes
        self.lesson = {
            "title": "What is Artificial Intelligence?",
            "duration": 600,  # 10 minutes
            "scenes": [
                {
                    "time": 0,
                    "duration": 60,
                    "title": "Welcome & Introduction",
                    "script": """
                    Welcome to AI Fundamentals! I'm your instructor, and today we're embarking on an exciting journey to understand one of the most transformative technologies of our time: Artificial Intelligence.
                    
                    Over the next ten minutes, we'll explore what AI really is, how it works, and why it's revolutionizing every aspect of our lives. By the end of this lesson, you'll have a clear understanding of AI fundamentals that will serve as your foundation for mastering this incredible technology.
                    """,
                    "visuals": ["welcome_intro", "ai_logo_animation", "course_overview"]
                },
                {
                    "time": 60,
                    "duration": 90,
                    "title": "What is AI? - Core Definition",
                    "script": """
                    So, what exactly IS Artificial Intelligence? At its most fundamental level, AI is the development of computer systems that can perform tasks typically requiring human intelligence. But that's just scratching the surface.
                    
                    Think of AI as teaching machines to think, learn, and make decisions. It's about creating systems that can perceive their environment, understand complex information, reason through problems, and take actions to achieve specific goals.
                    
                    The key insight is this: AI isn't about creating human-like robots. It's about augmenting and amplifying human capabilities through intelligent automation.
                    """,
                    "visuals": ["ai_definition", "brain_computer_comparison", "human_ai_collaboration"]
                },
                {
                    "time": 150,
                    "duration": 120,
                    "title": "AI in Your Daily Life",
                    "script": """
                    You might think AI is futuristic technology, but the truth is, you're already interacting with AI dozens of times every day. Let me show you.
                    
                    When you unlock your phone with face recognition, that's AI analyzing your facial features in real-time. When you ask Siri or Google Assistant for directions, that's AI processing natural language and understanding your intent. When Netflix suggests your next binge-watch, that's AI analyzing your viewing patterns and preferences.
                    
                    Your email automatically filters spam, your car's GPS reroutes you around traffic, and your online shopping experience is personalized - all powered by AI. Even your smartphone's camera automatically adjusts settings for the perfect photo using AI algorithms.
                    
                    AI isn't coming to your life - it's already here, working invisibly to make your daily experiences smoother and more efficient.
                    """,
                    "visuals": ["daily_ai_examples", "smartphone_ai", "smart_home", "personalized_experiences"]
                },
                {
                    "time": 270,
                    "duration": 120,
                    "title": "How AI Actually Works",
                    "script": """
                    But how does AI actually work? It's built on three fundamental pillars: data, algorithms, and computing power.
                    
                    Data is the fuel that powers AI. Just like humans learn from experience, AI systems learn from vast amounts of data. The more quality data an AI system has, the better it can perform.
                    
                    Algorithms are the mathematical recipes that process this data. These are sophisticated mathematical models that can identify patterns, make predictions, and optimize decisions based on the information they've learned.
                    
                    Computing power makes it all possible at scale. Modern AI requires massive computational resources to process millions of data points and make split-second decisions.
                    
                    Here's what makes AI different from traditional programming: Instead of writing explicit rules for every scenario, we train AI systems to recognize patterns and make decisions based on examples. It's like teaching a child to recognize cats by showing them thousands of cat pictures, but AI can process millions of examples in minutes.
                    """,
                    "visuals": ["ai_pillars", "data_flow", "algorithm_visualization", "pattern_recognition"]
                },
                {
                    "time": 390,
                    "duration": 90,
                    "title": "AI's Superpower - Pattern Recognition",
                    "script": """
                    The real power of AI lies in its ability to find patterns humans might miss. This capability is already transforming industries in remarkable ways.
                    
                    In medicine, AI can detect early signs of cancer in medical scans that even experienced radiologists might overlook. Google's AI system can identify diabetic retinopathy from eye photographs, potentially preventing blindness in millions of patients.
                    
                    In finance, AI spots fraudulent transactions among millions of daily purchases by recognizing subtle patterns in spending behavior. In agriculture, AI analyzes satellite imagery to optimize crop yields and predict harvest times.
                    
                    This pattern recognition capability allows AI to make sense of complex, unstructured data at a scale and speed that's simply impossible for humans.
                    """,
                    "visuals": ["pattern_recognition_demo", "medical_ai", "fraud_detection", "agricultural_ai"]
                },
                {
                    "time": 480,
                    "duration": 120,
                    "title": "The Future of AI",
                    "script": """
                    Looking ahead, AI will become even more integrated into our daily lives, but here's what's important to understand: we're still in the early stages.
                    
                    Current AI is what we call "narrow" - each system excels at specific tasks but can't transfer knowledge between domains. Your chess-playing AI can't suddenly start composing music or diagnosing diseases.
                    
                    The future holds exciting possibilities: AI tutors providing personalized education, autonomous vehicles revolutionizing transportation, and AI assistants that truly understand context and nuance.
                    
                    But remember, the goal isn't to replace human intelligence - it's to augment it. AI handles routine, data-intensive tasks, freeing us to focus on creativity, empathy, complex problem-solving, and the uniquely human aspects of work and life.
                    
                    As we continue this course, you'll discover how to harness AI's power for your own projects and business. The future belongs to those who understand and embrace these technologies thoughtfully.
                    
                    In our next lesson, we'll explore the different types of AI and dive deep into machine learning. Get ready to discover how machines actually learn and evolve!
                    """,
                    "visuals": ["future_ai", "human_ai_partnership", "next_lesson_preview"]
                }
            ]
        }

    def generate_realistic_voice(self, text: str, filename: str) -> bool:
        """Generate high-quality voice using multiple methods"""
        try:
            # Method 1: Try ElevenLabs if API key is available
            if os.getenv('ELEVENLABS_API_KEY'):
                return self.generate_elevenlabs_voice(text, filename)
            
            # Method 2: Try using better macOS voices
            return self.generate_enhanced_system_voice(text, filename)
            
        except Exception as e:
            print(f"❌ Voice generation error: {e}")
            return False

    def generate_elevenlabs_voice(self, text: str, filename: str) -> bool:
        """Generate voice using ElevenLabs API"""
        try:
            api_key = os.getenv('ELEVENLABS_API_KEY')
            # Use a professional voice ID (Adam - professional male voice)
            voice_id = "pNInz6obpgDQGcFmaJgB"  
            
            url = f"https://api.elevenlabs.io/v1/text-to-speech/{voice_id}"
            
            headers = {
                "Accept": "audio/mpeg",
                "Content-Type": "application/json",
                "xi-api-key": api_key
            }
            
            data = {
                "text": text,
                "model_id": "eleven_monolingual_v1",
                "voice_settings": {
                    "stability": 0.7,
                    "similarity_boost": 0.8,
                    "style": 0.3,
                    "use_speaker_boost": True
                }
            }
            
            response = requests.post(url, json=data, headers=headers)
            
            if response.status_code == 200:
                with open(self.output_dir / filename, 'wb') as f:
                    f.write(response.content)
                print(f"✅ Generated ElevenLabs voice: {filename}")
                return True
            else:
                print(f"❌ ElevenLabs API error: {response.status_code}")
                return False
                
        except Exception as e:
            print(f"❌ ElevenLabs generation failed: {e}")
            return False

    def generate_enhanced_system_voice(self, text: str, filename: str) -> bool:
        """Generate voice using enhanced system TTS"""
        try:
            audio_file = self.output_dir / filename
            
            # Try different high-quality voices available on macOS
            voices = ['Samantha', 'Alex', 'Victoria', 'Daniel', 'Karen']
            
            for voice in voices:
                try:
                    # Test if voice is available
                    test_result = subprocess.run([
                        'say', '-v', voice, '-o', '/dev/null', 'test'
                    ], capture_output=True)
                    
                    if test_result.returncode == 0:
                        # Use this voice with enhanced settings
                        subprocess.run([
                            'say', '-v', voice, '-r', '175', '-o', 
                            str(audio_file.with_suffix('.aiff')), text
                        ], check=True)
                        
                        # Convert to high-quality MP3
                        subprocess.run([
                            'ffmpeg', '-i', str(audio_file.with_suffix('.aiff')),
                            '-codec:a', 'libmp3lame', '-b:a', '256k',
                            '-ar', '44100', '-y', str(audio_file)
                        ], check=True, capture_output=True)
                        
                        os.remove(audio_file.with_suffix('.aiff'))
                        print(f"✅ Generated enhanced system voice ({voice}): {filename}")
                        return True
                        
                except subprocess.CalledProcessError:
                    continue
            
            print(f"❌ No suitable voice found")
            return False
            
        except Exception as e:
            print(f"❌ Enhanced system voice generation failed: {e}")
            return False

    def create_realistic_visual(self, visual_name: str, scene_info: dict) -> bool:
        """Create realistic visuals using multiple methods"""
        try:
            # Method 1: Try DALL-E if API key is available
            if os.getenv('OPENAI_API_KEY'):
                return self.generate_dalle_visual(visual_name, scene_info)
            
            # Method 2: Create enhanced educational visuals
            return self.create_enhanced_visual(visual_name, scene_info)
            
        except Exception as e:
            print(f"❌ Visual generation error: {e}")
            return False

    def generate_dalle_visual(self, visual_name: str, scene_info: dict) -> bool:
        """Generate realistic visuals using DALL-E 3"""
        try:
            api_key = os.getenv('OPENAI_API_KEY')
            
            # Detailed prompts for realistic visuals
            prompts = {
                "welcome_intro": "Professional AI instructor in modern classroom, holographic AI brain floating above desk, students with laptops, futuristic but realistic, cinematic lighting, 4K quality",
                "ai_logo_animation": "Sleek AI logo with neural network connections, glowing nodes, modern tech aesthetic, blue and silver color scheme, professional design",
                "course_overview": "Infographic showing AI learning path, connected modules, progress indicators, modern flat design, educational style",
                "ai_definition": "Split-screen showing human brain and computer processor, connected by flowing data streams, representing AI concept, photorealistic, high detail",
                "brain_computer_comparison": "Side-by-side comparison of human brain neurons and computer neural network, glowing connections, scientific illustration style",
                "human_ai_collaboration": "Business team working with AI assistant hologram, modern office, collaborative atmosphere, professional photography style",
                "daily_ai_examples": "Collage of AI in daily life: smartphone, smart car, voice assistant, recommendation systems, clean modern design",
                "smartphone_ai": "Person using smartphone with AI features highlighted, face recognition, voice commands, visual overlays showing AI processing",
                "smart_home": "Modern smart home interior with AI devices, automated lighting, voice assistants, IoT sensors, warm and inviting",
                "personalized_experiences": "Multiple screens showing personalized content, Netflix recommendations, shopping suggestions, news feeds, modern UI design",
                "ai_pillars": "Three pillars visualization: Data (flowing streams), Algorithms (mathematical equations), Computing Power (server farms), architectural style",
                "data_flow": "Animated data streams flowing through neural networks, particle effects, blue and white color scheme, abstract but clear",
                "algorithm_visualization": "Mathematical equations transforming into visual patterns, code becoming art, algorithmic beauty, educational illustration",
                "pattern_recognition": "AI system identifying patterns in complex data, highlighted connections, visual analysis, scientific visualization",
                "pattern_recognition_demo": "Before/after comparison showing AI finding hidden patterns in data, clear visual distinction, educational style",
                "medical_ai": "AI analyzing medical scans, highlighting areas of concern, doctor reviewing results, hospital setting, professional medical imagery",
                "fraud_detection": "AI monitoring financial transactions, suspicious activities highlighted, cybersecurity theme, digital forensics style",
                "agricultural_ai": "Drone surveying crops, AI analyzing plant health, satellite imagery, precision agriculture, environmental monitoring",
                "future_ai": "Futuristic cityscape with AI integration, autonomous vehicles, smart buildings, holographic displays, optimistic future vision",
                "human_ai_partnership": "Humans and AI working together, complementary skills highlighted, collaborative workspace, positive interaction",
                "next_lesson_preview": "Teaser for next lesson showing types of AI, machine learning concepts, educational preview style"
            }
            
            prompt = prompts.get(visual_name, f"Professional educational illustration about {scene_info['title']}, high quality, realistic style")
            
            headers = {
                "Authorization": f"Bearer {api_key}",
                "Content-Type": "application/json"
            }
            
            data = {
                "model": "dall-e-3",
                "prompt": prompt,
                "n": 1,
                "size": "1792x1024",  # Widescreen format for video
                "quality": "hd",
                "style": "natural"
            }
            
            response = requests.post(
                "https://api.openai.com/v1/images/generations",
                headers=headers,
                json=data
            )
            
            if response.status_code == 200:
                image_url = response.json()['data'][0]['url']
                
                # Download the image
                img_response = requests.get(image_url)
                if img_response.status_code == 200:
                    with open(self.output_dir / f"{visual_name}.png", 'wb') as f:
                        f.write(img_response.content)
                    print(f"✅ Generated DALL-E visual: {visual_name}.png")
                    return True
            
            print(f"❌ DALL-E API error: {response.status_code}")
            return False
            
        except Exception as e:
            print(f"❌ DALL-E generation failed: {e}")
            return False

    def create_enhanced_visual(self, visual_name: str, scene_info: dict) -> bool:
        """Create enhanced educational visuals"""
        try:
            from PIL import Image, ImageDraw, ImageFont, ImageFilter
            import random
            
            # Create high-resolution image
            img = Image.new('RGB', (1792, 1024), color='#0a0e27')
            draw = ImageDraw.Draw(img)
            
            # Try to use better fonts
            try:
                title_font = ImageFont.truetype("/System/Library/Fonts/SF-Pro-Display-Bold.otf", 64)
                subtitle_font = ImageFont.truetype("/System/Library/Fonts/SF-Pro-Display-Medium.otf", 36)
                body_font = ImageFont.truetype("/System/Library/Fonts/SF-Pro-Text-Regular.otf", 24)
            except:
                try:
                    title_font = ImageFont.truetype("/System/Library/Fonts/Helvetica.ttc", 64)
                    subtitle_font = ImageFont.truetype("/System/Library/Fonts/Helvetica.ttc", 36)
                    body_font = ImageFont.truetype("/System/Library/Fonts/Helvetica.ttc", 24)
                except:
                    title_font = ImageFont.load_default()
                    subtitle_font = ImageFont.load_default()
                    body_font = ImageFont.load_default()
            
            # Create gradient background
            for y in range(1024):
                r = int(10 + (y * 20 / 1024))
                g = int(14 + (y * 30 / 1024))
                b = int(39 + (y * 60 / 1024))
                draw.line([(0, y), (1792, y)], fill=(r, g, b))
            
            # Add title
            title = scene_info['title']
            bbox = draw.textbbox((0, 0), title, font=title_font)
            text_width = bbox[2] - bbox[0]
            
            # Add text shadow
            draw.text(((1792 - text_width) // 2 + 3, 203), title, fill='#000000', font=title_font)
            draw.text(((1792 - text_width) // 2, 200), title, fill='#ffffff', font=title_font)
            
            # Add subtitle
            subtitle = "AI Fundamentals Course"
            bbox = draw.textbbox((0, 0), subtitle, font=subtitle_font)
            text_width = bbox[2] - bbox[0]
            draw.text(((1792 - text_width) // 2, 280), subtitle, fill='#64b5f6', font=subtitle_font)
            
            # Create visual elements based on the scene
            if "ai" in visual_name or "brain" in visual_name:
                # Draw neural network
                nodes = []
                for layer in range(4):
                    layer_nodes = []
                    node_count = 6 - layer if layer < 2 else 3 + layer
                    for i in range(node_count):
                        x = 300 + layer * 300
                        y = 400 + i * 60 - (node_count * 30)
                        layer_nodes.append((x, y))
                        # Draw node
                        draw.ellipse([x-15, y-15, x+15, y+15], fill='#42a5f5', outline='#1976d2', width=2)
                    nodes.append(layer_nodes)
                
                # Draw connections
                for i in range(len(nodes) - 1):
                    for node1 in nodes[i]:
                        for node2 in nodes[i + 1]:
                            opacity = random.randint(50, 150)
                            draw.line([node1, node2], fill=f'rgba(100, 181, 246, {opacity})', width=1)
            
            elif "data" in visual_name or "flow" in visual_name:
                # Draw data flow visualization
                for i in range(20):
                    x = random.randint(100, 1692)
                    y = random.randint(400, 800)
                    size = random.randint(5, 15)
                    color = random.choice(['#42a5f5', '#66bb6a', '#ef5350', '#ffa726'])
                    draw.ellipse([x, y, x+size, y+size], fill=color)
            
            elif "future" in visual_name:
                # Draw futuristic elements
                for i in range(10):
                    x = random.randint(200, 1592)
                    y = random.randint(500, 900)
                    w = random.randint(50, 150)
                    h = random.randint(20, 60)
                    draw.rectangle([x, y, x+w, y+h], fill='#1e88e5', outline='#42a5f5', width=2)
            
            # Add branding
            brand_text = "Expandia AI University"
            bbox = draw.textbbox((0, 0), brand_text, font=body_font)
            text_width = bbox[2] - bbox[0]
            draw.text(((1792 - text_width) // 2, 950), brand_text, fill='#90a4ae', font=body_font)
            
            # Add some blur for depth
            img = img.filter(ImageFilter.GaussianBlur(radius=0.5))
            
            img.save(self.output_dir / f"{visual_name}.png", quality=95)
            print(f"✅ Generated enhanced visual: {visual_name}.png")
            return True
            
        except Exception as e:
            print(f"❌ Enhanced visual generation failed: {e}")
            return False

    def create_professional_video(self) -> bool:
        """Create a professional video with multiple scenes and transitions"""
        try:
            video_file = self.output_dir / "lesson_1_what_is_artificial_intelligence_ADVANCED.mp4"
            
            # Generate audio for each scene
            scene_audio_files = []
            for i, scene in enumerate(self.lesson['scenes']):
                audio_file = f"scene_{i+1}_audio.mp3"
                if self.generate_realistic_voice(scene['script'], audio_file):
                    scene_audio_files.append(self.output_dir / audio_file)
                else:
                    print(f"❌ Failed to generate audio for scene {i+1}")
                    return False
            
            # Generate visuals for each scene
            for scene in self.lesson['scenes']:
                for visual in scene['visuals']:
                    if not (self.output_dir / f"{visual}.png").exists():
                        self.create_realistic_visual(visual, scene)
            
            # Combine all audio files
            combined_audio = self.output_dir / "lesson_1_complete_audio.mp3"
            self.combine_audio_files(scene_audio_files, combined_audio)
            
            # Create video segments for each scene
            video_segments = []
            current_time = 0
            
            for i, scene in enumerate(self.lesson['scenes']):
                # Use the first visual for each scene (could be enhanced to cycle through visuals)
                main_visual = self.output_dir / f"{scene['visuals'][0]}.png"
                if not main_visual.exists():
                    main_visual = self.output_dir / f"{scene['visuals'][0]}.png"
                
                segment_file = self.output_dir / f"segment_{i+1}.mp4"
                
                # Create video segment with proper duration
                subprocess.run([
                    'ffmpeg', '-loop', '1', '-i', str(main_visual),
                    '-t', str(scene['duration']), '-pix_fmt', 'yuv420p',
                    '-vf', 'scale=1920:1080:force_original_aspect_ratio=decrease,pad=1920:1080:(ow-iw)/2:(oh-ih)/2,fade=in:0:30,fade=out:st=' + str(scene['duration']-2) + ':d=2',
                    '-y', str(segment_file)
                ], check=True, capture_output=True)
                
                video_segments.append(segment_file)
            
            # Combine video segments
            temp_dir = Path(tempfile.mkdtemp())
            concat_file = temp_dir / "concat.txt"
            
            with open(concat_file, 'w') as f:
                for segment in video_segments:
                    f.write(f"file '{segment.absolute()}'\n")
            
            # Combine video
            video_only = temp_dir / "video_combined.mp4"
            subprocess.run([
                'ffmpeg', '-f', 'concat', '-safe', '0', '-i', str(concat_file),
                '-c', 'copy', '-y', str(video_only)
            ], check=True, capture_output=True)
            
            # Add audio to combined video
            subprocess.run([
                'ffmpeg', '-i', str(video_only), '-i', str(combined_audio),
                '-c:v', 'copy', '-c:a', 'aac', '-b:a', '192k',
                '-shortest', '-y', str(video_file)
            ], check=True, capture_output=True)
            
            # Cleanup
            for segment in video_segments:
                segment.unlink()
            for audio_file in scene_audio_files:
                audio_file.unlink()
            
            print(f"✅ Created professional video: {video_file.name}")
            return True
            
        except subprocess.CalledProcessError as e:
            print(f"❌ Video creation failed: {e}")
            return False
        except Exception as e:
            print(f"❌ Unexpected error: {e}")
            return False

    def combine_audio_files(self, audio_files: List[Path], output_file: Path):
        """Combine multiple audio files with crossfades"""
        try:
            # Create a temporary file list for ffmpeg
            temp_dir = Path(tempfile.mkdtemp())
            list_file = temp_dir / "audio_list.txt"
            
            with open(list_file, 'w') as f:
                for audio_file in audio_files:
                    f.write(f"file '{audio_file.absolute()}'\n")
            
            # Combine with crossfades
            subprocess.run([
                'ffmpeg', '-f', 'concat', '-safe', '0', '-i', str(list_file),
                '-af', 'acrossfade=d=1', '-y', str(output_file)
            ], check=True, capture_output=True)
            
        except subprocess.CalledProcessError:
            # Fallback to simple concatenation
            subprocess.run([
                'ffmpeg', '-f', 'concat', '-safe', '0', '-i', str(list_file),
                '-c', 'copy', '-y', str(output_file)
            ], check=True, capture_output=True)

    def generate_advanced_lesson(self):
        """Generate the complete advanced AI lesson"""
        print("🎬 Generating Advanced AI Lesson 1: What is Artificial Intelligence?")
        print("=" * 80)
        
        print("🎵 Generating realistic voice narration for each scene...")
        print("🎨 Creating professional visuals...")
        print("🎬 Producing high-quality video...")
        
        if self.create_professional_video():
            print("\n🎉 Advanced AI Lesson 1 Complete!")
            print("✅ Professional voice synthesis")
            print("✅ Realistic visuals and animations")  
            print("✅ Multi-scene video production")
            print("✅ Smooth transitions and effects")
            print(f"📁 Video saved to: {self.output_dir / 'lesson_1_what_is_artificial_intelligence_ADVANCED.mp4'}")
        else:
            print("❌ Failed to generate advanced lesson")

def main():
    print("🚀 Advanced AI Lesson Generator")
    print("Creating professional 'What is Artificial Intelligence?' course...")
    
    generator = AdvancedAILessonGenerator()
    
    # Check for API keys
    if os.getenv('ELEVENLABS_API_KEY'):
        print("✅ ElevenLabs API key found - using professional voice synthesis")
    else:
        print("⚠️  ElevenLabs API key not found - using enhanced system TTS")
    
    if os.getenv('OPENAI_API_KEY'):
        print("✅ OpenAI API key found - using DALL-E 3 for realistic visuals")
    else:
        print("⚠️  OpenAI API key not found - using enhanced educational visuals")
    
    print("\n" + "=" * 80)
    
    # Generate the advanced lesson
    generator.generate_advanced_lesson()

if __name__ == "__main__":
    main() 