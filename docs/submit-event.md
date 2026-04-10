## 8. `/submit-event` 

The submit event page uses **Tailwind theme tokens** instead of hardcoded values, making it theme-responsive rather than locked to Neo-Brutalist.

### Token Mapping

| Events Page (hardcoded) | Submit Event (token) |
|-------------------------|----------------------|
| `#0F0E0E` background | `bg-background` |
| `#fff` text | `text-foreground` |
| `#B8AD37` accent | `text-primary`, `bg-primary` |
| `rgba(255,255,255,0.4)` | `text-muted-foreground` |
| `rgba(255,255,255,0.03)` bg | `bg-muted/30` |
| `rgba(255,255,255,0.08)` border | `border-border/60` |

### Shadcn Components Used

| Component | Usage |
|-----------|-------|
| `Button` | Back button (`variant="ghost"`), Submit (`bg-primary`) |
| `Input` | Title, URLs, date/time, coin search |
| `Textarea` | Description (min-h-[100px], resize-none) |
| `Select` | Event category picker |
| `Label` | Field labels (10px-like: `text-xs font-semibold uppercase tracking-wider`) |
| `Badge` | Selected coins (`variant="outline"`) |

### Form-Specific Patterns

**Image Upload Zone**
```
aspect-ratio: aspect-square
border: border-2 border-dashed border-border/60
background: bg-muted/30 → hover bg-muted/50
radius: rounded-2xl
overlay on hover: bg-background/60 with Camera icon
remove button: w-7 h-7 rounded-full, bg-background/80
```

**Date/Time Widget**
```
container: rounded-xl, border border-border/60, bg-muted/20, p-4
start indicator: w-2.5 h-2.5 rounded-full bg-primary (solid)
end indicator: w-2.5 h-2.5 rounded-full border-2 border-muted-foreground/40 (hollow)
inputs: h-9, bg-muted/40, border-border/40
time input width: w-[120px]
timezone badge: Globe icon + "UTC" text
```

**Coin Selector Dropdown**
```
position: absolute z-20
container: rounded-lg, border border-border/60, bg-card, shadow-lg
max-height: max-h-48 overflow-y-auto
item: px-3 py-2.5, hover:bg-muted/50
coin image: w-6 h-6 rounded-full
```

**Submit Button**
```
width: w-full
height: h-12
radius: rounded-xl
font: font-semibold text-base
color: bg-primary text-primary-foreground
hover: bg-primary/90
```

---

## 9. Spacing Patterns

| Context | Value |
|---------|-------|
| Page padding | `px-4 py-10` |
| Header margin bottom | `mb-10` |
| Tab row margin bottom | `mb-8` |
| Section spacing | `space-y-10` |
| Card internal spacing | `space-y-3` (content), `p-5` (padding) |
| Card list spacing | `space-y-4` |
| Sidebar section spacing | `space-y-7` |
| Sidebar item spacing | `space-y-1` |
| Detail panel content | `p-6`, `space-y-6` |
| Form field spacing | `space-y-6` |
| Form label spacing | `space-y-2` |

---

## 10. Responsive Breakpoints

| Breakpoint | Behavior |
|------------|----------|
| Default (mobile) | Single column, no sidebar, no search pill |
| `md` (768px) | Header becomes flex-row; search pill visible |
| `lg` (1024px) | Sidebar visible; submit form becomes 2-column |

---