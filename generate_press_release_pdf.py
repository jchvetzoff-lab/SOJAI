"""
SOJAI Press Release PDF Generator
Professional presentation PDF with branded design.
Uses marker-based page backgrounds to avoid pagination drift.
"""

from reportlab.lib.pagesizes import A4
from reportlab.lib.units import mm
from reportlab.lib.colors import HexColor, Color
from reportlab.platypus import (
    SimpleDocTemplate, Paragraph, Spacer, Table, TableStyle,
    PageBreak, KeepTogether
)
from reportlab.lib.styles import getSampleStyleSheet, ParagraphStyle
from reportlab.lib.enums import TA_CENTER, TA_LEFT, TA_JUSTIFY
from reportlab.platypus.flowables import Flowable
import os

# ── Brand Colors ──
PRIMARY = HexColor("#4A39C0")
PINK = HexColor("#FF3254")
LIGHT_BG = HexColor("#F9F8FF")
BADGE_BG = HexColor("#E4E1FF")
TEXT_DARK = HexColor("#1A1A2E")
TEXT_MUTED = HexColor("#6B6B80")
CYAN = HexColor("#00C8C8")
WHITE = HexColor("#FFFFFF")
DARK_BG = HexColor("#1A1A2E")

PAGE_W, PAGE_H = A4
MARGIN_LR = 25 * mm
MARGIN_TB = 20 * mm
PW = PAGE_W - 2 * MARGIN_LR  # usable width


# ── Global state for page background ──
_current_bg = "light"  # "dark" or "light"


class SetPageBackground(Flowable):
    """Zero-height flowable that sets the background style for the NEXT page."""
    def __init__(self, bg_type="light"):
        Flowable.__init__(self)
        self.bg_type = bg_type
        self.width = 0
        self.height = 0

    def draw(self):
        global _current_bg
        _current_bg = self.bg_type

    def wrap(self, *args):
        return (0, 0)


class HLine(Flowable):
    """Horizontal colored line."""
    def __init__(self, width, color=PRIMARY, thickness=2):
        Flowable.__init__(self)
        self.width = width
        self.line_color = color
        self.thickness = thickness

    def draw(self):
        self.canv.setStrokeColor(self.line_color)
        self.canv.setLineWidth(self.thickness)
        self.canv.line(0, 0, self.width, 0)

    def wrap(self, *args):
        return (self.width, self.thickness + 2)


class AccuracyBar(Flowable):
    """Custom accuracy bar visualization."""
    def __init__(self, label, value, width=440, bar_height=12):
        Flowable.__init__(self)
        self.label = label
        self.value = value
        self.bar_width = width
        self.bar_height = bar_height
        self.total_height = 26

    def wrap(self, *args):
        return (self.bar_width, self.total_height)

    def draw(self):
        c = self.canv
        c.setFont("Helvetica", 9.5)
        c.setFillColor(TEXT_DARK)
        c.drawString(0, self.total_height - 11, self.label)
        c.setFont("Helvetica-Bold", 9.5)
        c.setFillColor(PRIMARY)
        c.drawRightString(self.bar_width, self.total_height - 11, f"{self.value}%")
        c.setFillColor(BADGE_BG)
        c.roundRect(0, 0, self.bar_width, self.bar_height, 6, fill=1, stroke=0)
        fill_w = self.bar_width * (self.value / 100.0)
        c.setFillColor(PRIMARY)
        c.roundRect(0, 0, fill_w, self.bar_height, 6, fill=1, stroke=0)


# ── Page callback ──
_page_counter = [0]


