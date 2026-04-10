// ═══════════════════════════════════════════
// Capitoday Events — API Integration
// ═══════════════════════════════════════════

const API_BASE = 'http://localhost:3000/api';
let allEvents = [];
let currentEventId = null;
let eventIds = [];
const noMediaEventIds = new Set([2, 5, 8, 11]);
const TODAY_DATE = '2026-03-20';
let calendarViewDate = new Date(`${TODAY_DATE}T00:00:00`);
let selectedCalendarDate = null;
let currentFilters = {
  category: 'all',
  status: '',
  search: '',
  sort: 'date_asc'
};

// ════════════════════════════════════════════
// 📡 API CALLS
// ════════════════════════════════════════════

async function fetchEvents(filters = {}) {
  try {
    const params = new URLSearchParams();
    
    if (filters.category && filters.category !== 'all') {
      params.append('category', filters.category);
    }
    if (filters.status) {
      params.append('status', filters.status);
    }
    if (filters.search) {
      params.append('search', filters.search);
    }
    if (filters.sort) {
      params.append('sort', filters.sort);
    }
    params.append('limit', 50);

    const response = await fetch(`${API_BASE}/events?${params}`);
    const result = await response.json();
    
    if (!result.success) throw new Error('Failed to fetch events');
    
    allEvents = result.data;
    eventIds = result.data.map(e => e.id);
    renderEventCards();
  } catch (error) {
    console.error('Error fetching events:', error);
    showError('Failed to load events');
  }
}

async function fetchCategories() {
  try {
    const response = await fetch(`${API_BASE}/categories`);
    const result = await response.json();
    if (!result.success) throw new Error('Failed to fetch categories');
    updateCategoryUI(result.data);
  } catch (error) {
    console.error('Error fetching categories:', error);
  }
}

async function fetchStats() {
  try {
    const response = await fetch(`${API_BASE}/stats`);
    const result = await response.json();
    if (!result.success) throw new Error('Failed to fetch stats');
    updateStatsUI(result.data);
  } catch (error) {
    console.error('Error fetching stats:', error);
  }
}

async function searchEvents(query) {
  try {
    const response = await fetch(`${API_BASE}/search?q=${encodeURIComponent(query)}`);
    const result = await response.json();
    if (!result.success) throw new Error('Search failed');
    allEvents = result.results;
    eventIds = result.results.map(e => e.id);
    renderEventCards();
  } catch (error) {
    console.error('Error searching events:', error);
  }
}

// ════════════════════════════════════════════
// 🎨 RENDER FUNCTIONS
// ════════════════════════════════════════════

function renderEventCards() {
  const feed = document.querySelector('.feed');
  if (!feed) return;

  updateTodayTabVisibility();
  renderCalendar();

  const visibleEvents = selectedCalendarDate
    ? allEvents.filter(event => event.date === selectedCalendarDate)
    : allEvents;

  // Group events by date
  const eventsByDate = {};
  visibleEvents.forEach(event => {
    if (!eventsByDate[event.date]) {
      eventsByDate[event.date] = [];
    }
    eventsByDate[event.date].push(event);
  });

  // Clear feed
  const dateGroups = feed.querySelectorAll('.date-group');
  dateGroups.forEach(g => g.remove());

  // Render each date group
  Object.keys(eventsByDate).sort().forEach(date => {
    const events = eventsByDate[date];
    const dateGroup = createDateGroup(date, events);
    feed.appendChild(dateGroup);
  });
}

