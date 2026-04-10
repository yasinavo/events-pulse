# Events Design System

Complete design system documentation for `/events` and `/submit-event` pages.

---

## 1. Color Palette

### Primary Colors

| Token | Value | Usage |
|-------|-------|-------|
| Background (Primary) | `#0F0E0E` | Page background, button shadow base |
| Surface | `#1A1A1A` | Detail panel background |
| Accent Gold | `#B8AD37` | CTAs, active states, live badges, icons |
| White | `#FFFFFF` | Headings, titles |

### Event Type Accent Colors

| Type | Color | Hex |
|------|-------|-----|
| X Space | Gold | `#B8AD37` |
| AMA | Purple | `#7C6FE0` |
| Token Launch | Red | `#E06F6F` |
| Airdrop | Green | `#6FE0A8` |
| News | Blue | `#6FB8E0` |
| Other | Gray | `#A0A0A0` |

### Opacity Patterns (white-based RGBA)

| Opacity | Value | Usage |
|---------|-------|-------|
| 3% | `rgba(255,255,255,0.03)` | Card/container backgrounds |
| 4% | `rgba(255,255,255,0.04)` | Hover backgrounds |
| 5% | `rgba(255,255,255,0.05)` | Inactive tab/badge backgrounds |
| 6% | `rgba(255,255,255,0.06)` | Dividers, timeline lines |
| 8% | `rgba(255,255,255,0.08)` | Default card borders, section dividers |
| 10% | `rgba(255,255,255,0.1)` | Tab borders, detail panel border |
| 15% | `rgba(255,255,255,0.15)` | Timeline dot borders (inactive) |
| 20% | `rgba(255,255,255,0.2)` | Placeholder icons |
| 30% | `rgba(255,255,255,0.3)` | Section headers, search icon, countdown text |
| 35% | `rgba(255,255,255,0.35)` | Countdown text (card) |
| 40% | `rgba(255,255,255,0.4)` | Body text, meta text, sidebar quick filters |
| 45% | `rgba(255,255,255,0.45)` | Sidebar category text (inactive) |
| 50% | `rgba(255,255,255,0.5)` | Subtitle text, time column, close button |
| 60% | `rgba(255,255,255,0.6)` | Inactive tab text, empty state heading |
| 70% | `rgba(255,255,255,0.7)` | Hover text on quick filters |

### Gold Opacity Patterns

| Opacity | Value | Usage |
|---------|-------|-------|
| 8% | `rgba(184,173,55,0.08)` | Selected card background, coin tag bg |
| 10% | `rgba(184,173,55,0.1)` | Sidebar active category bg |
| 15% | `rgba(184,173,55,0.15)` | Date count badge bg, detail panel gradient |
| 20% | `rgba(184,173,55,0.2)` | Active sidebar count badge bg, coin image shadow |
| 30% | `rgba(184,173,55,0.3)` | Active sidebar border, date card border, coin tag border |
| 40% | `rgba(184,173,55,0.4)` | Live card border |

---

## 2. Typography

**Font Family:** `'Inter', system-ui, sans-serif`

### Scale

| Element | Size | Weight | Other |
|---------|------|--------|-------|
| Page Title (h1) | `text-4xl` (~36px) | `font-bold` | `tracking-tight` |
| Page Subtitle | `text-base` (16px) | Normal | — |
| Detail Panel Title (h2) | `text-xl` (20px) | `font-bold` | `leading-snug` |
| Card Title (h3) | `15px` (custom) | `font-bold` | `leading-snug` |
| Section Date Headers | `text-sm` (14px) | `font-bold` | `uppercase tracking-widest`, gold color |
| Section Labels | `10px` (custom) | `font-extrabold` | `uppercase tracking-[0.15em]`, 30% white |
| Tab Labels | `text-sm` (14px) | `font-bold` | — |
| Card Description | `text-xs` (12px) | Normal | `line-clamp-2 leading-relaxed` |
| Badges / Type Labels | `11px` (custom) | `font-bold` | — |
| Countdown | `11px` (custom) | `font-medium` | — |
| Count Badges | `10px` (custom) | `font-extrabold` | — |
| Live Label | `10px` (custom) | `font-extrabold` | `uppercase tracking-wider` |
| Date Card Month | `9px` (custom) | `font-extrabold` | `uppercase` |
| Date Card Day | `text-lg` (18px) | `font-extrabold` | — |

---

## 3. Layout & Grid

### Page Container
```
max-width: max-w-7xl (80rem / 1280px)
padding: px-4 py-10
centered: container mx-auto
```

### Main Layout (3-column)
```
display: flex
gap: gap-8 (32px)

├── Sidebar:     w-56 (224px), sticky top-6, hidden below lg
├── Main Feed:   flex-1, min-w-0
└── Detail Panel: fixed, w-[420px], max-w-[calc(100vw-2rem)]
                  inset: top-4 right-4 bottom-4
```