def on_page(canvas_obj, doc):
    global _current_bg
    _page_counter[0] += 1
    page = _page_counter[0]
    w, h = A4

    if _current_bg == "dark":
        canvas_obj.setFillColor(DARK_BG)
        canvas_obj.rect(0, 0, w, h, fill=1, stroke=0)
        canvas_obj.setFillColor(Color(0.29, 0.22, 0.75, alpha=0.08))
        canvas_obj.circle(w - 40 * mm, h - 30 * mm, 80 * mm, fill=1, stroke=0)
        canvas_obj.setFillColor(Color(0, 0.78, 0.78, alpha=0.05))
        canvas_obj.circle(30 * mm, 40 * mm, 60 * mm, fill=1, stroke=0)
    else:
        canvas_obj.setFillColor(WHITE)
        canvas_obj.rect(0, 0, w, h, fill=1, stroke=0)
        if page > 1:
            canvas_obj.setFillColor(PRIMARY)
            canvas_obj.rect(0, h - 3, w, 3, fill=1, stroke=0)

    if page > 1:
        canvas_obj.setFont("Helvetica", 8)
        color = HexColor("#6B6B80") if _current_bg == "dark" else TEXT_MUTED
        canvas_obj.setFillColor(color)
        canvas_obj.drawCentredString(w / 2, 12 * mm, f"SOJAI  |  Press Release 2026  |  Page {page}")


# ── Styles ──
def get_styles():
    styles = getSampleStyleSheet()
    defs = [
        ('CoverTitle', 'Helvetica-Bold', 36, 44, WHITE, TA_CENTER, 8 * mm),
        ('CoverSubtitle', 'Helvetica', 15, 22, HexColor("#D0CCFF"), TA_CENTER, 6 * mm),
        ('CoverTag', 'Helvetica-Bold', 11, 16, CYAN, TA_CENTER, 4 * mm),
        ('PageTitle', 'Helvetica-Bold', 26, 32, PRIMARY, TA_LEFT, 5 * mm),
        ('PageTitleWhite', 'Helvetica-Bold', 26, 32, WHITE, TA_LEFT, 5 * mm),
        ('SectionBadge', 'Helvetica-Bold', 10, 14, PRIMARY, TA_LEFT, 3 * mm),
        ('SectionBadgeWhite', 'Helvetica-Bold', 10, 14, CYAN, TA_LEFT, 3 * mm),
        ('BodyText14', 'Helvetica', 11, 18, TEXT_DARK, TA_JUSTIFY, 3.5 * mm),
        ('BodyTextWhite', 'Helvetica', 11, 18, HexColor("#E8E8F0"), TA_JUSTIFY, 3.5 * mm),
        ('QuoteName', 'Helvetica-Bold', 12, 16, PRIMARY, TA_LEFT, 1 * mm),
        ('QuoteRole', 'Helvetica', 10, 14, TEXT_MUTED, TA_LEFT, 3 * mm),
        ('QuoteText', 'Helvetica-Oblique', 11, 18, TEXT_DARK, TA_JUSTIFY, 4 * mm),
        ('StatNumber', 'Helvetica-Bold', 28, 34, PRIMARY, TA_CENTER, 0),
        ('StatLabel', 'Helvetica', 9.5, 13, TEXT_MUTED, TA_CENTER, 0),
        ('FooterText', 'Helvetica', 8, 11, TEXT_MUTED, TA_CENTER, 0),
        ('BulletItem', 'Helvetica', 10.5, 16, TEXT_DARK, TA_LEFT, 2 * mm),
        ('BulletItemWhite', 'Helvetica', 10.5, 16, HexColor("#E8E8F0"), TA_LEFT, 2 * mm),
        ('CTATitle', 'Helvetica-Bold', 22, 28, PRIMARY, TA_CENTER, 4 * mm),
        ('CTABody', 'Helvetica', 12, 18, TEXT_MUTED, TA_CENTER, 3 * mm),
    ]
    for name, font, size, lead, color, align, after in defs:
        extra = {}
        if name == 'QuoteText':
            extra = {'leftIndent': 4 * mm, 'rightIndent': 4 * mm}
        if name.startswith('BulletItem'):
            extra = {'leftIndent': 6 * mm, 'bulletIndent': 0}
        styles.add(ParagraphStyle(name=name, fontName=font, fontSize=size,
                                  leading=lead, textColor=color, alignment=align,
                                  spaceAfter=after, **extra))
    return styles


# ── Page Builders ──

