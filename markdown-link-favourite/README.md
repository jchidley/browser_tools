# MarkLink - Copy Page as Markdown Link

A bookmarklet that attempts to copy the current page's title and URL as a Markdown link. The Simple variant prompts for manual copying. Use synthetic pages and an explicitly approved test profile for validation: running the main variant may replace clipboard contents, and exported URLs can contain private data or tokens. Editing bookmarks or using a personal profile is not implied by a code/documentation review.

## Installation (Microsoft Edge on Windows)

### Option 1: MarkLink (Experimental)

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
3. The main variant attempts to copy `[Page Title](URL)`; the Simple variant always prompts for manual copying.
4. A toast reports the attempted result, not independently verified clipboard contents. On HTTP/insecure contexts the main variant tries legacy copying; a prompt appears only if that call throws, not when it merely returns false.

## Features

- **Modern Clipboard API** with automatic fallback for older browsers and HTTP pages
- **Toast notification** instead of intrusive alert
- **Escapes markdown characters** (`[]()`) in titles
- Browser compatibility is not certified here; page/browser clipboard policy may prevent copying
- No extension permission manifest; bookmarklet execution still runs in the current page and attempts clipboard access

## Technical Notes

- Uses `navigator.clipboard.writeText()` on HTTPS (secure contexts)
- Falls back to `document.execCommand('copy')` on HTTP pages
- A rejected modern Clipboard API promise goes directly to a prompt (it does not try legacy copying)
- Legacy `execCommand('copy')` exceptions prompt, but a false return is ignored and still shows “Copied!”
- Title escaping does not sanitize the raw URL destination or guarantee a valid Markdown link
- Toast auto-dismisses after 2 seconds with fade animation
