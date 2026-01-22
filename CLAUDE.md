# CLAUDE.md

## Overview

Browser utilities: Tab Lister (extension) and MarkLink (bookmarklet).

## Quick Reference

| Task | Command |
|------|---------|
| Generate icons | `cd list-tab-extension && ./export-icons.sh` |
| Install extension | Load `list-tab-extension/` unpacked in browser dev mode |

## Structure

```
list-tab-extension/     # Manifest V3 extension - lists all tabs, markdown export
markdown-link-favourite/ # Bookmarklet - copy page as [Title](URL)
```

## Conventions

- Use standard WebExtension APIs (not Chrome-specific)
- Data URLs with blob URL fallback for Edge compatibility
- Use `navigator.clipboard.writeText()` with `execCommand` fallback
- Escape markdown special chars `[]()` in link text
- Support dark mode via `prefers-color-scheme`
- Test in both Chrome and Edge before releasing

## Known Issues

- No Firefox gecko settings in manifest (extension works but not published)