const form = document.getElementById('submitEventForm');
const eventTypeEl = document.getElementById('eventType');
const eventTypeIconEl = document.getElementById('eventTypeIcon');
const eventTypeHelper = document.getElementById('eventTypeHelper');
const formMessage = document.getElementById('formMessage');

const startDateEl = document.getElementById('startDate');
const startTimeEl = document.getElementById('startTime');
const endDateEl = document.getElementById('endDate');
const endTimeEl = document.getElementById('endTime');
const unknownTimeEl = document.getElementById('unknownTime');

const primaryLinkWrap = document.getElementById('primaryLinkWrap');
const primaryLinkLabel = document.getElementById('primaryLinkLabel');

const dynamicFields = Array.from(document.querySelectorAll('[data-field]'));
const detectedPlatformRow = document.getElementById('detectedPlatformRow');
const linkPreview = document.getElementById('linkPreview');
const embedPreview = document.getElementById('embedPreview');
const pairSymbolHint = document.getElementById('pairSymbolHint');

const coverInput = document.getElementById('coverImage');
const coverPreview = document.getElementById('coverPreview');
const coverFileName = document.getElementById('coverFileName');

let currentType = '';

const typeConfig = {
  exchange: {
    label: 'Exchange Listing',
    className: 'exchange',
    helper: 'Shows Exchange, Exchange Pair URL (required), and Source link (optional).',
    defaults: { primaryLabel: 'Event URL', showPrimaryLink: false },
    show: ['exchangeName', 'exchangePairUrl', 'sourceLink'],
    required: ['exchangeName', 'exchangePairUrl'],
    requiredAny: []
  },
  xspaces: {
    label: 'X Spaces',
    className: 'xspaces',
    helper: 'Requires Event URL. Host handles are optional.',
    defaults: { primaryLabel: 'Event URL', showPrimaryLink: false },
    show: ['eventUrl', 'hostHandles', 'xSpaceLink'],
    required: ['eventUrl'],
    requiredAny: []
  },
  ama: {
    label: 'AMA',
    className: 'ama',
    helper: 'Requires Host and either Event URL or Invite link.',
    defaults: { primaryLabel: 'Event URL', showPrimaryLink: false },
    show: ['eventUrl', 'inviteLink', 'host'],
    required: ['host'],
    requiredAny: ['eventUrl', 'inviteLink']
  },
  livestream: {
    label: 'Livestream',
    className: 'livestream',
    helper: 'Requires Stream URL. Shows Recording link and Stream channel.',
    defaults: { primaryLabel: 'Stream URL', showPrimaryLink: false },
    show: ['streamUrl', 'recordingLink', 'streamChannel'],
    required: ['streamUrl'],
    requiredAny: []
  },
  other: {
    label: 'Other / Generic',
    className: 'other',
    helper: 'Generic event with optional URL and notes.',
    defaults: { primaryLabel: 'Event URL', showPrimaryLink: true },
    show: [],
    required: [],
    requiredAny: []
  }
};

const eventTypeIcons = {
  exchange: '🚀',
  xspaces: '🎙️',
  ama: '💬',
  livestream: '📺',
  other: '📅',
  default: '🗓️'
};

function updateEventTypeIcon(type) {
  if (!eventTypeIconEl) return;
  eventTypeIconEl.textContent = eventTypeIcons[type] || eventTypeIcons.default;
}

function getVisibleFields(type) {
  return typeConfig[type] ? typeConfig[type].show : [];
}

function showDynamicFields(type) {
  const visible = new Set(getVisibleFields(type));
  dynamicFields.forEach(wrap => {
    wrap.hidden = !visible.has(wrap.dataset.field);
  });
}

function getFieldsThatWouldBeCleared(nextType) {
  const nextVisible = new Set(getVisibleFields(nextType));
  const names = [];

  dynamicFields.forEach(wrap => {
    const key = wrap.dataset.field;
    const input = wrap.querySelector('input,textarea,select');
    const label = wrap.querySelector('label');
    if (!input) return;

    const isHiddenByNext = !nextVisible.has(key);
    if (isHiddenByNext && String(input.value || '').trim()) {
      names.push(label ? label.textContent.trim() : key);
    }
  });

  return names;
}

