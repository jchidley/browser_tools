# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Repository Structure

This repository contains two browser tools:

1. **Tab Lister Extension** (`/list-tab-extension/`)
   - A browser extension using Manifest V3
   - Lists all open tabs in a new tab
   - Allows exporting tabs as CSV or Markdown

2. **MarkLink** (`/markdown-link-favourite/`)
   - A simple bookmarklet
   - Copies the current page's title and URL as a markdown link to clipboard
   - Two versions available: automatic copy and manual copy

## Development Commands

### Icon Generation

To generate icons from SVG source files:
```bash
cd list-tab-extension
./export-icons.sh
```

Requirements:
- Inkscape installed for SVG to PNG conversion
- SVG source file named `icon.svg` in the current directory

### Extension Installation (Development)

1. In Chrome/Edge/Firefox:
   - Navigate to the extensions management page
   - Enable "Developer mode"
   - Click "Load unpacked extension"
   - Select the `/list-tab-extension/` directory

2. For the bookmarklet:
   - Create a new bookmark
   - Paste the content of `markdown-link-favourite/marklink.js` (automatic copy) or `markdown-link-favourite/marklink-simple.js` (manual copy) as the URL

## Architecture

### Tab Lister Extension

- **Manifest V3 Architecture**: Uses a service worker background script
- **Content Flow**:
  1. User clicks extension icon
  2. `background.js` queries all open tabs
  3. Generates HTML with a table of tabs
  4. Creates a new tab with the generated content
  5. Allows downloading as CSV or Markdown

### MarkLink

- **Bookmarklet Architecture**: Self-contained JavaScript snippet
- **Content Flow**:
  1. User clicks the bookmark on any page
  2. Script extracts current page title and URL
  3. Formats them as a markdown link
  4. Either:
     - Automatically copies to clipboard and shows alert (marklink.js)
     - Shows a prompt for manual copying (marklink-simple.js)

## Microsoft Edge Compatibility

### Tab Lister Extension

- **API Compatibility**: Use standard Web Extension API calls, avoiding Chrome-specific implementations
- **Data URL Handling**: Edge may have restrictions on data URLs in extensions. The extension implements a fallback mechanism:
  ```javascript
  // Primary approach using data URL
  try {
    await chrome.tabs.create({
      url: `data:text/html;charset=utf-8,${encodeURIComponent(htmlContent)}`
    });
  } catch (error) {
    // Fallback using blob URL for Edge
    const blob = new Blob([htmlContent], {type: 'text/html'});
    const blobUrl = URL.createObjectURL(blob);
    await chrome.tabs.create({ url: blobUrl });
  }
  ```
- **Manifest V3 Configuration**: The extension includes Edge-specific settings in manifest.json:
  ```json
  "browser_specific_settings": {
    "edge": {
      "browser_action_next_to_addressbar": true
    }
  }
  ```
- **Testing Requirements**: Always test the extension in Edge before releasing updates
- **Permission Model**: Edge uses the same permission model as Chrome, but verify permission behavior specifically in Edge

### MarkLink

- **Multiple Versions**:
  - `marklink.js`: Uses execCommand for automatic clipboard copy with alert confirmation
  - `marklink-simple.js`: Uses prompt dialog for manual copying (more compatible but requires manual action)

- **Clipboard Implementation** (marklink.js):
  ```javascript
  // Core implementation with fallback
  const ta = document.createElement('textarea');
  ta.value = mdLink;
  ta.style.position = 'fixed';
  ta.style.left = '-9999px';
  document.body.appendChild(ta);
  ta.select();
  try {
    document.execCommand('copy');
    alert('Copied: ' + mdLink);
  } catch(e) {
    prompt('Copy this markdown link:', mdLink);
  }
  document.body.removeChild(ta);
  ```

- **Simple Implementation** (marklink-simple.js):
  ```javascript
  // Simple prompt implementation
  const mdLink = '[' + document.title + '](' + location.href + ')';
  prompt('Copy this markdown link (Ctrl+C):', mdLink);
  ```

- **Browser Support**: 
  - The automatic copy version works in most browsers but may encounter permission issues in some environments
  - The simple version works reliably in all browsers but requires manual copying
  - In Edge, both versions will use the default script icon, as Edge doesn't support custom icons for bookmarklets

### General Edge Compatibility Guidelines

- Always test features in recent Edge versions (Chromium-based Edge)
- Use feature detection instead of browser detection when possible
- Handle errors gracefully with appropriate fallback mechanisms
- Avoid relying on browser-specific behaviors or APIs
- Test under different Edge security settings and permissions