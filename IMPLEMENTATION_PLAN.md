# Capitoday Events Listing Page - Implementation Plan

**Status**: Architecture & Planning Phase  
**Date**: April 10, 2026  
**Project Type**: Node.js Prototype with Mock Data  

---

## 📋 Executive Summary

Build a fully functional events listing prototype for Capitoday that combines:
- Existing polished UI design (dark theme, Capitoday yellow accent #CDC13B)
- Luma.com-inspired event discovery & calendar experience
- Smooth, intuitive interactions with side modal details panel
- Mock data with 50+ realistic events across multiple categories

**Key Inspiration Points**:
- **Lovable UI**: Meme coin dashboard event cards, compact layout, category filters
- **Luma.com**: Event discovery, calendar integration, attendee counts, categorization

---

## 🎨 Current Design Analysis

### What Exists ✅
**HTML Structure** (index.html):
- Top navigation with logo, nav links, submit event button
- Hero section with title, live event count
- 3-column grid: Sidebar (categories/filters) | Feed (event cards) | Right sidebar (mini calendar)
- 8 hardcoded mock events across 6 categories
- Floating modal panel for event details (right-aligned, backdrop blur)
- Responsive breakpoints for mobile/tablet

**Styling** (styles.css):
- Dark mode with sophisticated palette (bg: #0A0B0D, accent: #CDC13B)
- Smooth animations & transitions (cubic-bezier timing)
- Event type badges with color-coded system (space=blue, AMA=purple, launch=orange, airdrop=green)
- Mini calendar with event indicators
- Floating panel with smooth slide-in animation

**JavaScript** (script.js):
- 8 events in `eventData` object with detailed metadata
- Modal open/close/navigation logic
- Category & filter interactions
- Event badge population

### Gaps to Address 🔧
1. ❌ No backend/database (static HTML only)
2. ❌ Only 8 events (need 50+ with variety)
3. ❌ Category filtering not fully wired
4. ❌ Calendar clicks don't filter events
5. ❌ Search functionality incomplete
6. ❌ No pagination/infinite scroll
7. ❌ No API structure for future expansion

---

## 🏗️ Recommended Architecture

### Tech Stack

```
📦 Node.js + Express Server
├── REST API endpoints (/api/events, /api/categories, etc.)
├── Serve static frontend (index.html, styles.css, scripts)
└── JSON mock data storage

🎨 Frontend (Keep Existing)
├── HTML5 semantic structure
├── CSS3 with modern features (backdrop-filter, CSS Grid)
└── Vanilla JavaScript (no frameworks needed)

📊 Mock Data Strategy
├── 50+ events with realistic metadata
├── Multiple categories, dates, attendee counts
├── Mix of live, upcoming, and past events
└── Varied thumbnail images/gradients
```

### Project Structure

```
capitoday-events/
├── package.json
├── .gitignore
├── server.js (Express app, port 3000)
├── 
├── data/
│   └── mockEvents.js (50+ events, exportable)
│
├── routes/
│   └── api.js (GET /events, /categories, etc.)
│
├── public/
│   ├── index.html (frontend, minimal changes)
│   ├── styles.css (unchanged from design)
│   ├── script.js (fetch from API instead of hardcoded)
│   └── assets/
│       └── (favicon, logos if needed)
│
└── README.md (setup & usage instructions)
```

---

## ✨ Key Features to Implement

### 1. **Events API** (`GET /api/events`)
- Filter by category: `?category=space,ama`
- Filter by date: `?fromDate=2026-03-20&toDate=2026-03-25`
- Filter by status: `?status=live,upcoming,past`
- Sort by: `?sort=date_asc|date_desc|attendees_desc|trending`
- Pagination: `?limit=20&page=1`
- Search: `?search=dogecoin`

**Response**:
```json
{
  "success": true,
  "data": [
    {
      "id": 1,
      "title": "Dogecoin Community Call",
      "type": "X Space",
      "emoji": "🐕",
      "date": "2026-03-20",
      "time": "14:00",
      "status": "live",
      "attendees": 1243,
      "host": "Dogecoin Foundation",
      "category": "space",
      "thumbnail": "https://...",
      "description": "...",
      ...
    }
  ],
  "total": 52,
  "hasMore": true
}
```

### 2. **Categories API** (`GET /api/categories`)
Returns all available categories with event counts:
```json
{
  "data": [
    { "id": "all", "label": "All Events", "count": 52, "icon": "grid" },
    { "id": "space", "label": "X Spaces", "count": 12, "icon": "mic" },
    { "id": "ama", "label": "AMAs", "count": 8, "icon": "chat" },
    ...
  ]
}
```

### 3. **Event Detail** (`GET /api/events/:id`)
Returns full event metadata for modal display

### 4. **Search & Filtering (Frontend)**
- Real-time search across title, host, description
- Multi-select category filters
- Date range picker
- Status toggle (live/upcoming/past)
- Quick filters (today, this week, this month)

### 5. **Enhanced Mock Data**
Replace hardcoded 8 events with 50+ realistic events:
- Varied event types across categories
- Mix of past (March 1-19), live (March 20), upcoming (March 21+)
- Different attendee counts (100-5000)
- Real event titles & descriptions
- Real host names & avatars
- Gradient fallbacks for thumbnails

---

## 📅 Implementation Phases

### **Phase 1: Backend Setup** (1-2 hours)
- [ ] Initialize Node.js/Express project
- [ ] Create mock events dataset (50+ events)
- [ ] Build REST API endpoints
- [ ] Test API with curl/Postman

### **Phase 2: Frontend Integration** (1-2 hours)
- [ ] Update script.js to fetch from API instead of hardcoded
- [ ] Wire category filtering to API calls
- [ ] Connect search to search endpoint
- [ ] Add loading states & error handling

### **Phase 3: Enhanced Features** (1-2 hours)
- [ ] Calendar integration (click to filter by date)
- [ ] Pagination/infinite scroll support
- [ ] Improved search with highlighting
- [ ] Copy event link functionality
- [ ] Responsive modal on mobile

### **Phase 4: Polish & Testing** (1 hour)
- [ ] Cross-browser testing
- [ ] Performance optimization
- [ ] Accessibility audit (a11y)
- [ ] Documentation & deployment

---

## 🎯 Design Decisions

### Why Keep Existing Design?
✅ **Already excellent UX**:
- Clean, modern dark theme
- Clear visual hierarchy
- Smooth animations
- Intuitive filtering
- Accessible color contrasts

### Why Node.js/Express?
✅ **Perfect fit for prototype**:
- Simple to set up (3-5 files)
- Serves both API & static content
- Easy to extend to real backend later
- Good for learning/portfolio

### Why REST API?
✅ **Future-proof**:
- Can be swapped for Next.js/NestJS later
- Can integrate real database (MongoDB/PostgreSQL)
- Enables mobile app later
- Standard industry pattern

---

## 📊 Mock Data Strategy

### Event Count Distribution
```
Total: 52 events

By Type:
  - X Spaces:     15 events (29%)
  - AMAs:         10 events (19%)
  - Token Launches: 8 events (15%)
  - Workshops:     6 events (12%)
  - Airdrops:      7 events (13%)
  - Other:         6 events (12%)

By Status:
  - Past:  18 events (March 1-19, 2026)
  - Live:   4 events (March 20, 2026) ⭐
  - Upcoming: 30 events (March 21-31+, 2026)

By Attendee Range:
  - 100-500:      15 events
  - 500-1000:     15 events
  - 1000-2000:    12 events
  - 2000-5000:    10 events
```

### Event Data Structure
```javascript
{
  id: 1,
  title: "Dogecoin Community Call",
  type: "X Space",
  typeIcon: "mic",
  category: "space",
  emoji: "🐕",
  date: "2026-03-20",
  time: "14:00",
  endTime: "15:30",
  timezone: "EET",
  status: "live", // live | upcoming | past
  attendees: 1243,
  capacity: 5000,
  host: {
    name: "Dogecoin Foundation",
    avatar: "DF",
    avatarClass: "default",
    bio: "Official Dogecoin Foundation...",
    link: "https://dogecoin.com"
  },
  thumbnail: "https://images.unsplash.com/...",
  heroGradient: "linear-gradient(135deg, #c4a935 0%, #8b7a1e 100%)",
  description: "Weekly community discussion...",
  fullDescription: "Weekly community discussion about DOGE ecosystem updates, partnerships, and upcoming developments...",
  coin: {
    symbol: "DOGE",
    name: "Dogecoin",
    link: "https://..."
  },
  tags: ["#memecoins", "#dogecoin", "#community"],
  cta: {
    text: "Join Space",
    link: "https://x.com/i/spaces/...",
    icon: "external-link"
  },
  links: {
    contact: "https://...",
    report: "https://..."
  }
}
```

---

## 🔄 API Endpoints Summary

| Method | Endpoint | Purpose |
|--------|----------|---------|
| GET | `/api/events` | List events with filters |
| GET | `/api/events/:id` | Get event details |
| GET | `/api/categories` | Get all categories |
| GET | `/api/search?q=term` | Search events |
| GET | `/api/trending` | Get trending events |
| GET | `/api/stats` | Get overview stats (live count, etc.) |

---

## 🚀 Getting Started Checklist

- [ ] Create Node.js project structure
- [ ] Install dependencies (express, cors, dotenv)
- [ ] Create mock data file with 50+ events
- [ ] Build API router with all endpoints
- [ ] Update frontend JavaScript to use API
- [ ] Test all features locally
- [ ] Document API in README.md
- [ ] Prepare for deployment (Render, Railway, Vercel)

---

## 📝 Next Steps

1. **Confirm this architecture** - Do you want to proceed with Node.js/Express?
2. **Review mock data** - Do you want me to generate 50+ realistic events?
3. **Start implementation** - Ready to build the backend?

---

**Estimated Timeline**: 4-6 hours total  
**Complexity**: Medium (setup + data generation + API)  
**Outcome**: Production-ready prototype that showcases full events discovery experience