### `/submit-event` Container
```
max-width: max-w-4xl (56rem / 896px)
padding: px-4 py-10

├── Left Column:  lg:w-[280px], flex-shrink-0 (image upload)
└── Right Column: flex-1 (form fields)
gap: gap-8
```

---

## 4. Component Catalog

### 4.1 Event Card (`EventCard.tsx`)

```
layout:         flex, gap-4, p-5
border-radius:  rounded-2xl (16px)
border:         border-2
background:     rgba(255,255,255,0.03) — default
                rgba(184,173,55,0.08) — selected
border-color:   rgba(255,255,255,0.08) — default
                #B8AD37 — selected
                rgba(184,173,55,0.4) — live
shadow:         none — default
                4px 4px 0px #B8AD37 — selected
                3px 3px 0px rgba(184,173,55,0.3) — live

Sub-elements:
├── Time Column:    min-w-[56px], centered text
├── Timeline Dot:   w-3 h-3 rounded-full, border-[3px]
├── Content:        flex-1, space-y-3
│   ├── Type Badge: inline-flex, px-2.5 py-1, rounded-lg, border-2, accent colored
│   ├── Title:      15px font-bold white
│   ├── Description: text-xs, line-clamp-2, 40% white
│   └── Meta Row:   flex justify-between
│       ├── Host + Attendees: text-xs, 40% white
│       └── Actions (hover): opacity-0 → opacity-100
└── Coin Avatar:    w-10 h-10, rounded-xl, border-2
```

### 4.2 Sidebar (`EventsSidebar.tsx`)

```
structure:      space-y-7

Categories Section:
├── Header:     10px font-extrabold uppercase tracking-[0.15em], 30% white
└── Items:      w-full flex justify-between, px-3 py-2.5, rounded-xl, border-2
    ├── Icon:   w-3.5 h-3.5
    ├── Label:  text-sm font-bold
    └── Count:  10px font-extrabold, px-1.5 py-0.5, rounded-md
    
    Active State:
      bg: rgba(184,173,55,0.1)
      color: #B8AD37
      border: rgba(184,173,55,0.3)
      shadow: 2px 2px 0px rgba(184,173,55,0.2)
    
    Inactive State:
      bg: transparent
      color: rgba(255,255,255,0.45)
      border: transparent

Quick Filters:
├── Items:      px-3 py-2.5, rounded-xl, text-sm font-medium
└── Hover:      bg rgba(255,255,255,0.04), color 70% white

Ad Space:
├── Container:  rounded-2xl, border-2, p-4
├── Ad Zone:    h-24, rounded-xl, border-2 border-dashed
└── CTA:        text-[11px] font-bold, gold color
```

### 4.3 Detail Panel (`EventDetailPanel.tsx`)

```
Backdrop:
  background: rgba(15,14,14,0.7)
  backdrop-filter: blur(4px)

Panel:
  position: fixed, z-50
  inset: top-4 right-4 bottom-4
  width: w-[420px]
  border-radius: rounded-2xl
  border: border-2, rgba(255,255,255,0.1)
  background: #1A1A1A
  shadow: 8px 8px 0px rgba(184,173,55,0.15), 0 25px 50px rgba(0,0,0,0.5)

Action Bar (sticky):
  background: rgba(26,26,26,0.95)
  backdrop-filter: blur(8px)
  border-bottom: border-b-2, rgba(255,255,255,0.06)
  
Hero Section:
  With coin: h-48, gradient bg (gold 15% → 3%)
    Coin image: w-20 h-20, rounded-2xl, border-3
    Image shadow: 4px 4px 0px rgba(184,173,55,0.2)
  Without coin: h-36, 2% white bg
    Icon container: w-16 h-16, rounded-2xl, border-2

Live Badge:
  background: #B8AD37
  color: #0F0E0E
  text: 10px font-extrabold
  animation: animate-pulse

Content Area: p-6, space-y-6

Date Card:
  border-radius: rounded-xl
  border: border-2, rgba(255,255,255,0.08)
  background: rgba(255,255,255,0.03)
  Calendar icon: w-14 h-14, rounded-xl, border-2
    border: rgba(184,173,55,0.3)
    bg: rgba(184,173,55,0.08)

Tags:
  text: 11px font-bold
  padding: px-3 py-1
  border-radius: rounded-lg
  border: border-2, rgba(255,255,255,0.08)
  hover: translate-y-[-1px]
  Coin tag: gold border + gold text + gold bg
```

### 4.4 Tab Pills

