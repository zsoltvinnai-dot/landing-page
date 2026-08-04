from pathlib import Path

from reportlab.lib.colors import Color, HexColor
from reportlab.lib.enums import TA_LEFT
from reportlab.lib.pagesizes import A4
from reportlab.pdfbase import pdfmetrics
from reportlab.pdfbase.ttfonts import TTFont
from reportlab.pdfgen import canvas
from reportlab.lib.utils import ImageReader, simpleSplit


ROOT = Path(__file__).resolve().parents[1]
OUTPUT = ROOT / "output" / "pdf" / "Anita_Art_of_Beauty_foto_video_hozzajarulas.pdf"
LOGO = ROOT / "frontend" / "frontend" / "assets" / "anita-art-of-beauty-logo.jpg"

INK = HexColor("#0B0A08")
PAPER = HexColor("#F7F0E6")
GOLD = HexColor("#D8AE4C")
GOLD_LIGHT = HexColor("#F2C76A")
PINK = HexColor("#D78BAB")
MUTED = HexColor("#75695D")
WHITE = HexColor("#FFFFFF")
LINE = Color(11 / 255, 10 / 255, 8 / 255, alpha=0.18)

PAGE_W, PAGE_H = A4
MARGIN = 48


def register_fonts():
    pdfmetrics.registerFont(TTFont("Georgia", r"C:\Windows\Fonts\georgia.ttf"))
    pdfmetrics.registerFont(TTFont("GeorgiaBold", r"C:\Windows\Fonts\georgiab.ttf"))
    pdfmetrics.registerFont(TTFont("GeorgiaItalic", r"C:\Windows\Fonts\georgiai.ttf"))
    pdfmetrics.registerFont(TTFont("Calibri", r"C:\Windows\Fonts\calibri.ttf"))
    pdfmetrics.registerFont(TTFont("CalibriBold", r"C:\Windows\Fonts\calibrib.ttf"))


def draw_wrapped(c, text, x, y, width, font="Calibri", size=9.2, leading=13, color=MUTED):
    c.setFont(font, size)
    c.setFillColor(color)
    lines = simpleSplit(text, font, size, width)
    for line in lines:
        c.drawString(x, y, line)
        y -= leading
    return y


def draw_label(c, text, x, y):
    c.setFont("CalibriBold", 7.4)
    c.setFillColor(MUTED)
    c.drawString(x, y, text.upper())


def text_field(c, name, x, y, w, h=25, multiline=False):
    c.acroForm.textfield(
        name=name,
        x=x,
        y=y,
        width=w,
        height=h,
        fontName="Helvetica",
        fontSize=9,
        textColor=INK,
        fillColor=WHITE,
        borderColor=Color(11 / 255, 10 / 255, 8 / 255, alpha=0.28),
        borderWidth=0.8,
        forceBorder=True,
        fieldFlags="multiline" if multiline else "",
    )


def checkbox(c, name, label, x, y, width=450, size=12):
    c.acroForm.checkbox(
        name=name,
        x=x,
        y=y - 2,
        size=size,
        checked=False,
        buttonStyle="check",
        borderWidth=0.8,
        borderColor=GOLD,
        fillColor=WHITE,
        textColor=INK,
        forceBorder=True,
    )
    return draw_wrapped(c, label, x + size + 8, y + 1, width - size - 8, size=8.8, leading=11.5, color=INK)


def page_header(c, page_number, subtitle):
    c.setFillColor(PAPER)
    c.rect(0, 0, PAGE_W, PAGE_H, fill=1, stroke=0)
    c.setFillColor(INK)
    c.rect(0, PAGE_H - 118, PAGE_W, 118, fill=1, stroke=0)

    if LOGO.exists():
        logo = ImageReader(str(LOGO))
        c.drawImage(logo, MARGIN, PAGE_H - 102, width=126, height=70, preserveAspectRatio=True, mask="auto")

    c.setFont("CalibriBold", 7.5)
    c.setFillColor(GOLD_LIGHT)
    c.drawRightString(PAGE_W - MARGIN, PAGE_H - 42, subtitle.upper())
    c.setFont("Calibri", 7.5)
    c.setFillColor(Color(1, 1, 1, alpha=0.52))
    c.drawRightString(PAGE_W - MARGIN, PAGE_H - 61, "Brattengeier Anita e.v. | 1.0 verzio")

    c.setStrokeColor(Color(11 / 255, 10 / 255, 8 / 255, alpha=0.18))
    c.line(MARGIN, 34, PAGE_W - MARGIN, 34)
    c.setFont("Calibri", 7.2)
    c.setFillColor(MUTED)
    c.drawString(MARGIN, 20, "Anita Art of Beauty | anitaartofbeauty.com | anitabrattengeier@gmail.com")
    c.drawRightString(PAGE_W - MARGIN, 20, f"{page_number} / 2")


