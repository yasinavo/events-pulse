# Events Prototype

A simple prototype of an events discovery platform built with Node.js/Express and vanilla JavaScript. Features 46+ mock crypto/meme coin events with real-time filtering, search, and modal detail views.

## 🚀 Quick Start

```bash
# Install dependencies
npm install

# Start the server
npm start

# Open in browser
http://localhost:3000
```

Server runs on **port 3000** with automatic API endpoint discovery.

---

## 📋 Features

✅ **46 Mock Events** — Realistic crypto events across 6 categories
✅ **Real-time Filtering** — Filter by category, status, date range
✅ **Fast Search** — Full-text search across titles, hosts, descriptions
✅ **Side Modal** — Click any event card to open beautiful detail panel
✅ **Pagination API** — Query params for limit/page (backend ready)
✅ **Event Grouping** — Cards grouped by date with "Today" labels
✅ **Responsive Design** — Works on desktop, tablet, mobile
✅ **Dark Theme** — eventPulse brand colors (#CDC13B accent)
✅ **Smooth Animations** — Slide-in modals, glowing badges

---

## 🏗️ Project Structure

```
events/
├── server.js                    # Express API backend
├── public/
│   ├── index.html              # Main UI template
│   ├── script.js               # API-driven JavaScript
│   └── styles.css              # Dark theme styling
├── data/
│   └── mockEvents.js           # 46 mock events dataset
├── package.json                # Dependencies & scripts
└── README.md                   # This file
```

---

## 🔌 API Endpoints

### List Events (with filters)
```
GET /api/events?category=space&status=live&limit=20&page=1
```
**Query Params:**
- `category` — space, ama, launch, airdrop, workshop, other
- `status` — live, upcoming, past
- `date_from` — ISO date (2026-03-20)
- `date_to` — ISO date (2026-03-31)
- `search` — Text search
- `sort` — date_asc, date_desc, attendees_desc, trending
- `limit` — Items per page (default 20, max 50)
- `page` — Page number (default 1)

**Response:**
```json
{
  "success": true,
  "data": [
    {
      "id": 1,
      "title": "Dogecoin Community Call",
      "type": "X Space",
      "category": "space",
      "date": "2026-03-20",
      "startTime": "14:00",
      "endTime": "15:30",
      "timezone": "EET",
      "status": "live",
      "attendees": 1243,
      "capacity": 1500,
      "host": { "name": "...", "avatar": "..." },
      "coin": { "symbol": "DOGE", "name": "Dogecoin" },
      "tags": ["#memecoins", "#dogecoin"],
      "emoji": "🐕",
      "description": "Weekly community discussion...",
      "thumbnail": "url"
    }
  ],
  "total": 52,
  "page": 1,
  "limit": 20
}
```

### Get Single Event
```
GET /api/events/1
```
Returns complete event details with full description.

### Get All Categories
```
GET /api/categories
```
**Response:**
```json
{
  "success": true,
  "data": [
    { "name": "space", "count": 15 },
    { "name": "ama", "count": 10 },
    { "name": "launch", "count": 8 }
  ]
}
```

### Search Events
```
GET /api/search?q=dogecoin
```
Searches across: title, host name, description, coin name, tags.

### Get Trending Events
```
GET /api/trending
```
Returns live events + top 5 upcoming events by attendees.

### Get Overview Stats
```
GET /api/stats
```
**Response:**
```json
{
  "success": true,
  "data": {
    "liveNow": 4,
    "upcomingThisWeek": 12,
    "totalAttendees": 48320,
    "breakdown": { "space": 15, "ama": 10, "launch": 8 }
  }
}
```

---

## 🎨 Design System

**Color Palette:**
- Background: `#0A0B0D` (dark)
- Surface: `#16171B` (cards)
- Accent: `#CDC13B` (brand yellow)
- Text: `#E8E8EC` (light)
- Text Muted: `#8B8D97` (secondary)

**Typography:**
- Font: Inter (400/500/600/700)
- H1: 36px, 700 weight
- H2: 24px, 700 weight
- Body: 14/16px, 400 weight

**Components:**
- Event cards with hover effects
- Category badges (color-coded by type)
- Floating modal panel (520px wide)
- Sticky navigation & sidebar
- Responsive thumbnail images

---

## 📦 Event Data Structure

Each event contains:
```javascript
{
  id: Number,
  title: String,
  type: String,              // "X Space", "AMA", etc.
  category: String,          // space, ama, launch, airdrop, workshop, other
  emoji: String,             // Event icon/emoji
  date: String,              // "2026-03-20" (ISO)
  startTime: String,         // "14:00" (24-hour)
  endTime: String,           // "15:30"
  timezone: String,          // "EET", "UTC", etc.
  status: String,            // "live", "upcoming", "past"
  attendees: Number,         // Current/registered count
  capacity: Number,          // Max capacity
  host: {
    name: String,
    avatar: String,          // 2-3 char initials
    url: String              // Host's website/social
  },
  coin: {
    symbol: String,          // "DOGE", "PEPE", etc.
    name: String,
    url: String
  },
  thumbnail: String,         // Image URL
  heroGradient: String,      // Fallback gradient
  description: String,       // 1-2 line teaser
  fullDescription: String,   // Longer text for modal
  tags: Array<String>,       // Hashtags
  cta: {
    text: String,            // e.g., "Join Space"
    url: String
  }
}
```

**Sample Data Distribution:**
- 4 Live events (in progress)
- 28 Upcoming events (future)
- 18 Past events (historical)
- Real crypto projects: Dogecoin, PEPE, BONK, Solana, Lido, Jupiter, etc.

---

## 🔧 Frontend Integration

The JavaScript fetches from the API automatically:

```javascript
// On page load
fetchCategories() → Updates sidebar counts
fetchStats()      → Updates hero statistics
fetchEvents()     → Renders event cards

// On category filter click
category.addEventListener('click', () => {
  fetchEvents({ category: 'space' })
})

// On search input (debounced 300ms)
searchInput.addEventListener('input', debounce(() => {
  searchEvents(query)
}))

// On event card click
card.addEventListener('click', () => {
  openModal(cardId) → Fetches /api/events/:id → populateModal()
})
```

---

## 🚀 Deployment Strategy

**To use a real database later:**

1. Replace `mockEvents.js` with database query:
   ```javascript
   // Instead of: import { mockEvents } from './data/mockEvents.js'
   const events = await db.Event.findAll(query)
   ```

2. Update filtering logic in `server.js`:
   ```javascript
   // Add SQL .where() clauses instead of array filtering
   ```

3. Everything else stays the same — frontend makes no changes!

---

## 🧪 Testing Checklist

- [ ] Server starts without errors (`npm start`)
- [ ] Homepage loads at http://localhost:3000
- [ ] Events render with thumbnails and badges
- [ ] Category filters change the event list
- [ ] Search filters events in real-time
- [ ] Event card click opens modal
- [ ] Modal prev/next navigation works
- [ ] Copy link button copies URL
- [ ] Stats update based on filters
- [ ] Responsive on mobile (< 520px)
- [ ] All buttons are clickable (no console errors)

---

## 📋 Roadmap

**Phase 1** ✅ Done
- Static prototype with mock data
- Express API with 6 endpoints
- Vanilla JS integration
- Beautiful modal detail view

**Phase 2** (Next)
- Real database integration (Supabase/Firebase)
- User authentication
- Event submission form
- Calendar booking system

**Phase 3** (Future)
- Real-time event updates (WebSockets)
- User event calendar / RSVP
- Email notifications
- Advanced analytics dashboard

---

## 📝 Environment Setup

The app uses these environment variables (optional):

Create `.env` file:
```
PORT=3000
NODE_ENV=development
```

---

## 🤝 Contributing

1. Fork the repo
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit changes (`git commit -m 'Add amazing feature'`)
4. Push to branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request


---

## 🆘 Troubleshooting

**Port 3000 already in use:**
```bash
# Find process on port 3000
lsof -i :3000
# Kill it
kill -9 <PID>
```

**Module not found:**
```bash
# Reinstall dependencies
rm -rf node_modules package-lock.json
npm install
```

**API returns 404:**
Check that `server.js` is running and curl the endpoint:
```bash
curl http://localhost:3000/api/events
```

---

