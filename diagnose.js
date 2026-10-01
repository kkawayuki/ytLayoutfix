// Paste into the DevTools console on a YouTube /watch page.
// Prints (and copies to the clipboard) an outline of the watch page structure
// so the extension's selectors can be matched to YouTube's current layout.
(() => {
  const root = document.querySelector('ytd-watch-flexy') || document.body;
  const describe = (el) => {
    let s = el.tagName.toLowerCase();
    if (el.id) s += '#' + el.id;
    const cls = [...el.classList].slice(0, 3);
    if (cls.length) s += '.' + cls.join('.');
    for (const a of ['target-id', 'visibility', 'section-identifier', 'aria-label', 'role']) {
      if (el.hasAttribute(a)) s += `[${a}="${el.getAttribute(a)}"]`;
    }
    const r = el.getBoundingClientRect();
    if (r.width) s += `  (${Math.round(r.x)},${Math.round(r.y)} ${Math.round(r.width)}x${Math.round(r.height)})`;
    return s;
  };
  const lines = [];
  const walk = (el, depth) => {
    if (depth > 7 || lines.length > 600) return;
    lines.push('  '.repeat(depth) + describe(el));
    // Don't descend into individual comments / video tiles.
    if (/^(ytd-comment-thread-renderer|yt-lockup-view-model|ytd-compact-video-renderer|ytd-rich-item-renderer)$/i.test(el.tagName)) return;
    for (const c of el.children) walk(c, depth + 1);
  };
  walk(root, 0);
  lines.unshift('flexy attrs: ' + [...root.attributes].map((a) => a.name).join(' '));

  // Where do the recommended-video tiles live? Print each tile type's ancestor chain.
  lines.push('', '--- recommendation tiles ---');
  const seen = new Set();
  for (const tile of document.querySelectorAll('yt-lockup-view-model, ytd-compact-video-renderer, ytd-rich-item-renderer, ytd-video-renderer')) {
    const chain = [];
    for (let el = tile; el && el !== document.body; el = el.parentElement) chain.push(describe(el));
    const key = chain.slice(1, 6).join('|');
    if (seen.has(key)) continue;
    seen.add(key);
    lines.push(chain.reverse().join('\n  > '), '');
  }
  if (!seen.size) lines.push('(no tiles found)');

  // Inside of one sidebar tile, so thumbnail/metadata class names can be matched.
  const tile = document.querySelector('#secondary yt-lockup-view-model');
  if (tile) {
    lines.push('--- first sidebar tile ---');
    const dump = (el, depth) => {
      if (depth > 5) return;
      lines.push('  '.repeat(depth) + describe(el) + ` {${el.className}}`);
      for (const c of el.children) dump(c, depth + 1);
    };
    dump(tile, 0);
  }
  const out = lines.join('\n');
  console.log(out);
  try { copy(out); console.log('(copied to clipboard)'); } catch {}
})();
