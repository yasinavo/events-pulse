import express from 'express';
import cors from 'cors';
import path from 'path';
import { fileURLToPath } from 'url';
import { mockEvents, categories } from './data/mockEvents.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(express.json());
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));
app.use(express.static(path.join(__dirname, 'public'), { index: false }));

// ════════════════════════════════════════════════════
// ✨ HELPER FUNCTIONS
// ════════════════════════════════════════════════════

function normalizeCategory(event) {
  if (!event) return 'other';

  const rawCategory = String(event.category || '').toLowerCase();
  const rawType = String(event.type || '').toLowerCase();

  if (rawCategory === 'xspaces' || rawCategory === 'ama' || rawCategory === 'exchange' || rawCategory === 'livestream' || rawCategory === 'other') {
    return rawCategory;
  }

  if (rawCategory === 'space') return 'xspaces';
  if (rawCategory === 'ama') return 'ama';
  if (rawCategory === 'launch' || rawCategory === 'airdrop') return 'exchange';
  if (rawCategory === 'other' && rawType.includes('live')) return 'livestream';
  if (rawType.includes('live')) return 'livestream';

  return 'other';
}

function serializeEvent(event) {
  return {
    ...event,
    category: normalizeCategory(event),
  };
}

function filterEvents(query) {
  let results = [...mockEvents];

  // Filter by category
  if (query.category) {
    const categories = query.category.split(',').map(c => c.trim());
    if (!categories.includes('all')) {
      results = results.filter(e => categories.includes(normalizeCategory(e)));
    }
  }

  // Filter by status (live, upcoming, past)
  if (query.status) {
    const statuses = query.status.split(',').map(s => s.trim());
    results = results.filter(e => statuses.includes(e.status));
  }

  // Filter by date range
  if (query.fromDate) {
    results = results.filter(e => e.date >= query.fromDate);
  }
  if (query.toDate) {
    results = results.filter(e => e.date <= query.toDate);
  }

  // Search
  if (query.search) {
    const searchTerm = query.search.toLowerCase();
    results = results.filter(e =>
      e.title.toLowerCase().includes(searchTerm) ||
      e.description.toLowerCase().includes(searchTerm) ||
      e.host.name.toLowerCase().includes(searchTerm) ||
      e.coin.symbol.toLowerCase().includes(searchTerm)
    );
  }

  return results;
}

function sortEvents(results, sortBy) {
  const sorted = [...results];
  switch (sortBy) {
    case 'date_asc':
      return sorted.sort((a, b) => new Date(a.date + ' ' + a.startTime) - new Date(b.date + ' ' + b.startTime));
    case 'date_desc':
      return sorted.sort((a, b) => new Date(b.date + ' ' + b.startTime) - new Date(a.date + ' ' + a.startTime));
    case 'attendees_desc':
      return sorted.sort((a, b) => b.attendees - a.attendees);
    case 'trending':
      // Trending: live first, then upcoming by attendees, then past
      return sorted.sort((a, b) => {
        const statusOrder = { live: 0, upcoming: 1, past: 2 };
        if (statusOrder[a.status] !== statusOrder[b.status]) {
          return statusOrder[a.status] - statusOrder[b.status];
        }
        return b.attendees - a.attendees;
      });
    default:
      return sorted.sort((a, b) => new Date(a.date + ' ' + a.startTime) - new Date(b.date + ' ' + b.startTime));
  }
}

// ════════════════════════════════════════════════════
// 🔌 API ROUTES
// ════════════════════════════════════════════════════

/**
 * GET /api/events
 * List all events with filters and pagination
 * 
 * Query params:
 * - category: comma-separated category IDs (e.g., "space,ama")
 * - status: comma-separated status (live, upcoming, past)
 * - fromDate: YYYY-MM-DD
 * - toDate: YYYY-MM-DD
 * - search: search term
 * - sort: date_asc, date_desc, attendees_desc, trending
 * - limit: number of results (default 20)
 * - page: page number (default 1)
 */
app.get('/api/events', (req, res) => {
  const limit = parseInt(req.query.limit) || 20;
  const page = parseInt(req.query.page) || 1;
  const sort = req.query.sort || 'date_asc';

  let results = filterEvents(req.query);
  results = sortEvents(results, sort);

  const total = results.length;
  const startIdx = (page - 1) * limit;
  const paginatedResults = results.slice(startIdx, startIdx + limit);

  res.json({
    success: true,
    data: paginatedResults.map(serializeEvent),
    pagination: {
      total,
      limit,
      page,
      pages: Math.ceil(total / limit),
      hasMore: startIdx + limit < total,
    },
  });
});

