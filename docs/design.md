# MarketPulse Design Specification

## 1. Aesthetic Direction: **Clear Day**

A light, airy, modern SaaS aesthetic — approachable intelligence. Think Notion's clarity meets Stripe's polish. The platform should feel like a trusted advisor, not a trading floor. Clean surfaces, generous whitespace, soft edges, and calm confidence. Every screen should feel like opening a well-designed magazine, not a cockpit. Business professionals in fashion, travel, and consumer products should feel immediately at home — this is a tool that works _with_ them, not one they need to decode.

## 2. Color Palette

| Role                     | Color                                         | Hex       |
| ------------------------ | --------------------------------------------- | --------- |
| **Dominant — Snow**      | Page backgrounds, open canvas, breathing room | `#FAFBFD` |
| **Accent — Harbor Blue** | CTAs, active states, key data series, links   | `#2563EB` |
| **Secondary — Slate**    | Body text, labels, secondary information      | `#334155` |

Mode: **Light only.** Warmth and openness are the brand.

Surface hierarchy: `#FAFBFD` (page) → `#FFFFFF` (cards/panels) → `#F1F5F9` (hover/active/subtle backgrounds) → `#E2E8F0` (borders/dividers).

Text hierarchy: `#0F172A` (headings) → `#334155` (body) → `#94A3B8` (captions/muted).

## 3. Typography

**Display — DM Sans** (600 Semibold): Friendly geometric sans-serif with slightly rounded terminals. Warm but professional. Used for headings, KPI numbers, navigation labels.

- H1: 36px · H2: 26px · H3: 20px · KPI numbers: 44px · letter-spacing: -0.01em

**Body — DM Sans** (400 Regular, 500 Medium for emphasis): Same family for cohesion. Clean, highly legible at all sizes. No serif — keep everything unified and modern.

- Body: 15px / line-height 1.65 · Captions: 12px, color `#94A3B8`

Google Fonts import: `DM+Sans:wght@400;500;600;700`

## 4. Spatial Style

**Airy and structured.** Generous whitespace everywhere. Content breathes. Consistent 16px base spacing unit.

- **Layout:** Left sidebar 240px (expanded with labels, collapsible to 64px icons). Main content area centered with max-width 1120px. No right panel by default — contextual info appears in slide-over drawers.
- **Cards:** `border-radius: 12px` · `background: #FFFFFF` · `border: 1px solid #E2E8F0` · `box-shadow: 0 1px 3px rgba(0,0,0,0.04)`. Cards float gently above the page.
- **Spacing:** 24px padding inside cards. 20px gap between cards. 48px between major sections.
- **Symmetric and calm:** Centered content, even gutters, predictable rhythm. The eye should glide, not dart.

## 5. Signature Detail: **The Soft Glow**

Interactive elements (cards, buttons, inputs) gain a soft blue glow on hover and focus: `box-shadow: 0 0 0 3px rgba(37, 99, 235, 0.12)`. This subtle halo effect provides clear affordance without harshness — it feels like the interface is gently responding to you. Buttons use a smooth `150ms ease` scale-up to `transform: scale(1.02)` on hover. Cards lift slightly on hover with `box-shadow: 0 4px 12px rgba(0,0,0,0.06)`.

No animated pulse lines, no heartbeat motifs. The signature is _quiet responsiveness_ — the interface acknowledges every interaction with a gentle, trustworthy glow.

---

## Implementation Reference

| Element                | Style                                                                                                                  |
| ---------------------- | ---------------------------------------------------------------------------------------------------------------------- |
| Cards                  | `background: #FFFFFF` · `border: 1px solid #E2E8F0` · `border-radius: 12px` · `box-shadow: 0 1px 3px rgba(0,0,0,0.04)` |
| Card hover             | `box-shadow: 0 4px 12px rgba(0,0,0,0.06)` · `transition: all 150ms ease`                                               |
| Buttons (primary)      | `background: #2563EB` · `color: #FFFFFF` · `border-radius: 8px` · `padding: 10px 20px` · `font-weight: 600`            |
| Button hover           | `background: #1D4ED8` · `box-shadow: 0 0 0 3px rgba(37,99,235,0.12)` · `transform: scale(1.02)`                        |
| Chart primary series   | `#2563EB`                                                                                                              |
| Chart secondary series | `#93C5FD`                                                                                                              |
| Chart grid lines       | `#E2E8F0`                                                                                                              |
| Inputs                 | `border: 1px solid #E2E8F0` · `border-radius: 8px` · `padding: 10px 14px` · focus: `border-color: #2563EB` + glow      |
| Tags/chips             | DM Sans 500, 13px · `color: #2563EB` · `background: #EFF6FF` · `border-radius: 6px` · `padding: 4px 10px`              |
| Section dividers       | `1px solid #E2E8F0` or 32px whitespace — prefer whitespace over lines                                                  |
| Sidebar                | `background: #FFFFFF` · `border-right: 1px solid #E2E8F0`                                                              |
| Sidebar active item    | `background: #EFF6FF` · `color: #2563EB` · `border-radius: 8px` · `font-weight: 600`                                   |