def build_cover(styles):
    elements = [SetPageBackground("dark")]
    elements.append(Spacer(1, 35 * mm))
    elements.append(Paragraph("PRESS RELEASE  |  2026", styles['CoverTag']))
    elements.append(Spacer(1, 6 * mm))
    elements.append(Paragraph(
        "SOJAI Launches the First<br/>All-in-One AI Platform for<br/>Dental Diagnostics",
        styles['CoverTitle']))
    elements.append(Spacer(1, 6 * mm))
    elements.append(Paragraph(
        "99.8% accuracy across 130+ pathologies. Full CBCT analysis in under 60 seconds.<br/>"
        "FDA-cleared. HIPAA &amp; GDPR compliant. Trusted by 10,000+ practitioners.",
        styles['CoverSubtitle']))
    elements.append(Spacer(1, 15 * mm))

    stats = [("99.8%", "Accuracy"), ("130+", "Pathologies"),
             ("&lt;60s", "Analysis Time"), ("10,000+", "Practitioners")]
    stat_cells = [[
        Paragraph(n, styles['StatNumber']),
        Paragraph(l, ParagraphStyle('SLW', parent=styles['StatLabel'], textColor=HexColor("#B0ADCC")))
    ] for n, l in stats]
    tbl = Table([stat_cells], colWidths=[PW / 4] * 4, rowHeights=[55])
    tbl.setStyle(TableStyle([
        ('VALIGN', (0, 0), (-1, -1), 'MIDDLE'),
        ('ALIGN', (0, 0), (-1, -1), 'CENTER'),
    ]))
    elements.append(tbl)
    elements.append(Spacer(1, 20 * mm))
    elements.append(Paragraph("www.sojai.com  |  contact@sojai.com",
                              ParagraphStyle('CF', parent=styles['FooterText'], textColor=HexColor("#8885AA"))))
    # Set next page to light BEFORE the page break
    elements.append(SetPageBackground("light"))
    elements.append(PageBreak())
    return elements


def build_announcement(styles):
    elements = []
    elements.append(Spacer(1, 5 * mm))
    elements.append(Paragraph("THE ANNOUNCEMENT", styles['SectionBadge']))
    elements.append(HLine(60 * mm, PRIMARY, 2.5))
    elements.append(Spacer(1, 3 * mm))
    elements.append(Paragraph(
        "The First All-in-One AI Platform<br/>for Dental Diagnostics",
        styles['PageTitle']))
    elements.append(Spacer(1, 2 * mm))

    elements.append(Paragraph(
        "SOJAI, an AI-powered SaaS platform, now enables dental professionals to automatically "
        "analyze CBCT scans and 2D radiographs in under 60 seconds, with 99.8% accuracy across "
        "130+ pathologies. The technology is FDA 510(k) cleared, HIPAA and GDPR compliant, and "
        "already used by over 10,000 practitioners worldwide.",
        styles['BodyText14']))
    elements.append(Paragraph(
        "The platform covers the entire diagnostic workflow \u2014 from scan upload to a professional "
        "PDF report ready to hand to the patient. Compatible with all 18 major CBCT manufacturers, "
        "SOJAI integrates seamlessly into existing practice infrastructure without requiring any "
        "equipment change.",
        styles['BodyText14']))
    elements.append(Spacer(1, 4 * mm))

    facts = [
        "\u2713  FDA 510(k) cleared for periapical pathology detection",
        "\u2713  Neural networks trained on millions of annotated dental images",
        "\u2713  Compatible with Dentsply Sirona, Planmeca, Vatech, Carestream & 13 more",
        "\u2713  DICOM, panoramic, periapical, bitewing \u2014 all formats supported",
        "\u2713  Cloud-based, accessible from any device, anywhere",
    ]
    for t in facts:
        elements.append(Paragraph(f'<font color="{PRIMARY.hexval()}">\u2022</font>  {t}',
                                  styles['BulletItem']))

    elements.append(Spacer(1, 5 * mm))
    elements.append(Paragraph("AI DETECTION ACCURACY", styles['SectionBadge']))
    elements.append(Spacer(1, 1.5 * mm))

    pathologies = [
        ("Impacted Teeth", 99.5), ("Caries Detection", 99.2),
        ("Periapical Lesions", 98.7), ("Bone Loss Analysis", 97.9),
        ("Root Fractures", 96.5), ("Sinus Pathology", 95.8),
    ]
    # Wrap all bars in KeepTogether so they don't split
    bar_elements = []
    for label, val in pathologies:
        bar_elements.append(AccuracyBar(label, val, width=PW))
        bar_elements.append(Spacer(1, 1 * mm))
    elements.append(KeepTogether(bar_elements))

    # Set next page to dark BEFORE the page break
    elements.append(SetPageBackground("dark"))
    elements.append(PageBreak())
    return elements


