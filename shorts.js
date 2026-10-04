// "Hide Shorts" switch: toggles a class on <html> that styles.css uses to hide
// Shorts in the watch-page sidebar. Takes effect live, no reload needed.
function applyHideShorts(hide) {
  document.documentElement.classList.toggle('ycl-hide-shorts', hide);
}

chrome.storage.local.get({ hideShorts: true }, ({ hideShorts }) => applyHideShorts(hideShorts));

chrome.storage.onChanged.addListener((changes, area) => {
  if (area === 'local' && changes.hideShorts) applyHideShorts(changes.hideShorts.newValue);
});