function clearHiddenTypeFields(nextType) {
  const nextVisible = new Set(getVisibleFields(nextType));
  dynamicFields.forEach(wrap => {
    const key = wrap.dataset.field;
    const input = wrap.querySelector('input,textarea,select');
    if (!input) return;
    if (!nextVisible.has(key)) {
      input.value = '';
      input.classList.remove('invalid');
    }
  });

  pairSymbolHint.textContent = '';
}

function applyType(type) {
  const cfg = typeConfig[type];
  updateEventTypeIcon(type);

  if (!cfg) {
    eventTypeHelper.textContent = 'Select type to configure type-specific fields.';
    primaryLinkLabel.textContent = 'Event URL';
    primaryLinkWrap.hidden = true;
    showDynamicFields('');
    return;
  }

  eventTypeHelper.textContent = cfg.helper;
  primaryLinkLabel.textContent = cfg.defaults.primaryLabel;
  primaryLinkWrap.hidden = !cfg.defaults.showPrimaryLink;

  showDynamicFields(type);
}

function validateUrl(value) {
  if (!value) return false;
  try {
    new URL(value);
    return true;
  } catch {
    return false;
  }
}

function markInvalid(el, isInvalid) {
  if (!el) return;
  el.classList.toggle('invalid', isInvalid);
}

function validateRequired(id, required = true) {
  const el = document.getElementById(id);
  if (!el) return true;
  const ok = !required || String(el.value || '').trim() !== '';
  markInvalid(el, !ok);
  return ok;
}

function validateUrlInput(id, required = false) {
  const el = document.getElementById(id);
  if (!el) return true;

  const value = String(el.value || '').trim();
  if (!required && !value) {
    markInvalid(el, false);
    return true;
  }

  const ok = validateUrl(value);
  markInvalid(el, !ok);
  return ok;
}

function validateTypeRules() {
  const type = eventTypeEl.value;
  const cfg = typeConfig[type];
  if (!cfg) return false;

  let ok = true;

  cfg.required.forEach(id => {
    const isUrl = id.toLowerCase().includes('url') || id.toLowerCase().includes('link');
    ok = (isUrl ? validateUrlInput(id, true) : validateRequired(id, true)) && ok;
  });

  if (cfg.requiredAny.length) {
    const present = cfg.requiredAny.some(id => String(document.getElementById(id).value || '').trim());
    cfg.requiredAny.forEach(id => {
      markInvalid(document.getElementById(id), !present);
    });
    ok = present && ok;
  }

  return ok;
}

function validateForm() {
  let ok = true;
  ok = validateRequired('eventType', true) && ok;
  ok = validateRequired('title', true) && ok;
  ok = validateRequired('startDate', true) && ok;
  ok = validateRequired('startTime', true) && ok;

  if (!primaryLinkWrap.hidden) {
    ok = validateUrlInput('primaryLink', false) && ok;
  }

  ok = validateTypeRules() && ok;

  ok = validateUrlInput('sourceLink', false) && ok;
  ok = validateUrlInput('recordingLink', false) && ok;

  return ok;
}

function detectPlatform(url) {
  if (!url || !validateUrl(url)) return null;
  const parsed = new URL(url);
  const host = parsed.hostname.replace('www.', '').toLowerCase();
  const href = url.toLowerCase();

  if (href.includes('twitter.com/spaces') || href.includes('x.com/i/spaces')) {
    return { key: 'xspaces', label: '🐦 X Spaces', domain: host };
  }
  if (href.includes('youtube.com/live') || host.includes('youtu.be')) {
    return { key: 'youtube', label: '▶ YouTube Live', domain: host };
  }
  if (host.includes('discord.gg')) {
    return { key: 'discord', label: '💬 Discord', domain: host };
  }
  if (host.includes('twitch.tv')) {
    return { key: 'twitch', label: '🟣 Twitch', domain: host };
  }
  if (host.includes('kick.com')) {
    return { key: 'kick', label: '🟢 Kick', domain: host };
  }

  return { key: 'domain', label: host, domain: host };
}

