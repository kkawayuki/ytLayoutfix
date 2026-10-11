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

// YouTube can undo either fix straight away (re-add an attribute, move #related
// back). Redoing it every frame ties up the page so the player never loads, so
// each fix gives up after this many rounds per page.
const MAX_ROUNDS = 10;
const rounds = { attrs: 0, related: 0 };

function allowed(fix) {
  if (rounds[fix] === MAX_ROUNDS) console.warn(`[classic layout] YouTube keeps undoing "${fix}", giving up on it for this page`);
  return rounds[fix]++ < MAX_ROUNDS;
}

function applyLayout() {
  if (location.pathname !== '/watch') return;
  const flexy = document.querySelector('ytd-watch-flexy');
  if (!flexy) return;

  flexy.classList.add('ycl-active');
  if (NEW_LAYOUT_ATTRS.some((attr) => flexy.hasAttribute(attr)) && allowed('attrs')) {
    for (const attr of NEW_LAYOUT_ATTRS) flexy.removeAttribute(attr);
  }

  // In one-column mode YouTube moves the recommendations under the video
  // (#below), where they render as a grid. Put them back in the sidebar.
  const related = flexy.querySelector('#related');
  const sidebar = flexy.querySelector('#secondary-inner') || flexy.querySelector('#secondary');
  if (related && sidebar && !sidebar.contains(related) && allowed('related')) sidebar.appendChild(related);

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
  document.addEventListener('yt-navigate-finish', () => {
    rounds.attrs = rounds.related = 0;
    schedule();
  });
  // ytd-watch-flexy is created after the script starts, so watch until it appears.
  new MutationObserver(schedule).observe(document.documentElement, { childList: true, subtree: true });
  schedule();
});
