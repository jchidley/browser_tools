# MarkLink - Copy Page as Markdown Link

A bookmarklet that copies the current page's title and URL as a markdown link to your clipboard.

## Installation (Microsoft Edge on Windows)

### Option 1: MarkLink (Recommended)

1. **Show the Favorites Bar**: Press `Ctrl+Shift+B` or go to Settings → Appearance → Show favorites bar
2. **Add a placeholder bookmark**: Visit any page, press `Ctrl+D`, save to "Favorites bar"
3. **Edit the bookmark**: Right-click the new bookmark → "Edit"
4. **Replace the URL**: Delete the URL and paste this code:

```
javascript:(function(){const e=t=>t.replace(/([[\]()\\])/g,'\\$1');const t=e(document.title);const m='['+t+']('+location.href+')';const s=t=>{const d=document.createElement('div');d.textContent=t;Object.assign(d.style,{position:'fixed',bottom:'20px',left:'50%',transform:'translateX(-50%)',background:'#333',color:'#fff',padding:'12px 24px',borderRadius:'8px',fontSize:'14px',fontFamily:'system-ui,sans-serif',zIndex:'999999',boxShadow:'0 4px 12px rgba(0,0,0,0.3)',opacity:'0',transition:'opacity 0.3s'});document.body.appendChild(d);requestAnimationFrame(()=>d.style.opacity='1');setTimeout(()=>{d.style.opacity='0';setTimeout(()=>d.remove(),300)},2000)};const c=()=>{if(navigator.clipboard&&window.isSecureContext){navigator.clipboard.writeText(m).then(()=>s('Copied!')).catch(()=>prompt('Copy:',m))}else{const ta=document.createElement('textarea');ta.value=m;ta.style.position='fixed';ta.style.left='-9999px';document.body.appendChild(ta);ta.select();try{document.execCommand('copy');s('Copied!')}catch(e){prompt('Copy:',m)}ta.remove()}};c()})();
```

5. **Rename** (optional): Change the name to "MarkLink"
6. **Press Enter** to save

### Option 2: MarkLink Simple

A minimal version that shows a prompt dialog instead of auto-copying:

```
javascript:(function(){const t=document.title.replace(/([[\]()\\])/g,'\\$1');prompt('Copy this markdown link (Ctrl+C):','['+t+']('+location.href+')')})();
```

## Usage

1. Navigate to any web page
2. Click the "MarkLink" bookmark in your favorites bar
3. The link is copied as `[Page Title](URL)`
4. A toast notification confirms the copy (or a prompt appears on HTTP pages)

## Features

- **Modern Clipboard API** with automatic fallback for older browsers and HTTP pages
- **Toast notification** instead of intrusive alert
- **Escapes markdown characters** (`[]()`) in titles
- Works in Chrome, Edge, Firefox, Safari
- No permissions required

## Technical Notes

- Uses `navigator.clipboard.writeText()` on HTTPS (secure contexts)
- Falls back to `document.execCommand('copy')` on HTTP pages
- Falls back to prompt dialog if both methods fail
- Toast auto-dismisses after 2 seconds with fade animation
