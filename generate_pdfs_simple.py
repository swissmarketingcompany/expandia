#!/usr/bin/env python3
"""
Simple PDF Generation Script for Expandia Resources
Converts markdown files to beautiful PDFs using xhtml2pdf
"""

import os
import sys
from pathlib import Path
import markdown
from xhtml2pdf import pisa
import argparse
import logging
from datetime import datetime
import io

# Configure logging
logging.basicConfig(level=logging.INFO, format='%(asctime)s - %(levelname)s - %(message)s')
logger = logging.getLogger(__name__)

class SimplePDFGenerator:
    def __init__(self, downloads_dir="downloads", output_dir="pdfs"):
        self.downloads_dir = Path(downloads_dir)
        self.output_dir = Path(output_dir)
        self.output_dir.mkdir(exist_ok=True)
        
        # Configure markdown extensions for better rendering
        self.md_extensions = [
            'extra',
            'codehilite',
            'toc',
            'tables',
            'fenced_code'
        ]
        
    def get_css_styles(self):
        """Return comprehensive CSS styles for beautiful PDF formatting"""
        return """
        @page {
            size: A4;
            margin: 2cm;
            @top-center {
                content: "Expandia - AI Solutions & Resources";
                font-family: Arial, sans-serif;
                font-size: 10px;
                color: #666;
            }
            @bottom-right {
                content: "Page " counter(page);
                font-family: Arial, sans-serif;
                font-size: 10px;
                color: #666;
            }
        }
        
        /* Base typography */
        body {
            font-family: Arial, sans-serif;
            font-size: 12px;
            line-height: 1.6;
            color: #2c3e50;
            margin: 0;
            padding: 20px;
        }
        
        /* Headings */
        h1, h2, h3, h4, h5, h6 {
            font-family: Arial, sans-serif;
            font-weight: bold;
            line-height: 1.3;
            margin-top: 1.5em;
            margin-bottom: 0.8em;
            color: #1a202c;
            page-break-after: avoid;
        }
        
        h1 {
            font-size: 24px;
            color: #2d5a27;
            margin-bottom: 0.5em;
            padding-bottom: 0.5em;
            border-bottom: 2px solid #2d5a27;
        }
        
        h2 {
            font-size: 18px;
            color: #2d5a27;
            margin-top: 2em;
        }
        
        h3 {
            font-size: 16px;
            color: #34495e;
        }
        
        h4 {
            font-size: 14px;
            color: #34495e;
        }
        
        h5, h6 {
            font-size: 12px;
            color: #34495e;
        }
        
        /* Paragraphs and text */
        p {
            margin-bottom: 1em;
            text-align: justify;
        }
        
        strong, b {
            font-weight: bold;
            color: #1a202c;
        }
        
        em, i {
            font-style: italic;
        }
        
        /* Links */
        a {
            color: #2d5a27;
            text-decoration: underline;
        }
        
        /* Lists */
        ul, ol {
            margin: 1em 0;
            padding-left: 2em;
        }
        
        li {
            margin-bottom: 0.5em;
            line-height: 1.6;
        }
        
        /* Code blocks */
        code {
            font-family: 'Courier New', monospace;
            font-size: 11px;
            background-color: #f8f9fa;
            padding: 2px 4px;
            border: 1px solid #e9ecef;
        }
        
        pre {
            font-family: 'Courier New', monospace;
            font-size: 10px;
            background-color: #f8f9fa;
            border: 1px solid #e9ecef;
            padding: 10px;
            margin: 1em 0;
            overflow-x: auto;
            page-break-inside: avoid;
        }
        
        pre code {
            background: none;
            padding: 0;
            border: none;
        }
        
        /* Tables */
        table {
            width: 100%;
            border-collapse: collapse;
            margin: 1em 0;
            font-size: 11px;
            page-break-inside: avoid;
        }
        
        th, td {
            border: 1px solid #dee2e6;
            padding: 8px;
            text-align: left;
            vertical-align: top;
        }
        
        th {
            background-color: #2d5a27;
            color: white;
            font-weight: bold;
        }
        
        tr:nth-child(even) {
            background-color: #f8f9fa;
        }
        
        /* Blockquotes */
        blockquote {
            margin: 1em 0;
            padding: 1em;
            border-left: 4px solid #2d5a27;
            background-color: #f8f9fa;
            font-style: italic;
        }
        
        /* Horizontal rules */
        hr {
            border: none;
            height: 1px;
            background-color: #2d5a27;
            margin: 2em 0;
        }
        
        /* Cover page styling */
        .cover-page {
            text-align: center;
            padding: 100px 20px;
            page-break-after: always;
        }
        
        .cover-page h1 {
            font-size: 32px;
            margin-bottom: 0.5em;
            border: none;
            padding: 0;
        }
        
        .cover-page .subtitle {
            font-size: 16px;
            color: #666;
            margin-bottom: 2em;
        }
        
        .cover-page .logo {
            margin: 2em 0;
            font-size: 36px;
            color: #2d5a27;
            font-weight: bold;
        }
        
        .cover-page .footer {
            margin-top: 3em;
            font-size: 12px;
            color: #666;
        }
        
        /* Page breaks */
        .page-break {
            page-break-before: always;
        }
        
        /* Prevent orphans and widows */
        h1, h2, h3, h4, h5, h6 {
            page-break-after: avoid;
        }
        """
    
    def convert_markdown_to_html(self, md_content, title="Document"):
        """Convert markdown content to HTML with proper styling"""
        
        # Initialize markdown processor
        md = markdown.Markdown(extensions=self.md_extensions, extension_configs={
            'codehilite': {
                'css_class': 'codehilite',
                'use_pygments': False  # Disable pygments for simpler styling
            },
            'toc': {
                'title': 'Table of Contents'
            }
        })
        
        # Convert markdown to HTML
        html_content = md.convert(md_content)
        
        # Create full HTML document
        full_html = f"""
        <!DOCTYPE html>
        <html lang="en">
        <head>
            <meta charset="UTF-8">
            <title>{title}</title>
            <style>
                {self.get_css_styles()}
            </style>
        </head>
        <body>
            <div class="cover-page">
                <h1>{title}</h1>
                <div class="subtitle">Comprehensive AI Implementation Guide</div>
                <div class="logo">EXPANDIA</div>
                <div style="font-size: 14px; color: #666;">AI Solutions & Consulting</div>
                <div class="footer">
                    <p>Generated on {self.get_current_date()}</p>
                    <p>© 2024 Expandia - Your Partner in AI Transformation</p>
                </div>
            </div>
            
            <div class="main-content">
                {html_content}
            </div>
        </body>
        </html>
        """
        
        return full_html
    
    def get_current_date(self):
        """Get current date in readable format"""
        return datetime.now().strftime("%B %d, %Y")
    
    def generate_pdf_from_markdown(self, md_file_path, output_name=None):
        """Generate PDF from a markdown file"""
        
        md_path = Path(md_file_path)
        if not md_path.exists():
            logger.error(f"Markdown file not found: {md_file_path}")
            return False
        
        # Read markdown content
        try:
            with open(md_path, 'r', encoding='utf-8') as f:
                md_content = f.read()
        except Exception as e:
            logger.error(f"Error reading markdown file: {e}")
            return False
        
        # Generate output filename
        if output_name is None:
            output_name = md_path.stem + '.pdf'
        
        output_path = self.output_dir / output_name
        
        # Extract title from filename or content
        title = md_path.stem.replace('-', ' ').replace('_', ' ').title()
        
        # Convert to HTML
        html_content = self.convert_markdown_to_html(md_content, title)
        
        # Generate PDF
        try:
            logger.info(f"Generating PDF: {output_path}")
            
            with open(output_path, 'wb') as pdf_file:
                pisa_status = pisa.CreatePDF(
                    html_content.encode('utf-8'),
                    dest=pdf_file,
                    encoding='utf-8'
                )
            
            if pisa_status.err:
                logger.error(f"Error generating PDF: {pisa_status.err}")
                return False
            
            logger.info(f"✅ Successfully generated: {output_path}")
            return True
            
        except Exception as e:
            logger.error(f"Error generating PDF: {e}")
            return False
    
    def generate_all_pdfs(self):
        """Generate PDFs for all markdown files in downloads directory"""
        
        if not self.downloads_dir.exists():
            logger.error(f"Downloads directory not found: {self.downloads_dir}")
            return
        
        # Find all markdown files
        md_files = list(self.downloads_dir.glob('*.md'))
        
        if not md_files:
            logger.warning(f"No markdown files found in {self.downloads_dir}")
            return
        
        logger.info(f"Found {len(md_files)} markdown files to convert")
        
        success_count = 0
        for md_file in md_files:
            if self.generate_pdf_from_markdown(md_file):
                success_count += 1
        
        logger.info(f"✅ Successfully generated {success_count}/{len(md_files)} PDFs")
        logger.info(f"📁 PDFs saved to: {self.output_dir.absolute()}")

def main():
    """Main function with command line interface"""
    
    parser = argparse.ArgumentParser(description='Generate beautiful PDFs from markdown files')
    parser.add_argument('--input', '-i', help='Input markdown file path')
    parser.add_argument('--output', '-o', help='Output PDF file name')
    parser.add_argument('--downloads-dir', '-d', default='downloads', help='Downloads directory path')
    parser.add_argument('--output-dir', '-p', default='pdfs', help='Output directory for PDFs')
    parser.add_argument('--all', '-a', action='store_true', help='Generate PDFs for all markdown files')
    
    args = parser.parse_args()
    
    # Initialize PDF generator
    pdf_gen = SimplePDFGenerator(args.downloads_dir, args.output_dir)
    
    if args.all or not args.input:
        # Generate all PDFs
        pdf_gen.generate_all_pdfs()
    else:
        # Generate single PDF
        pdf_gen.generate_pdf_from_markdown(args.input, args.output)

if __name__ == "__main__":
    main() 