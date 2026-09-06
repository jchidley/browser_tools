# Browser tools

Tab Lister is a Chromium Manifest V3 extension; MarkLink is a separate bookmarklet. Complete requested local work with proportionate checks. Reviews do not authorize edits; installation, personal browsing-data access, clipboard/bookmark changes and publication require explicit scope.

## Development

- There is no package manager/build/test harness here. JavaScript syntax can be checked with `node --check <file>` (replace the placeholder). Synthetic API/DOM fixtures are not browser compatibility evidence.
- Generate icons only when requested, from `list-tab-extension/`, using `bash export-icons.sh` with Inkscape already provisioned. It overwrites four PNGs and prints success even after a failed export; verify each output and inspect the images before claiming success. Do not execute the script for a documentation change.
- Test executable extension changes in both Chrome and Edge using an explicitly approved disposable profile with synthetic tabs. Record untested browser/CSP/service-worker behavior; do not install in a personal profile merely to review guidance.

## Actual boundaries and known defects

- `background.js` uses `chrome.tabs` and `chrome.action`, querying all accessible tabs with `{}`. Names, URLs, query tokens and downloaded/copied lists can be private. Do not collect or publish real tab data for tests.
- HTML title text and anchor URLs are escaped, but favicon attributes are not; JSON embedded in inline script does not escape closing script tags. Markdown destinations are inserted raw. **The generated page is not safe for arbitrary untrusted tab metadata.** Preserve these findings explicitly until a separately validated hardening change; escaping Markdown link text alone is not sanitization.
- The code attempts data-URL then blob-URL tab creation. Preserve the intended Edge fallback when changing behavior, but do not claim it works in the manifest's service-worker context without real-browser evidence. No Firefox publishing support is established.
- Clipboard code attempts a legacy `execCommand` fallback. A false return is ignored and can still display success; MarkLink Simple instead prompts for manual copying. Do not describe a toast as verified clipboard content.
- Preserve title escaping of `[]()` and backslashes and the existing `prefers-color-scheme` styling. Do not claim URL safety, visual quality, cross-browser compatibility or clipboard success from syntax/mocked tests.

See [README](README.md) and [MarkLink instructions](markdown-link-favourite/README.md). Report changed paths, actual checks and remaining runtime/security limits. Leave browser settings, bookmarks, clipboard, dependencies and remote state unchanged unless explicitly authorized.
