#!/usr/bin/env python3
"""
ReportLab PDF Generation Script for Expandia Resources
Converts markdown files to beautiful PDFs using ReportLab
"""

import os
import sys
from pathlib import Path
import markdown
import argparse
import logging
from datetime import datetime
from reportlab.lib.pagesizes import A4, letter
from reportlab.lib.styles import getSampleStyleSheet, ParagraphStyle
from reportlab.lib.units import inch, cm
from reportlab.lib import colors
from reportlab.platypus import SimpleDocTemplate, Paragraph, Spacer, PageBreak, Table, TableStyle
from reportlab.platypus.tableofcontents import TableOfContents
from reportlab.lib.enums import TA_CENTER, TA_JUSTIFY, TA_LEFT
from reportlab.pdfgen import canvas
from reportlab.lib.utils import ImageReader
import re
from html.parser import HTMLParser

# Configure logging
logging.basicConfig(level=logging.INFO, format='%(asctime)s - %(levelname)s - %(message)s')
logger = logging.getLogger(__name__)

class HTMLToReportLabParser(HTMLParser):
    """Parser to convert HTML to ReportLab elements"""
    
    def __init__(self, styles):
        super().__init__()
        self.styles = styles
        self.elements = []
        self.current_text = ""
        self.tag_stack = []
        self.in_table = False
        self.table_data = []
        self.current_row = []
        
    def handle_starttag(self, tag, attrs):
        self.tag_stack.append(tag)
        
        if tag in ['h1', 'h2', 'h3', 'h4', 'h5', 'h6']:
            if self.current_text.strip():
                self.add_paragraph()
            self.current_text = ""
        elif tag == 'p':
            if self.current_text.strip():
                self.add_paragraph()
            self.current_text = ""
        elif tag == 'br':
            self.current_text += "<br/>"
        elif tag == 'strong' or tag == 'b':
            self.current_text += "<b>"
        elif tag == 'em' or tag == 'i':
            self.current_text += "<i>"
        elif tag == 'code':
            self.current_text += "<font name='Courier'>"
        elif tag == 'pre':
            if self.current_text.strip():
                self.add_paragraph()
            self.current_text = ""
        elif tag == 'table':
            self.in_table = True
            self.table_data = []
        elif tag == 'tr':
            self.current_row = []
        elif tag == 'hr':
            if self.current_text.strip():
                self.add_paragraph()
            self.elements.append(Spacer(1, 0.2*inch))
    
    def handle_endtag(self, tag):
        if self.tag_stack and self.tag_stack[-1] == tag:
            self.tag_stack.pop()
        
        if tag in ['h1', 'h2', 'h3', 'h4', 'h5', 'h6']:
            style_name = f'CustomHeading{tag[1]}'
            if style_name in self.styles:
                style = self.styles[style_name]
            elif f'Heading{tag[1]}' in self.styles:
                style = self.styles[f'Heading{tag[1]}']
            else:
                style = self.styles['Normal']
            
            if self.current_text.strip():
                para = Paragraph(self.current_text.strip(), style)
                self.elements.append(para)
                self.elements.append(Spacer(1, 0.2*inch))
            self.current_text = ""
        elif tag == 'p':
            if self.current_text.strip():
                self.add_paragraph()
            self.current_text = ""
        elif tag == 'strong' or tag == 'b':
            self.current_text += "</b>"
        elif tag == 'em' or tag == 'i':
            self.current_text += "</i>"
        elif tag == 'code':
            self.current_text += "</font>"
        elif tag == 'pre':
            if self.current_text.strip():
                # Create code block
                code_style = ParagraphStyle(
                    'Code',
                    parent=self.styles['Normal'],
                    fontName='Courier',
                    fontSize=9,
                    backgroundColor=colors.lightgrey,
                    borderPadding=10,
                    leftIndent=20,
                    rightIndent=20
                )
                para = Paragraph(self.current_text.strip(), code_style)
                self.elements.append(para)
                self.elements.append(Spacer(1, 0.1*inch))
            self.current_text = ""
        elif tag == 'table':
            if self.table_data:
                table = Table(self.table_data)
                table.setStyle(TableStyle([
                    ('BACKGROUND', (0, 0), (-1, 0), colors.green),
                    ('TEXTCOLOR', (0, 0), (-1, 0), colors.whitesmoke),
                    ('ALIGN', (0, 0), (-1, -1), 'LEFT'),
                    ('FONTNAME', (0, 0), (-1, 0), 'Helvetica-Bold'),
                    ('FONTSIZE', (0, 0), (-1, 0), 10),
                    ('BOTTOMPADDING', (0, 0), (-1, 0), 12),
                    ('BACKGROUND', (0, 1), (-1, -1), colors.beige),
                    ('GRID', (0, 0), (-1, -1), 1, colors.black)
                ]))
                self.elements.append(table)
                self.elements.append(Spacer(1, 0.2*inch))
            self.in_table = False
        elif tag == 'tr':
            if self.current_row:
                self.table_data.append(self.current_row)
            self.current_row = []
        elif tag == 'td' or tag == 'th':
            if self.current_text.strip():
                self.current_row.append(self.current_text.strip())
            else:
                self.current_row.append("")
            self.current_text = ""
    
    def handle_data(self, data):
        self.current_text += data
    
    def add_paragraph(self):
        if self.current_text.strip():
            style = self.styles.get('CustomBodyText', self.styles['Normal'])
            para = Paragraph(self.current_text.strip(), style)
            self.elements.append(para)
            self.elements.append(Spacer(1, 0.1*inch))
        self.current_text = ""
    
    def get_elements(self):
        # Add any remaining text
        if self.current_text.strip():
            self.add_paragraph()
        return self.elements

