---
name: Kacper Frelek, Aerospace Engineer
description: A bilingual CV site set like an engineering technical report, paper, ink and one International Orange.
colors:
  cool-paper: "#f6f7f5"
  paper-shade: "#eceeea"
  plate-white: "#ffffff"
  report-ink: "#14181c"
  ink-secondary: "#3c444c"
  ink-tertiary: "#5b646d"
  hairline: "rgba(20, 24, 28, 0.14)"
  rule-strong: "rgba(20, 24, 28, 0.32)"
  international-orange: "#c43c0a"
  flame-orange: "#e8490f"
typography:
  display:
    fontFamily: "Archivo, Helvetica Neue, Arial, sans-serif"
    fontSize: "clamp(2.75rem, 7vw, 5rem)"
    fontWeight: 650
    lineHeight: 0.98
    letterSpacing: "-0.035em"
  headline:
    fontFamily: "Archivo, Helvetica Neue, Arial, sans-serif"
    fontSize: "clamp(2rem, 4.2vw, 3.1rem)"
    fontWeight: 600
    lineHeight: 1.1
    letterSpacing: "-0.03em"
  title:
    fontFamily: "Archivo, Helvetica Neue, Arial, sans-serif"
    fontSize: "1.75rem"
    fontWeight: 600
    lineHeight: 1.25
    letterSpacing: "-0.015em"
  body:
    fontFamily: "Source Serif 4, Georgia, Times New Roman, serif"
    fontSize: "1.0625rem"
    fontWeight: 400
    lineHeight: 1.62
  caption:
    fontFamily: "Archivo, Helvetica Neue, Arial, sans-serif"
    fontSize: "0.875rem"
    fontWeight: 400
    lineHeight: 1.45
  label:
    fontFamily: "Archivo, Helvetica Neue, Arial, sans-serif"
    fontSize: "0.8rem"
    fontWeight: 500
    lineHeight: 1.4
  data:
    fontFamily: "Archivo, Helvetica Neue, Arial, sans-serif"
    fontSize: "0.92rem"
    fontWeight: 400
    lineHeight: 1.45
    fontFeature: "tnum"
rounded:
  hairline: "2px"
spacing:
  gutter: "clamp(1rem, 4vw, 2.5rem)"
  wrap: "72rem"
  block: "clamp(3.5rem, 8vw, 5.5rem)"
  row: "1.35rem"
components:
  button-primary:
    backgroundColor: "{colors.report-ink}"
    textColor: "{colors.cool-paper}"
    typography: "{typography.label}"
    rounded: "{rounded.hairline}"
    padding: "0.8rem 1.15rem"
  button-primary-hover:
    backgroundColor: "{colors.international-orange}"
    textColor: "{colors.plate-white}"
  button-outline:
    backgroundColor: "transparent"
    textColor: "{colors.report-ink}"
    rounded: "{rounded.hairline}"
    padding: "0.8rem 1.15rem"
  button-outline-hover:
    backgroundColor: "{colors.report-ink}"
    textColor: "{colors.cool-paper}"
  chip:
    backgroundColor: "transparent"
    textColor: "{colors.ink-secondary}"
    rounded: "{rounded.hairline}"
    padding: "0.55rem 0.85rem"
  chip-on:
    backgroundColor: "{colors.report-ink}"
    textColor: "{colors.cool-paper}"
  input-field:
    backgroundColor: "{colors.plate-white}"
    textColor: "{colors.report-ink}"
    rounded: "{rounded.hairline}"
    padding: "0.55rem 0.65rem"
  nav-link:
    textColor: "{colors.ink-secondary}"
    rounded: "{rounded.hairline}"
    padding: "0.6rem 0.7rem"
  lang-switch-current:
    backgroundColor: "{colors.report-ink}"
    textColor: "{colors.cool-paper}"
    padding: "0.45rem 0.55rem"
---

# Design System: Kacper Frelek, Aerospace Engineer

## Overview

**Creative North Star: "The Technical Report"**

The site reads like a well-made engineering report: cool paper, near-black blue-grey ink, hairline rules, numbered figure captions, real tables with tabular figures, and equations set in KaTeX. The work itself is the design; his own CFD images, meshes and plots carry each page, and the chrome around them stays quiet, flat and exact.

Density is report-like rather than poster-like: a single 72rem column, generous block spacing, and lists ruled off line by line like a CV table. Archivo sets every heading, label and control; Source Serif 4 sets reading text. A single International Orange is held back for figure numbers and for the moment of interaction (hover, focus), so it reads as an annotation colour, never as decoration.

Motion is rare and earned: on a first visit a canvas rocket, drawn in the same ink line and paper fill, lifts off and its smoke clears into the page, followed by a one-time staggered reveal. After that the site is still.

