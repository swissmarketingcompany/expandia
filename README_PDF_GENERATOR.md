# PDF Generation System for Expandia Resources

This repository includes a powerful PDF generation system that converts your markdown resources into beautiful, professional PDFs using ReportLab.

## Features

✨ **Professional Styling**: Clean, modern design with Expandia branding
📄 **Cover Pages**: Automatic cover page generation with title and branding
🎨 **Beautiful Typography**: Custom fonts, colors, and spacing
📊 **Table Support**: Professional table formatting with headers and styling
💻 **Code Highlighting**: Properly formatted code blocks
🔗 **Markdown Support**: Full markdown syntax support including headers, lists, links

## Quick Start

### 1. Install Dependencies

```bash
python3 -m pip install -r requirements.txt
```

### 2. Generate All PDFs

```bash
python3 generate_pdfs_reportlab.py --all
```

### 3. Generate Single PDF

```bash
python3 generate_pdfs_reportlab.py --input downloads/ai-strategy-whitepaper.md --output my-custom-name.pdf
```

## Command Line Options

```bash
python3 generate_pdfs_reportlab.py [OPTIONS]

Options:
  --input, -i         Input markdown file path
  --output, -o        Output PDF file name
  --downloads-dir, -d Downloads directory path (default: downloads)
  --output-dir, -p    Output directory for PDFs (default: pdfs)
  --all, -a          Generate PDFs for all markdown files
  --help             Show help message
```

## Generated PDFs

The system automatically generates PDFs for all markdown files in the `downloads/` directory:

1. **AI Implementation Guide** (18.4 KB) - Complete implementation framework
2. **AI Project Checklist** (18.4 KB) - 135+ actionable checklist items
3. **Data Quality Assessment Template** (15.9 KB) - Comprehensive data evaluation framework
4. **AI Business Case Template** (11.8 KB) - Financial analysis and ROI templates
5. **AI Ethics & Governance Checklist** (10.4 KB) - 135+ governance items
6. **AI Security & Privacy Checklist** (9.8 KB) - 150+ security checklist items
7. **Machine Learning Business Guide** (8.7 KB) - Practical ML guidance
8. **AI Readiness Assessment** (8.4 KB) - 100-point scoring system
9. **AI ROI Calculator Template** (4.5 KB) - Financial calculation framework
10. **AI Strategy Whitepaper** (4.8 KB) - Strategic guidance and framework

## PDF Features

### Professional Cover Pages
- Expandia branding and logo
- Document title and subtitle
- Generation date
- Copyright information

### Content Formatting
- **Headers**: Color-coded hierarchy (H1-H6)
- **Body Text**: Justified text with proper spacing
- **Code Blocks**: Monospace font with gray background
- **Tables**: Professional styling with green headers
- **Lists**: Proper indentation and bullet styles
- **Links**: Preserved and styled

### Page Layout
- **A4 Page Size**: Standard international format
- **Professional Margins**: 72pt margins all around
- **Page Numbers**: Automatic pagination
- **Header/Footer**: Expandia branding on each page

## Customization

### Modify Styles

Edit the `setup_styles()` method in `generate_pdfs_reportlab.py`:

```python
def setup_styles(self):
    # Modify colors
    textColor=colors.Color(0.176, 0.353, 0.153)  # Expandia green
    
    # Modify fonts
    fontSize=18
    fontName='Helvetica-Bold'
    
    # Modify spacing
    spaceAfter=12
    spaceBefore=20
```

### Custom Cover Pages

Modify the `create_cover_page()` method to change:
- Logo and branding
- Title formatting
- Footer information
- Page layout

### Add New Markdown Extensions

Update the `md_extensions` list:

```python
self.md_extensions = [
    'extra',
    'toc',
    'tables',
    'fenced_code',
    'footnotes',      # Add footnotes
    'admonition',     # Add admonitions
    'attr_list'       # Add attribute lists
]
```

## Troubleshooting

### Common Issues

1. **Import Errors**: Make sure all dependencies are installed
   ```bash
   python3 -m pip install -r requirements.txt
   ```

2. **File Not Found**: Check that markdown files exist in the downloads directory
   ```bash
   ls downloads/*.md
   ```

3. **Permission Errors**: Ensure write permissions to the pdfs directory
   ```bash
   chmod 755 pdfs/
   ```

### System Requirements

- **Python**: 3.7 or higher
- **Operating System**: macOS, Linux, Windows
- **Memory**: 512MB RAM minimum
- **Storage**: 50MB for dependencies

## Technical Details

### Dependencies

- **ReportLab**: PDF generation engine
- **Markdown**: Markdown to HTML conversion
- **Pygments**: Syntax highlighting (optional)

### Architecture

1. **Markdown Parser**: Converts .md files to HTML
2. **HTML Parser**: Converts HTML to ReportLab elements
3. **Style Engine**: Applies professional styling
4. **PDF Builder**: Generates final PDF documents

### Performance

- **Speed**: ~100ms per document
- **Memory**: ~10MB per document
- **Output Size**: 4-20KB per PDF (depending on content)

## License

This PDF generation system is part of the Expandia.ch project and follows the same licensing terms.

## Contact

**Expandia.ch** - Your Partner in AI Transformation  
Email: hello@expandia.ch  
Website: https://expandia.ch

## Support

For issues or questions:
1. Check the troubleshooting section above
2. Review the generated log output
3. Verify your markdown syntax
4. Contact the development team

---

**Generated PDFs are saved to the `pdfs/` directory and are ready for distribution or download.**

---

**Expandia.ch** | hello@expandia.ch | Your Partner in AI Transformation 