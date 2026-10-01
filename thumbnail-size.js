// Applies the saved thumbnail height to YouTube's "Up next" sidebar.
const DEFAULT_HEIGHT = 94; // YouTube's default sidebar thumbnail height (px)
const STYLE_ID = 'yt-sidebar-size-style';

function buildCss(height) {
  const width = Math.round((height * 16) / 9);
  return `
    /* Classic layout */
    #secondary ytd-compact-video-renderer ytd-thumbnail,
    #secondary ytd-compact-video-renderer #thumbnail,
    #secondary ytd-compact-radio-renderer ytd-thumbnail,
    #secondary ytd-compact-playlist-renderer ytd-playlist-thumbnail {
      width: ${width}px !important;
      min-width: ${width}px !important;
      max-width: none !important;
      height: ${height}px !important;
      flex: 0 0 ${width}px !important;
    }

    /* Newer "lockup" layout (class was yt-lockup-view-model__content-image,
       now ytLockupViewModelContentImage) */
    #secondary yt-lockup-view-model [class*="content-image"],
    #secondary yt-lockup-view-model .ytLockupViewModelContentImage {
      width: ${width}px !important;
      min-width: ${width}px !important;
      max-width: none !important;
      height: ${height}px !important;
      overflow: hidden !important;
      border-radius: 8px;
      flex: 0 0 ${width}px !important;
      margin: 0 !important;
    }

    /* The new layout renders these tiles vertically (thumbnail on top).
       Lay them out as the classic row: thumbnail left, details right. */
    #secondary yt-lockup-view-model:has(> :is([class*="content-image"], .ytLockupViewModelContentImage)),
    #secondary yt-lockup-view-model *:has(> :is([class*="content-image"], .ytLockupViewModelContentImage)) {
      display: flex !important;
      flex-direction: row !important;
      align-items: flex-start !important;
      gap: 8px !important;
    }

    #secondary yt-lockup-view-model :is([class*="content-image"], .ytLockupViewModelContentImage) ~ * {
      flex: 1 1 auto !important;
      min-width: 0 !important;
      margin: 0 !important;
    }
  `;
}

function applyHeight(height) {
  let style = document.getElementById(STYLE_ID);
  if (!style) {
    style = document.createElement('style');
    style.id = STYLE_ID;
    (document.head || document.documentElement).appendChild(style);
  }
  style.textContent = buildCss(height);
}

// `enabled` is the popup's on/off switch; toggling it reloads the page.
chrome.storage.local.get({ enabled: true, height: DEFAULT_HEIGHT }, ({ enabled, height }) => {
  if (!enabled) return;
  applyHeight(height);
  chrome.storage.onChanged.addListener((changes, area) => {
    if (area === 'local' && changes.height) applyHeight(changes.height.newValue);
  });
});