**Key Characteristics:**
- Paper, ink and one orange; no gradient surfaces, no dark mode, no glass.
- Rules (1px hairline, 1px ink, 2px ink) do the structural work that cards and shadows do elsewhere.
- Numbered figure captions in small Archivo with an orange "Figure N." lead.
- Tabular figures on every date, measurement and table cell.
- Corners at 2px everywhere: drafted, not rounded.

## Colors

A cool, near-monochrome report palette with one warm annotation colour.

### Primary
- **International Orange** (`international-orange`): the only accent that carries text. Figure numbers, link hover, primary-button hover, project-card title hover, back and pager link hover, focus ring, text caret, the current row in the atmosphere table, and invalid-field borders.
- **Flame Orange** (`flame-orange`): decorative only. The rocket flame and band in the launch intro and the text-selection tint (at 22% opacity). Never used for text.

### Neutral
- **Cool Paper** (`cool-paper`): page background, sticky header (at 96% opacity), lightbox backdrop (97%), text on ink buttons.
- **Paper Shade** (`paper-shade`): notes, disabled inputs, photo placeholders, scrollbar track.
- **Plate White** (`plate-white`): behind figures and portraits (as a mount), form inputs, the desktop dropdown menu.
- **Report Ink** (`report-ink`): all body and heading text, primary-button fill, active-state fills, the 1px and 2px ink rules.
- **Ink Secondary** (`ink-secondary`): standfirsts, nav links at rest, captions, table row headers, supporting paragraphs.
- **Ink Tertiary** (`ink-tertiary`): dates, organisations, metadata labels, footer text, scrollbar thumb.
- **Hairline** (`hairline`): row dividers, figure borders, header and footer rules, menu borders.
- **Rule Strong** (`rule-strong`): link underlines at rest, outline-chip and CV-button borders, image border on hover.

### Named Rules
**The Annotation Rule.** Orange marks a figure number or an interaction, nothing else. Resting UI, active navigation and selected states are marked in ink.

**The Two Oranges Rule.** `#c43c0a` wherever orange carries text or a functional edge; `#e8490f` only where it is pure decoration (flame, selection tint). Never swap them.

## Typography

**Display Font:** Archivo (variable, self-hosted; with Helvetica Neue, Arial)
**Body Font:** Source Serif 4 (variable, roman and italic, self-hosted; with Georgia, Times New Roman)

**Character:** A sober grotesque for the report's apparatus (headings, captions, labels, tables, controls) against a readable book serif for the prose, the pairing of a well-typeset engineering thesis.

### Hierarchy
- **Display** (650, clamp(2.75rem, 7vw, 5rem), 0.98, -0.035em): the name on the overview page only.
- **Headline** (600, clamp(2rem, 4.2vw, 3.1rem), 1.1, -0.03em): project page titles, capped at 26ch.
- **Title** (600, 1.75rem, 1.25): section titles, always sitting under a 2px ink rule. Sub-titles step down to 1.2-1.45rem.
- **Body** (400, 1.0625rem, 1.62; 1rem under 640px): Source Serif 4 prose, kept to 60-68ch. Lede and standfirst step up to clamp(1.1rem, ~1.5vw, 1.25-1.3rem).
- **Caption** (400, 0.875rem, 1.45): Archivo figure captions in secondary ink, max 62ch, led by a 600-weight orange "Figure N."
- **Label** (500, 0.8-0.95rem): Archivo dates, metadata terms, field labels, buttons (600), nav (500). Sentence case, no tracking.
- **Data** (0.92rem, tabular-nums): tables, dates, calculator inputs and outputs.

### Named Rules
**The Tabular Rule.** Every number a reader might compare (dates, table cells, inputs, results) is set with `font-variant-numeric: tabular-nums`.

**The Sentence Case Rule.** Labels, buttons and nav are sentence case at normal tracking; the system has no uppercase tracked labels.

## Layout

One centred column (`wrap`, 72rem) with a fluid side gutter (`gutter`). Pages are hash-routed panels with clamp(2rem, 5vw, 3.5rem) top padding; major blocks are separated by `block` spacing and open with a 2px ink rule over the title.

Recurring grids: the overview intro (text plus a clamp(11rem, 22vw, 16rem) portrait column, bottom-aligned); the lead figure (3:1 image and marginal caption under a 1px ink rule); CV and skills lists as an 11rem date/term column against the content, each row closed by a hairline; project work as a three-up grid (two at 1000px, one at 640px); figure grids as auto-fill min 19rem; the travel photos as a 3-column masonry.

Breakpoints: 1000px (work grid to two, calculator and split tables to one column, lead caption drops its rule), 900px (nav collapses into a full-width sheet), 640px (single column everywhere, portrait moves above the name at 9rem, brand role hidden).