/**
 * GET /api/events/:id
 * Get a single event by ID
 */
app.get('/api/events/:id', (req, res) => {
  const event = mockEvents.find(e => e.id === parseInt(req.params.id));
  if (!event) {
    return res.status(404).json({ success: false, error: 'Event not found' });
  }
  res.json({ success: true, data: serializeEvent(event) });
});

/**
 * GET /api/categories
 * Get all categories with event counts
 */
app.get('/api/categories', (req, res) => {
  const categoryData = categories.map(cat => {
    const count =
      cat.id === 'all'
        ? mockEvents.length
        : mockEvents.filter(e => normalizeCategory(e) === cat.id).length;
    return { ...cat, count };
  });
  res.json({ success: true, data: categoryData });
});

/**
 * GET /api/search
 * Search events
 */
app.get('/api/search', (req, res) => {
  if (!req.query.q) {
    return res.status(400).json({ success: false, error: 'Search query required' });
  }

  const searchTerm = req.query.q.toLowerCase();
  const results = mockEvents.filter(e =>
    e.title.toLowerCase().includes(searchTerm) ||
    e.description.toLowerCase().includes(searchTerm) ||
    e.host.name.toLowerCase().includes(searchTerm) ||
    e.coin.symbol.toLowerCase().includes(searchTerm) ||
    e.tags.some(tag => tag.toLowerCase().includes(searchTerm))
  );

  res.json({
    success: true,
    query: req.query.q,
    results: results.map(serializeEvent),
    count: results.length,
  });
});

/**
 * GET /api/trending
 * Get trending events (live + popular upcoming)
 */
app.get('/api/trending', (req, res) => {
  const liveEvents = mockEvents.filter(e => e.status === 'live');
  const upcomingPopular = mockEvents
    .filter(e => e.status === 'upcoming')
    .sort((a, b) => b.attendees - a.attendees)
    .slice(0, 5);

  const trending = [...liveEvents, ...upcomingPopular];

  res.json({
    success: true,
    data: trending.map(serializeEvent),
    count: trending.length,
  });
});

/**
 * GET /api/stats
 * Get overview statistics
 */
app.get('/api/stats', (req, res) => {
  const stats = {
    totalEvents: mockEvents.length,
    liveNow: mockEvents.filter(e => e.status === 'live').length,
    upcomingThisWeek: mockEvents.filter(e => {
      if (e.status !== 'upcoming') return false;
      const eventDate = new Date(e.date);
      const today = new Date('2026-03-20');
      const weekFromToday = new Date(today);
      weekFromToday.setDate(weekFromToday.getDate() + 7);
      return eventDate >= today && eventDate <= weekFromToday;
    }).length,
    totalAttendees: mockEvents.reduce((sum, e) => sum + e.attendees, 0),
    categoryBreakdown: categories
      .filter(c => c.id !== 'all')
      .map(cat => ({
        category: cat.label,
        count: mockEvents.filter(e => normalizeCategory(e) === cat.id).length,
      })),
  };

  res.json({ success: true, data: stats });
});

// ════════════════════════════════════════════════════
// 📄 SERVE INDEX
// ════════════════════════════════════════════════════

app.get('/', (req, res) => {
  res.render('index', { pageTitle: 'Events - Capitoday' });
});

app.get('/submit', (req, res) => {
  res.render('submit', { pageTitle: 'Submit Event - Capitoday' });
});

// Keep legacy static paths working after switching to server-rendered routes.
app.get('/index.html', (req, res) => {
  res.redirect('/');
});

app.get('/submit.html', (req, res) => {
  res.redirect('/submit');
});

// ════════════════════════════════════════════════════
// 🚀 START SERVER
// ════════════════════════════════════════════════════

app.listen(PORT, () => {
  console.log(`
╔═════════════════════════════════════════════════════╗
║  🚀 Capitoday Events API Running                    ║
╠═════════════════════════════════════════════════════╣
║  📍 Server: http://localhost:${PORT}                    ║
║  📊 API:    http://localhost:${PORT}/api/events         ║
║  📚 Docs:   Check README.md for full API docs      ║
╚═════════════════════════════════════════════════════╝

Available Endpoints:
  • GET  /api/events          - List events with filters
  • GET  /api/events/:id      - Get event details
  • GET  /api/categories      - Get all categories
  • GET  /api/search?q=term   - Search events
  • GET  /api/trending        - Get trending events
  • GET  /api/stats           - Get overview stats
`);
});
