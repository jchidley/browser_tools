# MarkLink - Copy Page as Markdown Link

A simple bookmarklet that copies the current page's title and URL as a markdown link to your clipboard.

## Installation Options

### Option 1: MarkLink (Automatic Copy)

1. Create a new bookmark in your browser
2. Name it "MarkLink"
3. Copy and paste the code below as the bookmark URL:

```
javascript:(function(){const mdLink='['+document.title+']('+location.href+')';const ta=document.createElement('textarea');ta.value=mdLink;ta.style.position='fixed';ta.style.left='-9999px';document.body.appendChild(ta);ta.select();try{document.execCommand('copy');alert('Copied: '+mdLink);}catch(e){prompt('Copy this markdown link:',mdLink);}document.body.removeChild(ta);})();
```

### Option 2: MarkLink Simple (Manual Copy)

If you encounter issues with the automatic copy version, use this simpler version:

1. Create a new bookmark
2. Name it "MarkLink Simple"
3. Copy and paste the code below as the bookmark URL:

```
javascript:(function(){const mdLink='['+document.title+']('+location.href+')';prompt('Copy this markdown link (Ctrl+C):', mdLink);})();
```

## Usage

1. Navigate to any web page you want to copy as a markdown link
2. Click the "MarkLink" bookmark in your bookmarks bar
3. The page will be copied to your clipboard in markdown format: `[Page Title](URL)`
4. A confirmation popup will appear showing what was copied

For the simple version, you'll need to manually copy the text from the prompt.

## Features

- Works in all major browsers (Chrome, Firefox, Edge, Safari)
- No permissions required
- Provides visual confirmation of copying
- Fallback to manual copy if automatic copying fails
- Minimal size for fast operation

## Tips for Microsoft Edge

For a cleaner bookmarks bar in Edge:
1. Right-click on the MarkLink bookmark
2. Select "Edit"
3. You can optionally:
   - Add an emoji at the beginning of the name (press Win+; to open emoji panel)
   - Clear the name completely to show only the icon (though this will be a generic script icon)
4. Click "Save"