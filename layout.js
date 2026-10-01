// Restores the classic watch page: description + comments under the video,
// recommended videos in the right-hand column.
// The new layout is switched on by attributes on ytd-watch-flexy, and YouTube's
// CSS keys off them (e.g. split-scroll pushes #secondary under the player behind
// a tall spacer). Removing them brings back YouTube's own classic layout,
// including its inline description and comments.

const NEW_LAYOUT_ATTRS = [
  'split-scroll',
  'using-fixed-panel',
  'fixed-panel-expanded',
  'fixed-default-panels',
  'show-fixed-side-menu',
  'side-rail-dismissible-panels',
];

function applyLayout() {
  if (location.pathname !== '/watch') return;
  const flexy = document.querySelector('ytd-watch-flexy');
  if (!flexy) return;

  flexy.classList.add('ycl-active');
  for (const attr of NEW_LAYOUT_ATTRS) {
    if (flexy.hasAttribute(attr)) flexy.removeAttribute(attr);
  }

  // YouTube re-adds these as it updates, so watch for that.
  if (!flexy.yclObserved) {
    flexy.yclObserved = true;
    new MutationObserver(schedule).observe(flexy, { attributes: true, attributeFilter: NEW_LAYOUT_ATTRS });
  }
}

let scheduled = false;
function schedule() {
  if (scheduled) return;
  scheduled = true;
  requestAnimationFrame(() => {
    scheduled = false;
    applyLayout();
  });
}

// `enabled` is the popup's on/off switch; toggling it reloads the page. When
// off, ytd-watch-flexy never gets .ycl-active, so styles.css matches nothing.
chrome.storage.local.get({ enabled: true }, ({ enabled }) => {
  if (!enabled) return;
  document.addEventListener('yt-navigate-finish', schedule);
  // ytd-watch-flexy is created after the script starts, so watch until it appears.
  new MutationObserver(schedule).observe(document.documentElement, { childList: true, subtree: true });
  schedule();
});