function renderCalendar() {
  const calGrid = document.querySelector('.cal-grid');
  const calMonth = document.querySelector('.cal-month');
  if (!calGrid || !calMonth) return;

  // Keep weekday labels, replace only day cells.
  calGrid.querySelectorAll('.cal-day').forEach(cell => cell.remove());

  const year = calendarViewDate.getFullYear();
  const month = calendarViewDate.getMonth();
  const firstWeekday = new Date(year, month, 1).getDay();
  const daysInMonth = new Date(year, month + 1, 0).getDate();

  calMonth.textContent = calendarViewDate
    .toLocaleDateString('en-US', { month: 'long', year: 'numeric' })
    .toUpperCase();

  const monthEvents = allEvents.filter(event => {
    const eventDate = new Date(`${event.date}T00:00:00`);
    return eventDate.getFullYear() === year && eventDate.getMonth() === month;
  });

  const eventDaySet = new Set(
    monthEvents.map(event => new Date(`${event.date}T00:00:00`).getDate())
  );

  for (let i = 0; i < firstWeekday; i += 1) {
    const empty = document.createElement('span');
    empty.className = 'cal-day';
    calGrid.appendChild(empty);
  }

  for (let day = 1; day <= daysInMonth; day += 1) {
    const cell = document.createElement('span');
    const dateStr = `${year}-${String(month + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
    const isToday = dateStr === TODAY_DATE;

    cell.className = 'cal-day';
    if (eventDaySet.has(day)) cell.classList.add('has-event');
    if (isToday) cell.classList.add('today');
    if (selectedCalendarDate === dateStr) cell.classList.add('selected');

    cell.textContent = String(day);
    cell.addEventListener('click', () => onCalendarDayClick(dateStr));
    calGrid.appendChild(cell);
  }
}

function onCalendarDayClick(dateStr) {
  selectedCalendarDate = selectedCalendarDate === dateStr ? null : dateStr;
  renderEventCards();
}

function shiftCalendarMonth(offset) {
  calendarViewDate = new Date(
    calendarViewDate.getFullYear(),
    calendarViewDate.getMonth() + offset,
    1
  );
  selectedCalendarDate = null;
  renderCalendar();
}

function createDateGroup(dateStr, events) {
  const div = document.createElement('div');
  div.className = 'date-group';

  const isToday = dateStr === TODAY_DATE;
  const dateObj = new Date(dateStr);
  const dayName = dateObj.toLocaleDateString('en-US', { weekday: 'long' });
  const monthDay = dateObj.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });

  let dateLabel = isToday ? `Today &middot; ${dayName}` : `${monthDay} &middot; ${dayName}`;

  const header = document.createElement('div');
  header.className = 'date-header';
  header.innerHTML = `
    <h2>${dateLabel}</h2>
    <span class="date-count">${events.length} event${events.length !== 1 ? 's' : ''}</span>
  `;
  div.appendChild(header);

  events.forEach(event => {
    div.appendChild(createEventCard(event));
  });

  return div;
}

function createEventCard(event) {
  const card = document.createElement('article');
  card.className = 'event-card';
  card.dataset.event = event.id;
  card.onclick = () => openModal(card);

  const statusHTML = (() => {
    if (event.status === 'live') {
      return `<span class="event-live-tag"><span class="pulse-dot"></span> LIVE</span>`;
    } else if (event.status === 'upcoming') {
      return `<span class="event-countdown">Upcoming</span>`;
    }
    return '';
  })();

  const showMedia = !noMediaEventIds.has(event.id);
  const thumbnail = !showMedia
    ? ''
    : event.thumbnail
      ? `<div class="event-thumb has-thumb"><img src="${event.thumbnail}" alt="${event.title}" loading="lazy"></div>`
      : `<div class="event-thumb"><div class="thumb-placeholder" style="background: ${event.heroGradient};"><span>${event.emoji}</span></div></div>`;

  card.innerHTML = `
    <div class="event-time">
      <span class="time-dot ${event.status === 'live' ? 'live' : ''}"></span>
      <span>${event.startTime}</span>
    </div>
    <div class="event-body">
      <div class="event-meta-top">
        <span class="event-type-badge ${event.category}">
          ${getIconForCategory(event.category)}
          ${event.type}
        </span>
        ${statusHTML}
      </div>
      <h3 class="event-title">${event.title}</h3>
      <p class="event-desc">${event.description}</p>
      <div class="event-meta-bottom">
        <div class="event-host">
          <div class="host-avatar ${event.host.avatarClass}">${event.host.avatar}</div>
          <span>${event.host.name}</span>
        </div>
        <div class="event-stats">
          <span class="coin-tag ${event.coin.symbol === 'MULTI' ? 'multi' : ''}">${event.coin.symbol}</span>
        </div>
      </div>
    </div>
    ${thumbnail}
  `;

  return card;
}

function getIconForCategory(category) {
  const icons = {
    xspaces: '<svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M12 1a3 3 0 0 0-3 3v8a3 3 0 0 0 6 0V4a3 3 0 0 0-3-3z"/><path d="M19 10v2a7 7 0 0 1-14 0v-2"/></svg>',
    ama: '<svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/></svg>',
    exchange: '<svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M4.5 16.5c-1.5 1.26-2 5-2 5s3.74-.5 5-2c.71-.84.7-2.13-.09-2.91a2.18 2.18 0 0 0-2.91-.09z"/><path d="M12 15l-3-3a22 22 0 0 1 2-3.95A12.88 12.88 0 0 1 22 2c0 2.72-.78 7.5-6 11a22.35 22.35 0 0 1-4 2z"/></svg>',
    livestream: '<svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="2" y="7" width="15" height="10" rx="2"/><path d="M17 10l5-3v10l-5-3z"/></svg>',
    other: '<svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></svg>'
  };
  return icons[category] || icons.other;
}

function updateCategoryUI(categoryData) {
  const catList = document.querySelector('.cat-list');
  if (!catList) return;

  const items = catList.querySelectorAll('.cat-item');
  items.forEach(item => {
    const catId = item.dataset.cat;
    const cat = categoryData.find(c => c.id === catId);
    if (cat) {
      const countSpan = item.querySelector('.cat-count');
      if (countSpan) countSpan.textContent = cat.count;
    }
  });
}

function updateStatsUI(stats) {
  const liveNowSpan = document.querySelector('.stat-pill .stat-dot.live')?.parentElement;
  if (liveNowSpan) {
    liveNowSpan.innerHTML = `<span class="stat-dot live"></span><span>${stats.liveNow} Live Now</span>`;
  }
}

function updateTodayTabVisibility() {
  const todayTab = document.querySelector('.tab[data-tab="today"]');
  const todayCount = allEvents.filter(event => event.date === TODAY_DATE).length;
  const todayCountEl = document.getElementById('todayTabCount');

  if (todayCountEl) {
    todayCountEl.textContent = String(todayCount);
  }

  if (!todayTab) return;

  if (todayCount > 0) {
    todayTab.style.display = 'inline-flex';
  } else {
    todayTab.style.display = 'none';
    if (todayTab.classList.contains('active')) {
      todayTab.classList.remove('active');
      const allTab = document.querySelector('.tab[data-tab="all"]');
      if (allTab) allTab.classList.add('active');
      currentFilters.status = '';
    }
  }
}

// ════════════════════════════════════════════
// 🎯 MODAL FUNCTIONS
// ════════════════════════════════════════════

async function openModal(cardEl) {
  const id = parseInt(cardEl.dataset.event);
  currentEventId = id;

  try {
    const response = await fetch(`${API_BASE}/events/${id}`);
    const result = await response.json();
    if (!result.success) throw new Error('Event not found');
    populateModal(result.data);
  } catch (error) {
    console.error('Error loading event:', error);
  }

  document.getElementById('modalBackdrop').classList.add('open');
  document.getElementById('modalPanel').classList.add('open');
  document.getElementById('modalPanel').setAttribute('aria-hidden', 'false');
  document.body.classList.add('modal-open');
  document.getElementById('modalScroll').scrollTop = 0;
}

function closeModal() {
  document.getElementById('modalBackdrop').classList.remove('open');
  document.getElementById('modalPanel').classList.remove('open');
  document.getElementById('modalPanel').setAttribute('aria-hidden', 'true');
  document.body.classList.remove('modal-open');
  currentEventId = null;
}

async function navigateEvent(direction) {
  if (!currentEventId) return;
  const idx = eventIds.indexOf(currentEventId);
  const newIdx = idx + direction;
  if (newIdx < 0 || newIdx >= eventIds.length) return;
  currentEventId = eventIds[newIdx];

  try {
    const response = await fetch(`${API_BASE}/events/${currentEventId}`);
    const result = await response.json();
    if (!result.success) throw new Error('Event not found');
    populateModal(result.data);
  } catch (error) {
    console.error('Error loading event:', error);
  }

  document.getElementById('modalScroll').scrollTop = 0;
}

function populateModal(ev) {
  if (!ev) return;
  const hideMedia = noMediaEventIds.has(ev.id);

  // Hero
  const heroImg = document.getElementById('modalHeroImg');
  const heroFallback = document.getElementById('modalHeroFallback');

  if (hideMedia) {
    heroImg.classList.remove('show');
    heroImg.src = '';
    heroFallback.classList.add('hide');
    document.getElementById('modalHero').style.display = 'none';
  } else if (ev.thumbnail) {
    heroImg.src = ev.thumbnail;
    heroImg.alt = ev.title;
    heroImg.classList.add('show');
    heroFallback.classList.add('hide');
    document.getElementById('modalHero').style.display = '';
  } else {
    heroImg.classList.remove('show');
    heroImg.src = '';
    heroFallback.classList.remove('hide');
    heroFallback.style.background = ev.heroGradient;
    document.getElementById('modalEmoji').textContent = ev.emoji;
    document.getElementById('modalHero').style.display = '';
  }

  // Type badge
  const badge = document.getElementById('modalTypeBadge');
  badge.className = 'event-type-badge ' + ev.category;
  badge.innerHTML = `${getIconForCategory(ev.category)}<span id="modalTypeText">${ev.type}</span>`;

  // Live
  document.getElementById('modalLiveBadge').classList.toggle('show', ev.status === 'live');

  // Title
  document.getElementById('modalTitle').textContent = ev.title;

  // Host
  document.getElementById('modalHostAvatar').textContent = ev.host.avatar;
  document.getElementById('modalHostAvatar').className = 'host-avatar ' + (ev.host.avatarClass || '');
  document.getElementById('modalHostName').textContent = ev.host.name;

  // Info cards
  document.getElementById('modalDate').textContent = new Date(ev.date).toLocaleDateString('en-US', { 
    weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' 
  });
  document.getElementById('modalTime').textContent = `${ev.startTime} — ${ev.endTime} ${ev.timezone}`;
  // CTA
  document.getElementById('modalJoinBtn').querySelector('span').textContent = ev.cta.text;

  // About
  document.getElementById('modalAbout').textContent = ev.fullDescription;

  // Coin
  document.getElementById('modalCoin').textContent = ev.coin.symbol;

  // Tags
  document.getElementById('modalTags').innerHTML = ev.tags
    .map(t => `<span class="modal-tag">${t}</span>`)
    .join('');
}

function copyLink() {
  const btn = document.querySelector('.modal-action-btn');
  const original = btn.innerHTML;
  btn.innerHTML = `<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="20 6 9 17 4 12"/></svg> Copied!`;
  btn.style.color = 'var(--green)';
  btn.style.borderColor = 'var(--green)';
  setTimeout(() => {
    btn.innerHTML = original;
    btn.style.color = '';
    btn.style.borderColor = '';
  }, 1500);
}

// ════════════════════════════════════════════
// 🎛️ FILTER & SEARCH
// ════════════════════════════════════════════

// Category filter
document.addEventListener('DOMContentLoaded', () => {
  document.querySelectorAll('.cat-item').forEach(btn => {
    btn.addEventListener('click', async () => {
      document.querySelectorAll('.cat-item').forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      currentFilters.category = btn.dataset.cat;
      await fetchEvents(currentFilters);
    });
  });

  // Quick filters
  document.querySelectorAll('.qf').forEach(btn => {
    btn.addEventListener('click', () => {
      document.querySelectorAll('.qf').forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
    });
  });

  // Feed tabs
  document.querySelectorAll('.tab').forEach(btn => {
    btn.addEventListener('click', async () => {
      document.querySelectorAll('.tab').forEach(b => b.classList.remove('active'));
      btn.classList.add('active');

      // Tabs should reset any calendar day selection.
      selectedCalendarDate = null;
      
      // Map tab to status filter
      const tabText = btn.textContent.trim().toLowerCase();
      if (tabText.includes('today')) {
        currentFilters.status = 'live,upcoming';
      } else if (tabText.includes('upcoming')) {
        currentFilters.status = 'upcoming';
      } else if (tabText.includes('past')) {
        currentFilters.status = 'past';
      } else {
        currentFilters.status = '';
      }
      await fetchEvents(currentFilters);

      if (tabText.includes('today')) {
        allEvents = allEvents.filter(event => event.date === TODAY_DATE);
        eventIds = allEvents.map(e => e.id);
        renderEventCards();
      }
    });
  });

  // Sidebar right tabs
  document.querySelectorAll('.srt').forEach(btn => {
    btn.addEventListener('click', () => {
      document.querySelectorAll('.srt').forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
    });
  });

  // Search
  const searchInput = document.querySelector('.feed-search input');
  if (searchInput) {
    let searchTimeout;
    searchInput.addEventListener('input', (e) => {
      clearTimeout(searchTimeout);
      searchTimeout = setTimeout(async () => {
        if (e.target.value.trim()) {
          await searchEvents(e.target.value);
        } else {
          await fetchEvents(currentFilters);
        }
      }, 300);
    });
  }

  // Close modal on escape
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') closeModal();
  });

  // Calendar month navigation
  const calNavButtons = document.querySelectorAll('.cal-nav');
  if (calNavButtons.length >= 2) {
    calNavButtons[0].addEventListener('click', () => shiftCalendarMonth(-1));
    calNavButtons[1].addEventListener('click', () => shiftCalendarMonth(1));
  }

  // Initial load
  fetchCategories();
  fetchStats();
  fetchEvents(currentFilters);
});
