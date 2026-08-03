# Browser tools

Browser utilities: Tab Lister extension and MarkLink bookmarklet.

## Commands

| Task | Command |
|---|---|
| Generate extension icons | `cd list-tab-extension && ./export-icons.sh` |
| Install extension | Load `list-tab-extension/` unpacked in Chrome or Edge developer mode |

## Boundaries

- Use standard WebExtension APIs rather than Chrome-only APIs.
- Preserve Edge's data-URL fallback to blob URLs.
- Preserve the clipboard `execCommand` fallback.
- Escape Markdown `[]()` characters in generated link text.
- Preserve dark-mode support via `prefers-color-scheme`.
- Test extension changes in both Chrome and Edge.

Firefox metadata is not currently present in the manifest; do not claim Firefox publishing support.
