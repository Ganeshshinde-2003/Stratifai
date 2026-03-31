from reportlab.lib.pagesizes import letter, A4
from reportlab.lib.styles import getSampleStyleSheet, ParagraphStyle
from reportlab.lib.units import inch
from reportlab.platypus import SimpleDocTemplate, Paragraph, Spacer, PageBreak
from reportlab.lib.enums import TA_LEFT, TA_CENTER
from reportlab.pdfgen import canvas
from io import BytesIO
from datetime import datetime
from typing import Dict, Any, List
import textwrap


class PDFGenerator:
    """Generate professional PDF reports from marketing strategy data"""

    def __init__(self):
        self.styles = getSampleStyleSheet()
        self._setup_custom_styles()

    def _setup_custom_styles(self):
        """Setup custom paragraph styles"""
        # Title style
        self.styles.add(ParagraphStyle(
            name='CustomTitle',
            parent=self.styles['Heading1'],
            fontSize=24,
            textColor='#1a1a1a',
            spaceAfter=30,
            alignment=TA_CENTER,
            fontName='Helvetica-Bold'
        ))

        # Section heading style
        self.styles.add(ParagraphStyle(
            name='SectionHeading',
            parent=self.styles['Heading2'],
            fontSize=16,
            textColor='#2c3e50',
            spaceAfter=12,
            spaceBefore=20,
            fontName='Helvetica-Bold'
        ))

        # Subsection heading style
        self.styles.add(ParagraphStyle(
            name='SubsectionHeading',
            parent=self.styles['Heading3'],
            fontSize=13,
            textColor='#34495e',
            spaceAfter=8,
            spaceBefore=12,
            fontName='Helvetica-Bold'
        ))

        # Body text style
        self.styles.add(ParagraphStyle(
            name='CustomBodyText',
            parent=self.styles['Normal'],
            fontSize=11,
            textColor='#333333',
            spaceAfter=10,
            leading=16,
            fontName='Helvetica'
        ))

        # List item style
        self.styles.add(ParagraphStyle(
            name='CustomListItem',
            parent=self.styles['Normal'],
            fontSize=11,
            textColor='#333333',
            spaceAfter=8,
            leftIndent=20,
            bulletIndent=10,
            fontName='Helvetica'
        ))

    def generate_pdf(self, data: Dict[str, Any]) -> BytesIO:
        """
        Generate PDF from marketing strategy data

        Args:
            data: Marketing strategy data dictionary

        Returns:
            BytesIO object containing the PDF
        """
        buffer = BytesIO()
        doc = SimpleDocTemplate(
            buffer,
            pagesize=letter,
            rightMargin=72,
            leftMargin=72,
            topMargin=72,
            bottomMargin=18,
        )

        # Build content
        story = []

        # Title
        story.append(Paragraph("AI Marketing Intelligence Report", self.styles['CustomTitle']))
        story.append(Spacer(1, 0.2 * inch))

        # Date
        date_text = f"Generated on: {datetime.now().strftime('%B %d, %Y')}"
        story.append(Paragraph(date_text, self.styles['CustomBodyText']))
        story.append(Spacer(1, 0.4 * inch))

        # Product Summary Section
        story.append(Paragraph("Product Summary", self.styles['SectionHeading']))
        story.append(Paragraph(data.get('product_summary', 'N/A'), self.styles['CustomBodyText']))
        story.append(Spacer(1, 0.2 * inch))

        # Target Audience Section
        story.append(Paragraph("Target Audience", self.styles['SectionHeading']))
        story.append(Paragraph(data.get('target_audience', 'N/A'), self.styles['CustomBodyText']))
        story.append(Spacer(1, 0.2 * inch))

        # Positioning Section
        story.append(Paragraph("Market Positioning", self.styles['SectionHeading']))
        story.append(Paragraph(data.get('positioning', 'N/A'), self.styles['CustomBodyText']))
        story.append(Spacer(1, 0.3 * inch))

        # Ad Copy Section
        story.append(Paragraph("Ad Copy Variations", self.styles['SectionHeading']))
        ad_copies = data.get('ad_copy', [])
        for i, ad in enumerate(ad_copies, 1):
            story.append(Paragraph(f"<b>Variation {i}:</b>", self.styles['SubsectionHeading']))
            story.append(Paragraph(ad, self.styles['CustomBodyText']))
            story.append(Spacer(1, 0.15 * inch))
        story.append(Spacer(1, 0.2 * inch))

        # Email Sequence Section
        story.append(Paragraph("Email Sequence", self.styles['SectionHeading']))
        email_sequence = data.get('email_sequence', [])
        for i, email_dict in enumerate(email_sequence, 1):
            email_key = f"email_{i}"
            email_content = email_dict.get(email_key, 'N/A')

            story.append(Paragraph(f"<b>Email {i}:</b>", self.styles['SubsectionHeading']))

            # Split email into lines and format
            email_lines = email_content.split('\n')
            for line in email_lines:
                if line.strip():
                    story.append(Paragraph(line, self.styles['CustomBodyText']))

            story.append(Spacer(1, 0.2 * inch))

        # Landing Page Section
        story.append(Paragraph("Landing Page Structure", self.styles['SectionHeading']))
        landing_page = data.get('landing_page', {})

        story.append(Paragraph("<b>Headline:</b>", self.styles['SubsectionHeading']))
        story.append(Paragraph(landing_page.get('headline', 'N/A'), self.styles['CustomBodyText']))
        story.append(Spacer(1, 0.1 * inch))

        story.append(Paragraph("<b>Subheadline:</b>", self.styles['SubsectionHeading']))
        story.append(Paragraph(landing_page.get('subheadline', 'N/A'), self.styles['CustomBodyText']))
        story.append(Spacer(1, 0.1 * inch))

        story.append(Paragraph("<b>Sections:</b>", self.styles['SubsectionHeading']))
        sections = landing_page.get('sections', [])
        for section in sections:
            story.append(Paragraph(f"• {section}", self.styles['CustomListItem']))
        story.append(Spacer(1, 0.1 * inch))

        story.append(Paragraph("<b>Call-to-Action:</b>", self.styles['SubsectionHeading']))
        story.append(Paragraph(landing_page.get('cta', 'N/A'), self.styles['CustomBodyText']))

        # Footer
        story.append(Spacer(1, 0.5 * inch))
        footer_text = "Generated by AI Marketing Intelligence Engine"
        story.append(Paragraph(footer_text, self.styles['CustomBodyText']))

        # Build PDF
        doc.build(story)

        buffer.seek(0)
        return buffer

    def save_pdf(self, data: Dict[str, Any], filename: str):
        """
        Save PDF to file

        Args:
            data: Marketing strategy data
            filename: Output filename
        """
        pdf_buffer = self.generate_pdf(data)

        with open(filename, 'wb') as f:
            f.write(pdf_buffer.read())