function renderPlatformDetection(url) {
  detectedPlatformRow.innerHTML = '';
  linkPreview.hidden = true;
  embedPreview.hidden = true;
  embedPreview.innerHTML = '';

  const platform = detectPlatform(url);
  if (!platform) return;

  const chip = document.createElement('span');
  chip.className = 'detected-chip';
  chip.textContent = `Detected: ${platform.label}`;
  detectedPlatformRow.appendChild(chip);

  linkPreview.href = url;
  linkPreview.hidden = false;

  if (eventTypeEl.value === 'xspaces' && platform.key === 'xspaces') {
    const xLink = document.getElementById('xSpaceLink');
    if (xLink) xLink.value = url;
  }

  if (eventTypeEl.value === 'livestream') {
    if (platform.key === 'youtube') {
      let embed = url;
      if (url.includes('watch?v=')) {
        const v = new URL(url).searchParams.get('v');
        if (v) embed = `https://www.youtube.com/embed/${v}`;
      }
      embedPreview.hidden = false;
      embedPreview.innerHTML = `<strong>Embed preview: YouTube</strong><iframe src="${embed}" allowfullscreen></iframe>`;
    } else if (platform.key === 'twitch' || platform.key === 'kick') {
      embedPreview.hidden = false;
      embedPreview.textContent = `Embed preview is available for ${platform.label}.`;
    }
  }
}

function bindTypeChange() {
  eventTypeEl.addEventListener('change', () => {
    const nextType = eventTypeEl.value;

    if (currentType && nextType && nextType !== currentType) {
      const fieldsToClear = getFieldsThatWouldBeCleared(nextType);
      if (fieldsToClear.length) {
        const message = `Switching types will remove/clear the following fields: ${fieldsToClear.join(', ')}. Continue?`;
        if (!window.confirm(message)) {
          eventTypeEl.value = currentType;
          return;
        }
        clearHiddenTypeFields(nextType);
      }
    }

    currentType = nextType;
    applyType(nextType);
  });
}

function bindTimeControls() {
  unknownTimeEl.addEventListener('change', () => {
    const unknown = unknownTimeEl.checked;
    endDateEl.disabled = unknown;
    endTimeEl.disabled = unknown;
    if (unknown) {
      endDateEl.value = '';
      endTimeEl.value = '';
    }
  });
}

function bindPlatformDetectors() {
  const urlFields = ['primaryLink', 'eventUrl', 'inviteLink', 'streamUrl', 'exchangePairUrl'];

  urlFields.forEach(id => {
    const el = document.getElementById(id);
    if (!el) return;

    const run = () => {
      const value = el.value.trim();
      if (!value) return;

      renderPlatformDetection(value);

      if (id === 'exchangePairUrl' && validateUrl(value)) {
        const pair = value.match(/[A-Z]{2,}[-_/][A-Z]{2,}/);
        pairSymbolHint.textContent = pair ? `Detected pair hint: ${pair[0]}` : '';
      }
    };

    el.addEventListener('blur', run);
    el.addEventListener('paste', () => setTimeout(run, 0));
  });
}

function bindBlurValidation() {
  const controls = Array.from(form.querySelectorAll('input, select, textarea'));
  controls.forEach(ctrl => {
    ctrl.addEventListener('blur', () => {
      if (ctrl.required) {
        validateRequired(ctrl.id, true);
      }
      if (ctrl.type === 'url') {
        validateUrlInput(ctrl.id, false);
      }
    });
  });
}

function bindCoverUpload() {
  coverInput.addEventListener('change', event => {
    const file = event.target.files && event.target.files[0];
    if (!file) {
      coverFileName.textContent = 'No image selected';
      coverPreview.classList.remove('has-image');
      coverPreview.style.backgroundImage = '';
      return;
    }

    coverFileName.textContent = file.name;

    if (!file.type.startsWith('image/')) {
      return;
    }

    const reader = new FileReader();
    reader.onload = () => {
      coverPreview.classList.add('has-image');
      coverPreview.style.backgroundImage = `url('${reader.result}')`;
    };
    reader.readAsDataURL(file);
  });
}

function bindSubmit() {
  form.addEventListener('submit', event => {
    event.preventDefault();
    formMessage.className = '';

    if (!validateForm()) {
      formMessage.textContent = 'Please fix highlighted fields before submitting.';
      formMessage.classList.add('error');
      return;
    }

    formMessage.textContent = 'Event submitted successfully (preview mode).';
    formMessage.classList.add('ok');
  });
}

function initDefaults() {
  const today = new Date();
  startDateEl.value = today.toISOString().slice(0, 10);
  primaryLinkWrap.hidden = true;
  applyType('');
}

function init() {
  bindTypeChange();
  bindTimeControls();
  bindPlatformDetectors();
  bindBlurValidation();
  bindCoverUpload();
  bindSubmit();
  initDefaults();
}

init();
