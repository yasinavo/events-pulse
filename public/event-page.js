const previewTrigger = document.getElementById('eventPreviewTrigger');
const previewModal = document.getElementById('eventPreviewModal');
const previewBackdrop = document.getElementById('eventPreviewBackdrop');
const previewClose = document.getElementById('eventPreviewClose');
const copyEventLinkBtn = document.getElementById('copyEventLinkBtn');
const shareEventBtn = document.getElementById('shareEventBtn');

function openPreviewModal() {
  if (!previewModal || !previewBackdrop) return;
  previewModal.hidden = false;
  previewBackdrop.hidden = false;
  document.body.classList.add('modal-open');
}

function closePreviewModal() {
  if (!previewModal || !previewBackdrop) return;
  previewModal.hidden = true;
  previewBackdrop.hidden = true;
  document.body.classList.remove('modal-open');
}

if (previewTrigger) {
  previewTrigger.addEventListener('click', openPreviewModal);
}

if (previewClose) {
  previewClose.addEventListener('click', closePreviewModal);
}

if (previewBackdrop) {
  previewBackdrop.addEventListener('click', closePreviewModal);
}

document.addEventListener('keydown', event => {
  if (event.key === 'Escape' && previewModal && !previewModal.hidden) {
    closePreviewModal();
  }
});

if (copyEventLinkBtn) {
  copyEventLinkBtn.addEventListener('click', async () => {
    const url = window.location.href;
    try {
      await navigator.clipboard.writeText(url);
      copyEventLinkBtn.textContent = 'Copied';
      setTimeout(() => {
        copyEventLinkBtn.textContent = 'Copy Link';
      }, 1200);
    } catch {
      copyEventLinkBtn.textContent = 'Copy Failed';
      setTimeout(() => {
        copyEventLinkBtn.textContent = 'Copy Link';
      }, 1200);
    }
  });
}

if (shareEventBtn) {
  shareEventBtn.addEventListener('click', async () => {
    const shareData = {
      title: document.title,
      text: 'Check out this event',
      url: window.location.href,
    };

    if (navigator.share) {
      try {
        await navigator.share(shareData);
      } catch {
        // User cancellation is expected; no-op.
      }
      return;
    }

    window.open(`https://twitter.com/intent/tweet?url=${encodeURIComponent(shareData.url)}&text=${encodeURIComponent(shareData.title)}`, '_blank', 'noopener,noreferrer');
  });
}
