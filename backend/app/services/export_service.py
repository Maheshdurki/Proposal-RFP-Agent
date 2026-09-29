import io
import logging
from docx import Document
from docx.shared import Inches, Pt, RGBColor
from docx.enum.text import WD_ALIGN_PARAGRAPH

from reportlab.lib.pagesizes import letter
from reportlab.lib import colors
from reportlab.platypus import SimpleDocTemplate, Paragraph, Spacer, Table, TableStyle, HRFlowable
from reportlab.lib.styles import getSampleStyleSheet, ParagraphStyle

from app.models.proposal import ProposalContent

logger = logging.getLogger("proposal_agent.export")

class ExportService:
    @staticmethod
    def export_docx(content: ProposalContent) -> bytes:
        """Generate customer-facing Microsoft Word DOCX document."""
        doc = Document()
        
        # Configure margins
        for section in doc.sections:
            section.top_margin = Inches(1)
            section.bottom_margin = Inches(1)
            section.left_margin = Inches(1)
            section.right_margin = Inches(1)

        # Title Header
        title_p = doc.add_paragraph()
        title_run = title_p.add_run(content.title)
        title_run.font.name = 'Arial'
        title_run.font.size = Pt(24)
        title_run.font.bold = True
        title_run.font.color.rgb = RGBColor(15, 23, 42) # Slate 900
        title_p.alignment = WD_ALIGN_PARAGRAPH.LEFT

        # Subtitle Info
        meta_p = doc.add_paragraph()
        meta_run = meta_p.add_run(f"Prepared for: {content.client_name}  |  Industry: {content.industry}")
        meta_run.font.name = 'Arial'
        meta_run.font.size = Pt(11)
        meta_run.font.italic = True
        meta_run.font.color.rgb = RGBColor(71, 85, 105)

        doc.add_paragraph().paragraph_format.space_after = Pt(12)

        # Iterate Sections (STRICTLY EXTERNAL CONTENT ONLY)
        for sec in content.sections:
            h = doc.add_heading(level=2)
            hrun = h.add_run(sec.title)
            hrun.font.name = 'Arial'
            hrun.font.size = Pt(14)
            hrun.font.bold = True
            hrun.font.color.rgb = RGBColor(30, 58, 138) # Navy

            for para in sec.content.split('\n\n'):
                p = doc.add_paragraph()
                p.paragraph_format.line_spacing = 1.15
                p.paragraph_format.space_after = Pt(8)
                prun = p.add_run(para)
                prun.font.name = 'Arial'
                prun.font.size = Pt(10.5)

        # Save to Memory Stream
        target_stream = io.BytesIO()
        doc.save(target_stream)
        target_stream.seek(0)
        return target_stream.read()

    @staticmethod
    def export_pdf(content: ProposalContent) -> bytes:
        """Generate customer-facing PDF document using ReportLab."""
        buffer = io.BytesIO()
        doc = SimpleDocTemplate(
            buffer,
            pagesize=letter,
            rightMargin=54,
            leftMargin=54,
            topMargin=54,
            bottomMargin=54
        )

        styles = getSampleStyleSheet()
        
        # Custom styles
        title_style = ParagraphStyle(
            'DocTitle',
            parent=styles['Normal'],
            fontName='Helvetica-Bold',
            fontSize=22,
            leading=26,
            textColor=colors.HexColor('#0F172A'),
            spaceAfter=6
        )

        meta_style = ParagraphStyle(
            'DocMeta',
            parent=styles['Normal'],
            fontName='Helvetica-Oblique',
            fontSize=10,
            leading=14,
            textColor=colors.HexColor('#475569'),
            spaceAfter=16
        )

        h2_style = ParagraphStyle(
            'SecHeading',
            parent=styles['Normal'],
            fontName='Helvetica-Bold',
            fontSize=13,
            leading=17,
            textColor=colors.HexColor('#1E3A8A'),
            spaceBefore=14,
            spaceAfter=8,
            keepWithNext=True
        )

        body_style = ParagraphStyle(
            'SecBody',
            parent=styles['Normal'],
            fontName='Helvetica',
            fontSize=9.5,
            leading=13.5,
            textColor=colors.HexColor('#1E293B'),
            spaceAfter=6
        )

        story = []

        # Title & Meta
        story.append(Paragraph(content.title, title_style))
        story.append(Paragraph(f"Prepared for: <b>{content.client_name}</b> &nbsp;|&nbsp; Industry: <b>{content.industry}</b>", meta_style))
        story.append(HRFlowable(width="100%", thickness=1, color=colors.HexColor('#CBD5E1'), spaceAfter=14))

        # Sections
        for sec in content.sections:
            story.append(Paragraph(sec.title, h2_style))
            for chunk in sec.content.split('\n\n'):
                # Format bullet points if present
                formatted_chunk = chunk.replace('\n', '<br/>')
                story.append(Paragraph(formatted_chunk, body_style))
            story.append(Spacer(1, 4))

        doc.build(story)
        buffer.seek(0)
        return buffer.read()

export_service = ExportService()