## Elevation & Depth

Flat by default. Depth comes from paper tone (paper, paper shade, plate white) and from rules, not shadows. Shadows appear only on things that float above the page.

### Shadow Vocabulary
- **Dropdown** (`box-shadow: 0 10px 30px -8px rgba(20, 24, 28, 0.18)`): the desktop project menu.
- **Sheet** (`box-shadow: 0 16px 30px -18px rgba(20, 24, 28, 0.25)`): the mobile nav panel under the header.
- **Lightbox plate** (`box-shadow: 0 18px 50px -20px rgba(20, 24, 28, 0.35)`): the enlarged figure.

### Named Rules
**The Floating-Only Rule.** A shadow means the element floats over the page (menu, sheet, lightbox). Content in the flow (figures, cards, tables) never casts one; it gets a hairline border instead.

## Shapes

A drafted form language: rectangles with 2px corners (`hairline`) on buttons, chips, inputs, nav links and the language switch; figures and portraits are square-cornered with a 1px hairline border on a white mount. Bullets are 0.65rem horizontal ink dashes, not dots. Icons are small inline SVG strokes (1.5-1.8px, round caps) in `currentColor`.

## Components

### Buttons
Quiet, ruled, and decisive on hover.
- **Shape:** 2px corners, 1px ink border, Archivo 600 at 0.95rem, padding 0.8rem 1.15rem, optional 16px stroke icon.
- **Primary:** ink fill, paper text. Hover turns fill and border International Orange with white text.
- **Outline:** transparent with ink border and text. Hover fills ink with paper text.
- **Transitions:** background, colour and border at 0.2s.

### Chips
- **Style:** transparent, 1px rule-strong border, secondary ink, 2px corners.
- **State:** hover darkens text and border to ink; selected (`is-on`) fills ink with paper text.

### Figures
The signature of the system.
- Image or video on a white mount with a 1px hairline border; grid figures at 16:10, contained.
- Caption below in Archivo 0.875rem secondary ink, led by "Figure N." in orange 600. The lead figure sets its caption beside the image under a 1px ink rule.
- Zoomable figures show a zoom-in cursor and darken the border to rule-strong on hover, opening the lightbox.

### Data tables
- Archivo 0.92rem, tabular figures, left-aligned (numeric tables right-aligned), hairline row dividers, 1px ink rule under the header row, caption left-aligned 600.

### Inputs / Fields
- **Style:** white fill, 1px ink at 35% border, 2px corners, Archivo 500 1rem with tabular figures. Selects use an inline SVG chevron.
- **Focus:** 2px orange outline flush to an orange border. Hover darkens border to secondary ink.
- **Error / Disabled:** invalid takes an orange border; disabled drops to paper shade with tertiary text.

### Navigation
- Sticky header on paper at 96% with a hairline bottom rule, 4rem tall. Brand (name 650, role in tertiary) on the left.
- Links in Archivo 500 0.94rem secondary ink; hover goes to ink; the active section is ink with a 2px ink underline (inset shadow). The CV link is boxed with a rule-strong border.
- Projects open a white dropdown with hairline border and dropdown shadow; items carry a tertiary year at right.
- Language switch: a hairline-bordered pair, current language filled ink.
- Under 900px: a stroke hamburger opens a full-width paper sheet; active link turns 650 weight, sub-menu indents under a hairline left rule.

### Launch intro
A first-visit, once-per-browser canvas sequence on paper (about 4.9s): an ink-line tower and white rocket with a flame-orange band ignite, lift off under constant acceleration, and leave paper-toned smoke that clears into the page. A bordered "Skip" button sits bottom right; a CSS failsafe fades the overlay after 9s if the script stalls; reduced motion turns it off. The page then plays a one-time reveal (1.1s, `cubic-bezier(0.16, 1, 0.3, 1)`, 14px rise with a 3px blur, 80ms stagger).

## Do's and Don'ts

### Do:
- **Do** start every section with a 2px ink rule over an Archivo title, and close list rows with a hairline.
- **Do** number figures and lead each caption with "Figure N." in International Orange.
- **Do** mount images on white with a 1px hairline border.
- **Do** set dates, measurements and table cells in tabular figures.
- **Do** keep corners at 2px and depth flat; reserve shadows for menus, sheets and the lightbox.
- **Do** mark active and selected states in ink (underline or ink fill).

### Don't:
- **Don't** use `#e8490f` for text or `#c43c0a` as a decorative fill.
- **Don't** put orange on resting UI or on active navigation.
- **Don't** add gradient backgrounds or gradient text to page surfaces (the launch flame is the one place colour blends), glass panels, stat counters or emoji; the work carries the page.
- **Don't** give in-flow content (figures, cards, tables) a shadow.
- **Don't** set labels in uppercase with tracking.