def build_problem(styles):
    elements = []
    elements.append(Spacer(1, 5 * mm))
    elements.append(Paragraph("THE PROBLEM", styles['SectionBadgeWhite']))
    elements.append(HLine(40 * mm, CYAN, 2.5))
    elements.append(Spacer(1, 3 * mm))
    elements.append(Paragraph("The Dark Ages of<br/>Dental Diagnostics", styles['PageTitleWhite']))
    elements.append(Spacer(1, 2 * mm))

    paragraphs = [
        "Today, a dentist spends an average of 15 to 20 minutes per CBCT scan manually reviewing "
        "each slice, identifying pathologies, annotating images, and writing up findings. Multiply "
        "that by 8 to 12 patients a day, and it\u2019s hours lost to repetitive tasks \u2014 hours that are "
        "neither billed nor spent on patient care.",

        "Worse: the human eye, even an expert one, misses things. An early-stage periapical lesion, "
        "a subtle root fracture, progressive bone loss \u2014 these weak signals go unnoticed when a "
        "practitioner is rushing between patients under time pressure.",

        "In multi-location clinics, the problem compounds: no shared diagnostic standard, quality "
        "gaps between practitioners, no centralized tool to track consistency.",

        "And on the patient side? A panoramic X-ray displayed on screen without clear visual "
        "explanation means a treatment plan declined or postponed. The practitioner knows what "
        "they\u2019re seeing, but they can\u2019t show it convincingly.",
    ]
    for p in paragraphs:
        elements.append(Paragraph(p, styles['BodyTextWhite']))

    elements.append(Spacer(1, 6 * mm))

    pain_points = [
        ("15\u201320 min per scan", "Manual analysis, annotation & reporting"),
        ("Missed pathologies", "Fatigue and time pressure lead to diagnostic errors"),
        ("No standardization", "Quality varies across practitioners and locations"),
        ("Poor patient communication", "Patients can\u2019t understand raw imaging"),
    ]
    for title, desc in pain_points:
        elements.append(Paragraph(
            f'<font color="#00C8C8"><b>{title}</b></font>',
            ParagraphStyle('PI', parent=styles['BulletItemWhite'], leftIndent=0, bulletIndent=0)))
        elements.append(Paragraph(desc,
            ParagraphStyle('PD', parent=styles['BulletItemWhite'],
                           textColor=HexColor("#A0A0B8"), fontSize=9.5, leftIndent=0)))
        elements.append(Spacer(1, 1.5 * mm))

    # Set next page to light BEFORE the page break
    elements.append(SetPageBackground("light"))
    elements.append(PageBreak())
    return elements


