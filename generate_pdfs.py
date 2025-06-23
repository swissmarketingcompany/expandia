#!/usr/bin/env python3
"""
PDF Generation Script for Expandia Resources
Converts markdown files to beautiful PDFs using WeasyPrint
"""

import os
import sys
from pathlib import Path
import markdown
from weasyprint import HTML, CSS
from weasyprint.text.fonts import FontConfiguration
import argparse
import logging

# Configure logging
logging.basicConfig(level=logging.INFO, format='%(asctime)s - %(levelname)s - %(message)s')
logger = logging.getLogger(__name__)

class PDFGenerator:
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
            'fenced_code',
            'attr_list',
            'def_list',
            'footnotes',
            'admonition'
        ]
        
        # Initialize font configuration
        self.font_config = FontConfiguration()
        
    def get_css_styles(self):
        """Return comprehensive CSS styles for beautiful PDF formatting"""
        return """
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&family=JetBrains+Mono:wght@400;500&display=swap');
        
        /* Page setup */
        @page {
            size: A4;
            margin: 2cm 2.5cm;
            @top-center {
                content: "Expandia - AI Solutions & Resources";
                font-family: 'Inter', sans-serif;
                font-size: 10px;
                color: #666;
                padding-bottom: 1em;
                border-bottom: 1px solid #e0e0e0;
            }
            @bottom-right {
                content: "Page " counter(page);
                font-family: 'Inter', sans-serif;
                font-size: 10px;
                color: #666;
            }
        }
        
        @page :first {
            @top-center { content: ""; }
            @bottom-right { content: ""; }
        }
        
        /* Base typography */
        * {
            box-sizing: border-box;
        }
        
        body {
            font-family: 'Inter', sans-serif;
            font-size: 11px;
            line-height: 1.6;
            color: #2c3e50;
            margin: 0;
            padding: 0;
            background: white;
        }
        
        /* Headings */
        h1, h2, h3, h4, h5, h6 {
            font-family: 'Inter', sans-serif;
            font-weight: 600;
            line-height: 1.3;
            margin-top: 2em;
            margin-bottom: 1em;
            color: #1a202c;
        }
        
        h1 {
            font-size: 28px;
            font-weight: 700;
            color: #2d5a27;
            margin-bottom: 0.5em;
            padding-bottom: 0.5em;
            border-bottom: 3px solid #2d5a27;
            page-break-after: avoid;
        }
        
        h2 {
            font-size: 20px;
            font-weight: 600;
            color: #2d5a27;
            margin-top: 2.5em;
            margin-bottom: 1em;
            page-break-after: avoid;
        }
        
        h3 {
            font-size: 16px;
            font-weight: 600;
            color: #34495e;
            margin-top: 2em;
            margin-bottom: 0.8em;
            page-break-after: avoid;
        }
        
        h4 {
            font-size: 14px;
            font-weight: 500;
            color: #34495e;
            margin-top: 1.5em;
            margin-bottom: 0.5em;
        }
        
        h5, h6 {
            font-size: 12px;
            font-weight: 500;
            color: #34495e;
            margin-top: 1em;
            margin-bottom: 0.5em;
        }
        
        /* Paragraphs and text */
        p {
            margin-bottom: 1em;
            text-align: justify;
            hyphens: auto;
        }
        
        strong, b {
            font-weight: 600;
            color: #1a202c;
        }
        
        em, i {
            font-style: italic;
        }
        
        /* Links */
        a {
            color: #2d5a27;
            text-decoration: none;
            font-weight: 500;
        }
        
        a:hover {
            text-decoration: underline;
        }
        
        /* Lists */
        ul, ol {
            margin: 1em 0;
            padding-left: 1.5em;
        }
        
        li {
            margin-bottom: 0.5em;
            line-height: 1.6;
        }
        
        ul li {
            list-style-type: disc;
        }
        
        ul ul li {
            list-style-type: circle;
        }
        
        ul ul ul li {
            list-style-type: square;
        }
        
        /* Code blocks */
        code {
            font-family: 'JetBrains Mono', monospace;
            font-size: 10px;
            background-color: #f8f9fa;
            padding: 2px 4px;
            border-radius: 3px;
            color: #e83e8c;
            font-weight: 500;
        }
        
        pre {
            font-family: 'JetBrains Mono', monospace;
            font-size: 9px;
            background-color: #f8f9fa;
            border: 1px solid #e9ecef;
            border-radius: 6px;
            padding: 1em;
            margin: 1em 0;
            overflow-x: auto;
            line-height: 1.5;
            page-break-inside: avoid;
        }
        
        pre code {
            background: none;
            padding: 0;
            font-size: inherit;
            color: inherit;
        }
        
        /* Tables */
        table {
            width: 100%;
            border-collapse: collapse;
            margin: 1.5em 0;
            font-size: 10px;
            page-break-inside: avoid;
        }
        
        th, td {
            border: 1px solid #dee2e6;
            padding: 8px 12px;
            text-align: left;
            vertical-align: top;
        }
        
        th {
            background-color: #2d5a27;
            color: white;
            font-weight: 600;
            font-size: 10px;
        }
        
        tr:nth-child(even) {
            background-color: #f8f9fa;
        }
        
        /* Blockquotes */
        blockquote {
            margin: 1.5em 0;
            padding: 1em 1.5em;
            border-left: 4px solid #2d5a27;
            background-color: #f8f9fa;
            font-style: italic;
            color: #555;
        }
        
        blockquote p {
            margin-bottom: 0.5em;
        }
        
        blockquote p:last-child {
            margin-bottom: 0;
        }
        
        /* Horizontal rules */
        hr {
            border: none;
            height: 2px;
            background: linear-gradient(to right, #2d5a27, transparent);
            margin: 2em 0;
        }
        
        /* Special sections */
        .toc {
            background-color: #f8f9fa;
            border: 1px solid #dee2e6;
            border-radius: 6px;
            padding: 1.5em;
            margin: 2em 0;
            page-break-inside: avoid;
        }
        
        .toc h2 {
            margin-top: 0;
            color: #2d5a27;
            font-size: 16px;
        }
        
        .toc ul {
            margin: 0;
            padding-left: 1em;
        }
        
        .toc a {
            text-decoration: none;
            color: #34495e;
        }
        
        .toc a:hover {
            color: #2d5a27;
        }
        
        /* Page breaks */
        .page-break {
            page-break-before: always;
        }
        
        /* Prevent orphans and widows */
        h1, h2, h3, h4, h5, h6 {
            page-break-after: avoid;
        }
        
        p, li {
            orphans: 2;
            widows: 2;
        }
        
        /* Print optimizations */
        @media print {
            body {
                -webkit-print-color-adjust: exact;
                print-color-adjust: exact;
            }
        }
        
        /* Syntax highlighting for code */
        .codehilite {
            background-color: #f8f9fa;
            border-radius: 6px;
            padding: 1em;
            margin: 1em 0;
            overflow-x: auto;
        }
        
        .codehilite pre {
            background: none;
            border: none;
            padding: 0;
            margin: 0;
        }
        
        /* Cover page styling */
        .cover-page {
            text-align: center;
            padding: 4cm 2cm;
            page-break-after: always;
        }
        
        .cover-page h1 {
            font-size: 36px;
            margin-bottom: 1em;
            border: none;
            padding: 0;
        }
        
        .cover-page .subtitle {
            font-size: 18px;
            color: #666;
            margin-bottom: 2em;
        }
        
        .cover-page .logo {
            margin: 2em 0;
        }
        
        .cover-page .footer {
            position: absolute;
            bottom: 2cm;
            left: 0;
            right: 0;
            text-align: center;
            font-size: 12px;
            color: #666;
        }
        """
    
    def convert_markdown_to_html(self, md_content, title="Document"):
        """Convert markdown content to HTML with proper styling"""
        
        # Initialize markdown processor
        md = markdown.Markdown(extensions=self.md_extensions, extension_configs={
            'codehilite': {
                'css_class': 'codehilite',
                'use_pygments': True
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
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
            <title>{title}</title>
            <style>
                {self.get_css_styles()}
            </style>
        </head>
        <body>
            <div class="cover-page">
                <h1>{title}</h1>
                <div class="subtitle">Comprehensive AI Implementation Guide</div>
                <div class="logo">
                    <div style="font-size: 48px; color: #2d5a27; font-weight: 700;">EXPANDIA</div>
                    <div style="font-size: 14px; color: #666; margin-top: 0.5em;">AI Solutions & Consulting</div>
                </div>
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
        from datetime import datetime
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
            html_doc = HTML(string=html_content, base_url=str(md_path.parent))
            html_doc.write_pdf(
                target=str(output_path),
                font_config=self.font_config,
                optimize_images=True
            )
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
    pdf_gen = PDFGenerator(args.downloads_dir, args.output_dir)
    
    if args.all or not args.input:
        # Generate all PDFs
        pdf_gen.generate_all_pdfs()
    else:
        # Generate single PDF
        pdf_gen.generate_pdf_from_markdown(args.input, args.output)

if __name__ == "__main__":
    main() 