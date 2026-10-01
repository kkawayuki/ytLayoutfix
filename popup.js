const DEFAULT_HEIGHT = 94;
const slider = document.getElementById('slider');
const value = document.getElementById('value');
const enabled = document.getElementById('enabled');
const settings = document.getElementById('settings');

function show(height) {
  slider.value = height;
  value.textContent = `${height}px`;
}

chrome.storage.local.get({ height: DEFAULT_HEIGHT }, ({ height }) => show(height));

slider.addEventListener('input', () => {
  const height = Number(slider.value);
  show(height);
  chrome.storage.local.set({ height });
});

document.getElementById('reset').addEventListener('click', () => {
  show(DEFAULT_HEIGHT);
  chrome.storage.local.set({ height: DEFAULT_HEIGHT });
});

function showEnabled(on) {
  enabled.checked = on;
  settings.classList.toggle('disabled', !on);
}

chrome.storage.local.get({ enabled: true }, ({ enabled: on }) => showEnabled(on));

// Content scripts read the switch once at page load, so reload the YouTube tab to apply it.
enabled.addEventListener('change', async () => {
  showEnabled(enabled.checked);
  await chrome.storage.local.set({ enabled: enabled.checked });
  const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
  if (tab?.url?.startsWith('https://www.youtube.com/')) chrome.tabs.reload(tab.id);
});