class ReportLabPDFGenerator:
    def __init__(self, downloads_dir="downloads", output_dir="pdfs"):
        self.downloads_dir = Path(downloads_dir)
        self.output_dir = Path(output_dir)
        self.output_dir.mkdir(exist_ok=True)
        
        # Configure markdown extensions
        self.md_extensions = [
            'extra',
            'toc',
            'tables',
            'fenced_code'
        ]
        
        # Setup styles
        self.setup_styles()
    
    def setup_styles(self):
        """Setup custom styles for the PDF"""
        self.styles = getSampleStyleSheet()
        
        # Custom title style
        self.styles.add(ParagraphStyle(
            name='CustomTitle',
            parent=self.styles['Title'],
            fontSize=24,
            spaceAfter=30,
            textColor=colors.Color(0.176, 0.353, 0.153),  # #2d5a27
            alignment=TA_CENTER
        ))
        
        # Custom heading styles
        self.styles.add(ParagraphStyle(
            name='CustomHeading1',
            parent=self.styles['Heading1'],
            fontSize=18,
            spaceAfter=12,
            spaceBefore=20,
            textColor=colors.Color(0.176, 0.353, 0.153),  # #2d5a27
            keepWithNext=1
        ))
        
        self.styles.add(ParagraphStyle(
            name='CustomHeading2',
            parent=self.styles['Heading2'],
            fontSize=16,
            spaceAfter=10,
            spaceBefore=16,
            textColor=colors.Color(0.176, 0.353, 0.153),  # #2d5a27
            keepWithNext=1
        ))
        
        self.styles.add(ParagraphStyle(
            name='CustomHeading3',
            parent=self.styles['Heading3'],
            fontSize=14,
            spaceAfter=8,
            spaceBefore=12,
            textColor=colors.Color(0.204, 0.286, 0.369),  # #34495e
            keepWithNext=1
        ))
        
        # Custom body text
        self.styles.add(ParagraphStyle(
            name='CustomBodyText',
            parent=self.styles['Normal'],
            fontSize=11,
            leading=14,
            spaceAfter=6,
            alignment=TA_JUSTIFY
        ))
        
        # Cover page styles
        self.styles.add(ParagraphStyle(
            name='CoverTitle',
            parent=self.styles['Title'],
            fontSize=32,
            spaceAfter=20,
            textColor=colors.Color(0.176, 0.353, 0.153),
            alignment=TA_CENTER,
            fontName='Helvetica-Bold'
        ))
        
        self.styles.add(ParagraphStyle(
            name='CoverSubtitle',
            parent=self.styles['Normal'],
            fontSize=16,
            spaceAfter=40,
            textColor=colors.grey,
            alignment=TA_CENTER
        ))
        
        self.styles.add(ParagraphStyle(
            name='CoverLogo',
            parent=self.styles['Normal'],
            fontSize=36,
            spaceAfter=10,
            textColor=colors.Color(0.176, 0.353, 0.153),
            alignment=TA_CENTER,
            fontName='Helvetica-Bold'
        ))
    
    def create_cover_page(self, title):
        """Create a cover page for the PDF"""
        elements = []
        
        # Add some space at the top
        elements.append(Spacer(1, 2*inch))
        
        # Title
        elements.append(Paragraph(title, self.styles['CoverTitle']))
        
        # Subtitle
        elements.append(Paragraph("Comprehensive AI Implementation Guide", self.styles['CoverSubtitle']))
        
        # Logo
        elements.append(Paragraph("EXPANDIA.CH", self.styles['CoverLogo']))
        
        # Add space
        elements.append(Spacer(1, 2*inch))
        
        # Footer
        elements.append(Paragraph("© 2024 Expandia.ch - Your Partner in AI Transformation", self.styles['Normal']))
        elements.append(Paragraph("Contact: hello@expandia.ch", self.styles['Normal']))
        
        # Page break
        elements.append(PageBreak())
        
        return elements
    
    def get_current_date(self):
        """Get current date in readable format"""
        return datetime.now().strftime("%B %d, %Y")
    
    def convert_markdown_to_elements(self, md_content):
        """Convert markdown content to ReportLab elements"""
        
        # Initialize markdown processor
        md = markdown.Markdown(extensions=self.md_extensions)
        
        # Convert markdown to HTML
        html_content = md.convert(md_content)
        
        # Parse HTML and convert to ReportLab elements
        parser = HTMLToReportLabParser(self.styles)
        parser.feed(html_content)
        
        return parser.get_elements()
    
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
        
        # Extract title from filename
        title = md_path.stem.replace('-', ' ').replace('_', ' ').title()
        
        try:
            logger.info(f"Generating PDF: {output_path}")
            
            # Create PDF document
            doc = SimpleDocTemplate(
                str(output_path),
                pagesize=A4,
                rightMargin=72,
                leftMargin=72,
                topMargin=72,
                bottomMargin=72
            )
            
            # Build story
            story = []
            
            # Add cover page
            story.extend(self.create_cover_page(title))
            
            # Convert markdown content
            elements = self.convert_markdown_to_elements(md_content)
            story.extend(elements)
            
            # Build PDF
            doc.build(story)
            
            logger.info(f"✅ Successfully generated: {output_path}")
            return True
            
        except Exception as e:
            logger.error(f"Error generating PDF: {e}")
            import traceback
            traceback.print_exc()
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
    
    parser = argparse.ArgumentParser(description='Generate beautiful PDFs from markdown files using ReportLab')
    parser.add_argument('--input', '-i', help='Input markdown file path')
    parser.add_argument('--output', '-o', help='Output PDF file name')
    parser.add_argument('--downloads-dir', '-d', default='downloads', help='Downloads directory path')
    parser.add_argument('--output-dir', '-p', default='pdfs', help='Output directory for PDFs')
    parser.add_argument('--all', '-a', action='store_true', help='Generate PDFs for all markdown files')
    
    args = parser.parse_args()
    
    # Initialize PDF generator
    pdf_gen = ReportLabPDFGenerator(args.downloads_dir, args.output_dir)
    
    if args.all or not args.input:
        # Generate all PDFs
        pdf_gen.generate_all_pdfs()
    else:
        # Generate single PDF
        pdf_gen.generate_pdf_from_markdown(args.input, args.output)

if __name__ == "__main__":
    main() 