def section_title(c, number, title, y):
    c.setFillColor(GOLD)
    c.circle(MARGIN + 11, y + 4, 11, fill=0, stroke=1)
    c.setFont("CalibriBold", 7.2)
    c.drawCentredString(MARGIN + 11, y + 1.5, number)
    c.setFont("Georgia", 20)
    c.setFillColor(INK)
    c.drawString(MARGIN + 34, y - 3, title)
    return y - 30


def build_pdf():
    OUTPUT.parent.mkdir(parents=True, exist_ok=True)
    register_fonts()
    c = canvas.Canvas(str(OUTPUT), pagesize=A4)
    c.setTitle("Anita Art of Beauty - Foto- es video-hozzajarulo nyilatkozat")
    c.setAuthor("Brattengeier Anita e.v.")
    c.setSubject("Önkéntes fotó- és videó-közzétételi hozzájárulás")

    # Page 1
    page_header(c, 1, "Fotó- és videó-hozzájárulás")
    y = PAGE_H - 150
    c.setFont("Georgia", 31)
    c.setFillColor(INK)
    c.drawString(MARGIN, y, "Hozzájáruló")
    c.setFont("GeorgiaItalic", 31)
    c.setFillColor(PINK)
    c.drawString(MARGIN + 190, y, "nyilatkozat.")
    y -= 27
    y = draw_wrapped(
        c,
        "Fotó- és videófelvétel készítéséhez, valamint az alábbiakban kiválasztott felületeken történő felhasználásához. A hozzájárulás önkéntes és tételesen választható.",
        MARGIN,
        y,
        PAGE_W - 2 * MARGIN,
        size=9.6,
        leading=13,
    )

    y -= 17
    y = section_title(c, "01", "A vendég adatai", y)
    col_gap = 14
    col_w = (PAGE_W - 2 * MARGIN - col_gap) / 2
    draw_label(c, "Teljes név", MARGIN, y)
    draw_label(c, "E-mail vagy telefonszám", MARGIN + col_w + col_gap, y)
    text_field(c, "client_full_name", MARGIN, y - 31, col_w)
    text_field(c, "client_contact", MARGIN + col_w + col_gap, y - 31, col_w)
    y -= 53
    draw_label(c, "Kezelés / szolgáltatás", MARGIN, y)
    draw_label(c, "Felvétel tervezett dátuma", MARGIN + col_w + col_gap, y)
    text_field(c, "service_name", MARGIN, y - 31, col_w)
    text_field(c, "recording_date", MARGIN + col_w + col_gap, y - 31, col_w)

    y -= 67
    y = section_title(c, "02", "Milyen felvételhez járulok hozzá?", y)
    options = [
        ("capture_photo", "Fotó készítése a kezelés előtt, közben vagy után."),
        ("capture_video", "Videó vagy rövid közösségi média-tartalom készítése."),
        ("use_before_after", "Előtte-utána összeállítás készítése."),
        ("use_identifiable", "Az arcom vagy más, felismerésre alkalmas részletem is látható lehet."),
        ("use_detail", "Közeli részletfelvétel használata, például szempilla, szemöldök vagy smink."),
    ]
    for name, label in options:
        y = checkbox(c, name, label, MARGIN, y, PAGE_W - 2 * MARGIN)
        y -= 11

    y -= 5
    y = section_title(c, "03", "Hol jelenhet meg?", y)
    channels = [
        ("channel_website", "Az Anita Art of Beauty weboldalán: anitaartofbeauty.com"),
        ("channel_instagram", "Az Anita Art of Beauty / Brattengeier Anita Instagram-felületein."),
        ("channel_facebook", "Az Anita Lash & MakeUp / Anita Art of Beauty Facebook-felületein."),
        ("channel_print", "Nyomtatott referencia- vagy szalonanyagban."),
    ]
    for name, label in channels:
        y = checkbox(c, name, label, MARGIN, y, PAGE_W - 2 * MARGIN)
        y -= 11

    c.setFillColor(Color(216 / 255, 174 / 255, 76 / 255, alpha=0.12))
    c.roundRect(MARGIN, 53, PAGE_W - 2 * MARGIN, 48, 4, fill=1, stroke=0)
    draw_wrapped(c, "Csak a bejelölt felvételtípusok és felületek engedélyezettek. Üresen hagyott pont nem jelent hozzájárulást.", MARGIN + 14, 82, PAGE_W - 2 * MARGIN - 28, font="CalibriBold", size=8.4, leading=11, color=INK)
    c.showPage()

    # Page 2
    page_header(c, 2, "Feltételek és aláírás")
    y = PAGE_H - 151
    y = section_title(c, "04", "A hozzájárulás feltételei", y)
    statements = [
        "A hozzájárulás önkéntes. Megtagadása vagy későbbi visszavonása a szolgáltatás igénybevételét és minőségét nem befolyásolja.",
        "A kijelölt felületek nyilvánosak lehetnek. Az interneten közzétett tartalom mások által elmenthető vagy megosztható, ezért a teljes körű utólagos törlés nem minden esetben garantálható.",
        "A hozzájárulás bármikor, indoklás nélkül visszavonható az anitabrattengeier@gmail.com címen. A visszavonás a korábbi felhasználás jogszerűségét nem érinti.",
        "Brattengeier Anita e.v. a visszavonás után a saját ellenőrzése alatt álló felületekről indokolatlan késedelem nélkül eltávolítja az anyagot, kivéve, ha más jogalap vagy jogi igény indokolja a további megőrzést.",
        "A felvétel nem adható el harmadik félnek, és nem használható a jelen nyilatkozatban meg nem jelölt célra újabb hozzájárulás nélkül.",
    ]
    for index, statement in enumerate(statements, start=1):
        c.setFillColor(GOLD if index % 2 else PINK)
        c.circle(MARGIN + 6, y + 2, 3.2, fill=1, stroke=0)
        y = draw_wrapped(c, statement, MARGIN + 18, y + 5, PAGE_W - 2 * MARGIN - 18, size=8.8, leading=12, color=MUTED)
        y -= 10

    y -= 2
    y = section_title(c, "05", "Kiskorú vendég és megjegyzés", y)
    draw_label(c, "Törvényes képviselő neve - csak kiskorú esetén", MARGIN, y)
    text_field(c, "guardian_name", MARGIN, y - 31, PAGE_W - 2 * MARGIN)
    y -= 53
    draw_label(c, "A törvényes képviselő minősége és elérhetősége", MARGIN, y)
    text_field(c, "guardian_details", MARGIN, y - 31, PAGE_W - 2 * MARGIN)
    y -= 56
    draw_label(c, "Egyedi korlátozás vagy megjegyzés", MARGIN, y)
    text_field(c, "limitations_notes", MARGIN, y - 60, PAGE_W - 2 * MARGIN, h=54, multiline=True)

    y -= 80
    y = section_title(c, "06", "Nyilatkozat és aláírás", y)
    y = checkbox(
        c,
        "privacy_acknowledged",
        "Kijelentem, hogy a fenti feltételeket és az anitaartofbeauty.com oldalon elérhető Adatkezelési tájékoztatót megismertem, a bejelölt felhasználásokhoz hozzájárulok.",
        MARGIN,
        y,
        PAGE_W - 2 * MARGIN,
    )
    y -= 15
    y = checkbox(
        c,
        "typed_signature_agreement",
        "Elektronikus kitöltés esetén a nevem alább történő beírásával a nyilatkozatot elfogadom. Ez egyszerű elektronikus nyilatkozat; erősebb bizonyító erőhöz auditnaplós aláírási folyamat javasolt.",
        MARGIN,
        y,
        PAGE_W - 2 * MARGIN,
    )

    y -= 18
    draw_label(c, "Helység és dátum", MARGIN, y)
    draw_label(c, "Vendég / törvényes képviselő aláírása vagy gépelt neve", MARGIN + col_w + col_gap, y)
    text_field(c, "signature_place_date", MARGIN, y - 31, col_w)
    text_field(c, "signature_name", MARGIN + col_w + col_gap, y - 31, col_w)

    c.setFont("Calibri", 7.6)
    c.setFillColor(MUTED)
    c.drawString(MARGIN, 54, "Adatkezelő: Brattengeier Anita e.v. | Adószám: 59277635-1-28 | Nyilvántartási szám: 57292632")

    c.save()
    return OUTPUT


if __name__ == "__main__":
    print(build_pdf())
