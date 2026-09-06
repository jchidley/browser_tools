# Browser Tools

Simple browser utilities for tab management and link copying.

## Tab Lister Extension

Attempts to list all accessible tabs in a new tab with Markdown export and copy buttons. This is experimental code, not a hardened tab-data exporter: favicon attributes are unescaped and tab data embedded in inline script can contain closing script tags. Do not use arbitrary untrusted pages or a personal browsing profile to test it. Exported titles/URLs may contain private data and tokens; protect downloaded files and clipboard contents.

### Installation (Microsoft Edge on Windows)

Historical manual installation steps, for an explicitly approved disposable test profile only. The extension uses Manifest V3 `chrome.tabs`/`chrome.action`; data-URL creation and the attempted blob fallback are not certified to work under current browser/service-worker restrictions. No browser installation is required for a documentation review.

1. Open Edge and go to `edge://extensions/`
2. Enable **Developer mode** (toggle in bottom-left)
3. Click **Load unpacked**
4. Select the `list-tab-extension` folder
5. Pin the extension to your toolbar (optional)

### Usage

Click the extension icon to open a new tab listing all your open tabs. From there you can:
- Copy individual tabs as markdown links
- Copy all tabs as a markdown list
- Download the list as a `.md` file

These are intended functions, not verified outcomes in every browser. The legacy clipboard fallback ignores a false return and may show success without copying. Titles escape Markdown `[]()` and backslashes, but URL destinations remain raw and may not form safe/valid Markdown links.

## MarkLink Bookmarklet

Attempts to copy the current page's title and URL; the Simple variant prompts for manual copying. Modern clipboard rejection prompts in the main variant, while a failed legacy copy can incorrectly show success. Do not equate a toast with verified clipboard contents.

### Installation (Microsoft Edge on Windows)

1. Press `Ctrl+Shift+B` to show the Favorites Bar
2. Add any bookmark to the bar (Ctrl+D)
3. Right-click the bookmark, select Edit
4. Replace the URL with the code from `markdown-link-favourite/README.md`
5. Press Enter to save

See the README in `markdown-link-favourite` folder for the bookmarklet code.

## License

Dual-licensed under MIT and Apache 2.0.