```
padding: px-5 py-2.5
border-radius: rounded-2xl
border: border-2
font: text-sm font-bold

Active:
  bg: #B8AD37
  color: #0F0E0E
  border: #B8AD37
  shadow: 3px 3px 0px #0F0E0E

Inactive:
  bg: rgba(255,255,255,0.05)
  color: rgba(255,255,255,0.6)
  border: rgba(255,255,255,0.1)
  shadow: none

Live dot (inside tab):
  w-2 h-2 rounded-full animate-pulse
  Active tab: #0F0E0E
  Inactive tab: #B8AD37
```

### 4.5 Search Pill

```
padding: px-4 py-2.5
border-radius: rounded-2xl
border: border-2, rgba(255,255,255,0.1)
background: rgba(255,255,255,0.03)
icon: w-4 h-4, rgba(255,255,255,0.3)
input: bg-transparent, text-sm, w-40
visibility: hidden md:flex
```

---

## 5. Borders & Shadows

### Neo-Brutalist Offset Shadows

| Element | Shadow |
|---------|--------|
| Primary CTA button | `4px 4px 0px #0F0E0E, 4px 4px 0px 1px #B8AD37` |
| Active tab | `3px 3px 0px #0F0E0E` |
| Selected card | `4px 4px 0px #B8AD37` |
| Live card | `3px 3px 0px rgba(184,173,55,0.3)` |
| Detail panel | `8px 8px 0px rgba(184,173,55,0.15), 0 25px 50px rgba(0,0,0,0.5)` |
| Active sidebar item | `2px 2px 0px rgba(184,173,55,0.2)` |
| Coin image (detail) | `4px 4px 0px rgba(184,173,55,0.2)` |

### Border Widths

| Context | Width |
|---------|-------|
| Default (cards, tabs, sidebar items, panels) | `border-2` (2px) |
| Timeline dot | `border-[3px]` (3px) |
| Coin image (detail panel) | `border-3` (3px) |
| Dashed zones (ad space, image upload) | `border-2 border-dashed` |

### Border Radius

| Context | Radius |
|---------|--------|
| Cards, tabs, buttons, panels | `rounded-2xl` (16px) |
| Inner cards (date, registration) | `rounded-xl` (12px) |
| Type badges, tags | `rounded-lg` (8px) |
| Count badges | `rounded-md` (6px) |
| Date count pill | `rounded-full` |
| Timeline dot, live pulse dot | `rounded-full` |

---

## 6. Animation (Framer Motion)

### Page Header
```js
initial: { opacity: 0, y: -10 }
animate: { opacity: 1, y: 0 }
transition: { duration: 0.4 }
```

### Event Cards (staggered)
```js
initial: { opacity: 0, y: 12 }
animate: { opacity: 1, y: 0 }
transition: {
  duration: 0.3,
  delay: index * 0.05,
  ease: [0.25, 0.46, 0.45, 0.94]  // custom cubic-bezier
}
```

### Detail Panel
```js
// Backdrop
initial: { opacity: 0 }
animate: { opacity: 1 }
exit: { opacity: 0 }
transition: { duration: 0.2 }

// Panel
initial: { opacity: 0, x: 40, scale: 0.97 }
animate: { opacity: 1, x: 0, scale: 1 }
exit: { opacity: 0, x: 40, scale: 0.97 }
transition: { duration: 0.25, ease: [0.25, 0.46, 0.45, 0.94] }
```

### Submit Event Form
```js
// Sections
initial: { opacity: 0, y: 12 }
animate: { opacity: 1, y: 0 }
transition: { duration: 0.4, delay: 0.05 }  // increments by 0.05

// External link field (conditional)
initial: { opacity: 0, height: 0 }
animate: { opacity: 1, height: 'auto' }
```

### CSS Animations
```
animate-pulse  — Live badge, live dot indicator
```

---

## 7. Interactive States

### Buttons

**Primary CTA (Gold)**
```
default:  bg #B8AD37, color #0F0E0E, border 2px #B8AD37
          shadow: 4px 4px 0px #0F0E0E, 4px 4px 0px 1px #B8AD37
hover:    translate-y-[-2px]
```

**Secondary (Outline)**
```
default:  bg transparent, color 70% white, border 2px 15% white
hover:    translate-y-[-1px]
```

**Icon Button**
```
size:     h-8 w-8 (or h-12 w-12 for detail panel share)
radius:   rounded-xl
border:   border-2, rgba(255,255,255,0.1)
color:    rgba(255,255,255,0.4) or rgba(255,255,255,0.5)
```

### Card Hover
```
Actions row: opacity-0 → group-hover:opacity-100 (transition-opacity)
```

### Sidebar Items
```
Active:   gold bg (10%), gold text, gold border (30%), gold shadow (2px 2px)
Inactive: transparent bg, 45% white text, transparent border
```

### Quick Filters (onMouseEnter/Leave)
```
hover:    bg rgba(255,255,255,0.04), color 70% white
default:  bg transparent, color 40% white
```

### Tags (Detail Panel)
```
hover:    translate-y-[-1px]
cursor:   pointer
```

---