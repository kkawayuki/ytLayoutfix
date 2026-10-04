# Chrome Web Store listing

Paste-ready text for the Developer Dashboard, one section per dashboard field.
Upload `dist/classic-watch-layout-<version>.zip` (built by `./package.sh`).

---

## Store listing tab

**Name** (comes from manifest.json)
Classic Watch Layout for YouTube

**Summary** (comes from manifest.json)
Restores YouTube's classic watch page: description and comments under the video, recommended videos in the sidebar.

**Category**
Tools

**Language**
English

**Description**

```
Bring back the YouTube watch page you're used to.

YouTube's newer watch page moves comments and the description into a side panel and pushes recommended videos underneath the player. This extension puts everything back where it was:

• Description and comments directly under the video
• Recommended videos in a single column on the right
• Compact recommendation tiles with the thumbnail on the left and details on the right

Options (click the extension icon):
• Classic layout: turn the whole layout change on or off. The current YouTube tab reloads to apply it.
• Hide Shorts in sidebar: remove Shorts from the recommendations column. Applies instantly.
• Thumbnail size: adjust the size of recommended-video thumbnails with a slider.

Privacy: the extension collects no data. It only changes how youtube.com looks in your browser, and your settings are stored locally in Chrome.

YouTube changes its page often. If something looks off after a YouTube update, an extension update will follow.

This extension is not affiliated with, endorsed by, or sponsored by YouTube or Google.
```

**Graphic assets** (to make yourself)
- Store icon: `icons/icon128.png`
- Screenshots: at least 1, up to 5, at 1280×800 or 640×400. Suggested: a before/after pair of the same video page, and the popup open over the page.
- Small promo tile: 440×280.

---

## Privacy practices tab

**Single purpose description**
```
Restores the classic layout of the YouTube watch page: description and comments under the video and recommended videos in the right sidebar, with options to hide Shorts from the sidebar and resize recommendation thumbnails.
```

**Permission justifications**

storage:
```
Saves the user's settings (layout on/off, hide Shorts on/off, thumbnail size) locally so they persist between visits.
```

activeTab:
```
When the user turns the layout on or off from the popup, the extension reloads the current tab if it is a YouTube page so the change takes effect.
```

Host permission (content scripts on https://www.youtube.com/*):
```
The content scripts restyle the YouTube watch page: they adjust the page layout and apply CSS. They run only on youtube.com and do not read, collect, or transmit any page content or user data.
```

**Are you using remote code?**
No, I am not using remote code. (All JavaScript is included in the package.)

**Data usage**
- What user data do you collect: check none.
- Certify all three disclosures (data is not sold, not used for unrelated purposes, not used for creditworthiness).

**Privacy policy URL**
Not required, since no user data is collected. Leave blank.

---

## Distribution tab

- Payments: free
- Visibility: Public (or Unlisted to share only by link)
- Regions: all regions