def build_solution(styles):
    elements = []
    elements.append(Spacer(1, 5 * mm))
    elements.append(Paragraph("THE SOLUTION", styles['SectionBadge']))
    elements.append(HLine(50 * mm, PRIMARY, 2.5))
    elements.append(Spacer(1, 3 * mm))
    elements.append(Paragraph("Three Steps to Transform<br/>Your Practice", styles['PageTitle']))
    elements.append(Spacer(1, 2 * mm))

    steps = [
        ("01 \u2014 Upload Scan",
         "Drag-and-drop any scan \u2014 DICOM, panoramic, periapical, bitewing. Compatible with all "
         "18 major CBCT manufacturers (Dentsply Sirona, Planmeca, Vatech, Carestream, KaVo Kerr, "
         "and more). No equipment change required. No plugin to install."),
        ("02 \u2014 AI Analysis in Under 60 Seconds",
         "A neural network trained on millions of annotated dental images analyzes the full 3D "
         "volume: automatic tooth-by-tooth segmentation with FDI numbering, caries detection (99.2%), "
         "periapical lesions (98.7%), bone loss (97.9%), root fractures (96.5%), impacted teeth (99.5%). "
         "130+ pathologies identified with clinical-grade accuracy."),
        ("03 \u2014 Review &amp; Report",
         "Review AI findings with interactive overlays and synchronized multiplanar views (axial, "
         "sagittal, coronal). Compare scans over time to track progression. One click generates a "
         "professional PDF report with your annotations, findings summary, treatment recommendations, "
         "practice logo, and digital signature \u2014 ready to hand to the patient or send to a colleague."),
    ]

    step_style = ParagraphStyle('StepT', parent=styles['BodyText14'], fontSize=12.5,
                                fontName='Helvetica-Bold', textColor=PRIMARY, spaceAfter=1.5 * mm)
    for title, body in steps:
        elements.append(Paragraph(title, step_style))
        elements.append(Paragraph(body, styles['BodyText14']))
        elements.append(Spacer(1, 2 * mm))

    elements.append(Spacer(1, 4 * mm))
    elements.append(Paragraph("PLATFORM CAPABILITIES", styles['SectionBadge']))
    elements.append(Spacer(1, 2 * mm))

    # Build capabilities as a single KeepTogether table
    col_w = PW / 3
    feat_titles = [
        ["3D Tooth Segmentation", "Multiplanar Reconstruction", "Scan Superimposition"],
        ["Professional PDF Reports", "Real-Time Collaboration", "REST API Integration"],
    ]
    feat_descs = [
        ["Individual tooth isolation,<br/>automatic FDI numbering,<br/>STL export for 3D printing",
         "Axial, sagittal &amp; coronal<br/>views with cross-hair sync<br/>and measurement tools",
         "Temporal scan comparison,<br/>bone level tracking,<br/>automatic alignment"],
        ["Custom branding &amp; templates,<br/>multi-language support,<br/>digital signature ready",
         "Case sharing, annotation tools,<br/>discussion threads, seamless<br/>referral workflow",
         "PACS integration, batch<br/>processing, DICOM &amp;<br/>STL/OBJ support"],
    ]

    ft_style = ParagraphStyle('FT', fontName='Helvetica-Bold', fontSize=9.5,
                              leading=13, textColor=PRIMARY, alignment=TA_CENTER)
    fd_style = ParagraphStyle('FD', fontName='Helvetica', fontSize=8.5,
                              leading=12, textColor=TEXT_MUTED, alignment=TA_CENTER)

    rows = []
    for i in range(2):
        rows.append([Paragraph(f'<b>{t}</b>', ft_style) for t in feat_titles[i]])
        rows.append([Paragraph(d, fd_style) for d in feat_descs[i]])

    tbl = Table(rows, colWidths=[col_w] * 3)
    tbl.setStyle(TableStyle([
        ('VALIGN', (0, 0), (-1, -1), 'TOP'),
        ('ALIGN', (0, 0), (-1, -1), 'CENTER'),
        ('TOPPADDING', (0, 0), (-1, -1), 6),
        ('BOTTOMPADDING', (0, 0), (-1, -1), 6),
        ('LEFTPADDING', (0, 0), (-1, -1), 6),
        ('RIGHTPADDING', (0, 0), (-1, -1), 6),
        ('BACKGROUND', (0, 0), (-1, -1), LIGHT_BG),
        ('LINEBELOW', (0, 1), (-1, 1), 0.5, HexColor("#E0E0E5")),
    ]))
    elements.append(KeepTogether([tbl]))

    elements.append(PageBreak())
    return elements


def build_quotes(styles):
    elements = []
    elements.append(Spacer(1, 5 * mm))
    elements.append(Paragraph("WHAT PRACTITIONERS SAY", styles['SectionBadge']))
    elements.append(HLine(70 * mm, PRIMARY, 2.5))
    elements.append(Spacer(1, 3 * mm))
    elements.append(Paragraph("Trusted by Dental<br/>Professionals Worldwide", styles['PageTitle']))
    elements.append(Spacer(1, 5 * mm))

    # Quote 1
    elements.append(Paragraph(
        "\u201cThe pathology detection has changed my daily practice. Last week, SOJAI flagged a root "
        "fracture on a lower first molar that I would have probably diagnosed as irreversible pulpitis. "
        "And the PDF reports \u2014 my patients finally understand what I\u2019m showing them. Treatment plan "
        "acceptance rates have gone up significantly since we started using the platform.\u201d",
        styles['QuoteText']))
    elements.append(Spacer(1, 2 * mm))
    elements.append(Paragraph("Dr. Sarah Chen", styles['QuoteName']))
    elements.append(Paragraph("Oral Surgeon \u2014 Boston, MA", styles['QuoteRole']))

    elements.append(Spacer(1, 8 * mm))
    elements.append(HLine(30 * mm, BADGE_BG, 1.5))
    elements.append(Spacer(1, 8 * mm))

    # Quote 2
    elements.append(Paragraph(
        "\u201cIntegration with our Planmeca CBCT took literally five minutes. But what really sold me "
        "is the 3D segmentation: being able to isolate a tooth, trace the root canal in 3D, and "
        "export to STL for planning an endo retreatment \u2014 that\u2019s a massive time saver. We\u2019ve cut "
        "our pre-operative planning time in half.\u201d",
        styles['QuoteText']))
    elements.append(Spacer(1, 2 * mm))
    elements.append(Paragraph("Dr. Emma Larsson", styles['QuoteName']))
    elements.append(Paragraph("Endodontist \u2014 Stockholm, Sweden", styles['QuoteRole']))

    elements.append(Spacer(1, 15 * mm))

    # CTA
    elements.append(HLine(PW, LIGHT_BG, 1))
    elements.append(Spacer(1, 8 * mm))
    elements.append(Paragraph("Ready to Transform Your Practice?", styles['CTATitle']))
    elements.append(Paragraph(
        "Join 10,000+ dental professionals using AI-powered diagnostics.", styles['CTABody']))
    elements.append(Paragraph(
        "Free 14-day trial  \u2022  No credit card required  \u2022  HIPAA compliant",
        ParagraphStyle('CS', parent=styles['CTABody'], fontSize=10, textColor=TEXT_MUTED)))
    elements.append(Spacer(1, 8 * mm))
    elements.append(Paragraph("www.sojai.com  |  contact@sojai.com  |  Book a Demo",
                              styles['FooterText']))
    return elements


def build_pdf():
    global _current_bg
    _current_bg = "dark"  # Cover starts dark
    _page_counter[0] = 0

    output_path = os.path.join(os.path.dirname(os.path.abspath(__file__)), "SOJAI_Press_Release.pdf")

    doc = SimpleDocTemplate(
        output_path, pagesize=A4,
        leftMargin=MARGIN_LR, rightMargin=MARGIN_LR,
        topMargin=MARGIN_TB, bottomMargin=MARGIN_TB,
        title="SOJAI - Press Release 2026", author="SOJAI",
    )

    styles = get_styles()
    elements = []
    elements.extend(build_cover(styles))
    elements.extend(build_announcement(styles))
    elements.extend(build_problem(styles))
    elements.extend(build_solution(styles))
    elements.extend(build_quotes(styles))

    doc.build(elements, onFirstPage=on_page, onLaterPages=on_page)
    print(f"PDF generated: {output_path}")
    return output_path


if __name__ == "__main__":
    path = build_pdf()
    print(f"Done! Open: {path}")
