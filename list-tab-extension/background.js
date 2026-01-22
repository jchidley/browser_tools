/// <reference types="chrome"/>

/**
 * Tab Lister Extension
 * Lists all open tabs with markdown export and per-tab copy functionality
 */

const EMPTY_FAVICON = 'data:image/gif;base64,R0lGODlhAQABAIAAAAAAAP///yH5BAEAAAAALAAAAAABAAEAAAIBRAA7';

/**
 * Styles with dark mode support via prefers-color-scheme
 */
const STYLE_SHEET = `
    :root {
        --primary-color: #228be6;
        --primary-hover: #1c7ed6;
        --border-color: #e9ecef;
        --bg-light: #f8f9fa;
        --bg-white: #ffffff;
        --text-color: #333;
        --text-muted: #666;
        --shadow: 0 1px 3px rgba(0,0,0,0.12);
        --copy-bg: #e7f5ff;
        --copy-hover: #d0ebff;
    }

    @media (prefers-color-scheme: dark) {
        :root {
            --primary-color: #4dabf7;
            --primary-hover: #74c0fc;
            --border-color: #343a40;
            --bg-light: #1a1a1a;
            --bg-white: #212529;
            --text-color: #e9ecef;
            --text-muted: #adb5bd;
            --shadow: 0 1px 3px rgba(0,0,0,0.3);
            --copy-bg: #1864ab;
            --copy-hover: #1971c2;
        }
    }

    body {
        font-family: system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, sans-serif;
        margin: 20px;
        line-height: 1.6;
        color: var(--text-color);
        background-color: var(--bg-light);
    }

    table {
        width: 100%;
        border-collapse: collapse;
        margin: 20px 0;
        background-color: var(--bg-white);
        box-shadow: var(--shadow);
        border-radius: 8px;
        overflow: hidden;
    }

    th, td {
        border: 1px solid var(--border-color);
        padding: 12px;
        text-align: left;
    }

    th {
        background-color: var(--bg-light);
        font-weight: 600;
    }

    tr:nth-child(even) { background-color: var(--bg-light); }
    tr:hover { background-color: var(--border-color); }

    .btn {
        color: white;
        padding: 10px 20px;
        border: none;
        border-radius: 6px;
        cursor: pointer;
        font-weight: 500;
        transition: all 0.2s ease;
    }

    .md-btn { background-color: var(--primary-color); }
    .md-btn:hover { background-color: var(--primary-hover); }

    .copy-btn {
        background-color: var(--copy-bg);
        color: var(--primary-color);
        padding: 4px 8px;
        border: none;
        border-radius: 4px;
        cursor: pointer;
        font-size: 12px;
        transition: all 0.2s ease;
    }
    .copy-btn:hover { background-color: var(--copy-hover); }
    .copy-btn.copied {
        background-color: #40c057;
        color: white;
    }

    .header {
        display: flex;
        justify-content: space-between;
        align-items: center;
        padding: 20px 0;
        flex-wrap: wrap;
        gap: 12px;
    }

    .button-group { display: flex; gap: 12px; }

    a {
        color: var(--primary-color);
        text-decoration: none;
    }
    a:hover { text-decoration: underline; }

    .favicon {
        width: 16px;
        height: 16px;
        margin-right: 8px;
        vertical-align: middle;
    }

    .title-cell {
        display: flex;
        align-items: center;
        gap: 8px;
    }

    .title-text {
        flex: 1;
        display: flex;
        align-items: center;
    }

    .tab-count {
        color: var(--text-muted);
        font-size: 14px;
    }
`;

/**
 * Escape HTML entities
 */
function escapeHtml(unsafe) {
    const htmlEntities = {
        '&': '&amp;',
        '<': '&lt;',
        '>': '&gt;',
        '"': '&quot;',
        "'": '&#039;'
    };
    return unsafe.replace(/[&<>"']/g, char => htmlEntities[char]);
}

/**
 * Escape markdown special characters in link text
 * Handles: [ ] ( ) and backslash
 */
function escapeMarkdown(text) {
    return text.replace(/([[\]()\\])/g, '\\$1');
}

/**
 * Generate markdown link for a tab
 */
function tabToMarkdown(title, url) {
    return `[${escapeMarkdown(title)}](${url})`;
}

/**
 * Generate markdown content for all tabs
 */
function generateMarkdownContent(tabs, dateTimeString) {
    const header = `# Open Tabs - ${dateTimeString}\n`;
    const links = tabs.map(tab => `- ${tabToMarkdown(tab.title, tab.url)}`);
    return [header, ...links].join("\n");
}

/**
 * Generate table rows with per-tab copy buttons
 */
function generateTableRows(tabs) {
    return tabs.map((tab, index) => `
        <tr>
            <td>
                <div class="title-cell">
                    <span class="title-text">
                        <img src="${tab.favIconUrl || EMPTY_FAVICON}" 
                             class="favicon" alt="">
                        ${escapeHtml(tab.title)}
                    </span>
                    <button class="copy-btn" onclick="copyTab(${index})" title="Copy as markdown">📋</button>
                </div>
            </td>
            <td><a href="${escapeHtml(tab.url)}" target="_blank">${escapeHtml(tab.url)}</a></td>
        </tr>
    `).join('');
}

/**
 * Generate the download and copy script
 */
function generateScript(tabs, markdownContent, sanitizedDateTime) {
    const tabData = tabs.map(t => ({ title: t.title, url: t.url }));
    
    return `
        const markdownContent = ${JSON.stringify(markdownContent)};
        const tabData = ${JSON.stringify(tabData)};
        const dateStr = ${JSON.stringify(sanitizedDateTime)};

        function escapeMarkdown(text) {
            return text.replace(/([\\[\\]()\\\\])/g, '\\\\$1');
        }

        function downloadMarkdown() {
            const blob = new Blob([markdownContent], { type: 'text/markdown' });
            const url = window.URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.style.display = 'none';
            a.href = url;
            a.download = \`open_tabs_\${dateStr}.md\`;
            document.body.appendChild(a);
            a.click();
            window.URL.revokeObjectURL(url);
            document.body.removeChild(a);
        }

        async function copyTab(index) {
            const tab = tabData[index];
            const markdown = '[' + escapeMarkdown(tab.title) + '](' + tab.url + ')';
            
            try {
                await navigator.clipboard.writeText(markdown);
                const btn = document.querySelectorAll('.copy-btn')[index];
                btn.textContent = '✓';
                btn.classList.add('copied');
                setTimeout(() => {
                    btn.textContent = '📋';
                    btn.classList.remove('copied');
                }, 1500);
            } catch (err) {
                // Fallback for older browsers
                const ta = document.createElement('textarea');
                ta.value = markdown;
                ta.style.position = 'fixed';
                ta.style.left = '-9999px';
                document.body.appendChild(ta);
                ta.select();
                document.execCommand('copy');
                document.body.removeChild(ta);
                
                const btn = document.querySelectorAll('.copy-btn')[index];
                btn.textContent = '✓';
                btn.classList.add('copied');
                setTimeout(() => {
                    btn.textContent = '📋';
                    btn.classList.remove('copied');
                }, 1500);
            }
        }

        async function copyAllAsMarkdown() {
            try {
                await navigator.clipboard.writeText(markdownContent);
                const btn = document.querySelector('.copy-all-btn');
                const original = btn.textContent;
                btn.textContent = 'Copied!';
                setTimeout(() => btn.textContent = original, 1500);
            } catch (err) {
                const ta = document.createElement('textarea');
                ta.value = markdownContent;
                ta.style.position = 'fixed';
                ta.style.left = '-9999px';
                document.body.appendChild(ta);
                ta.select();
                document.execCommand('copy');
                document.body.removeChild(ta);
                
                const btn = document.querySelector('.copy-all-btn');
                const original = btn.textContent;
                btn.textContent = 'Copied!';
                setTimeout(() => btn.textContent = original, 1500);
            }
        }
    `;
}

/**
 * Generate the complete HTML page
 */
function generateHtmlContent(tabs, dateTimeString) {
    const markdownContent = generateMarkdownContent(tabs, dateTimeString);
    const sanitizedDateTime = dateTimeString.replace(/[/\\?%*:|"<>]/g, '-');
    const tableRows = generateTableRows(tabs);
    const script = generateScript(tabs, markdownContent, sanitizedDateTime);

    return `
        <!DOCTYPE html>
        <html>
        <head>
            <title>Open Tabs - ${dateTimeString}</title>
            <meta charset="utf-8">
            <meta name="viewport" content="width=device-width, initial-scale=1">
            <meta name="color-scheme" content="light dark">
            <style>${STYLE_SHEET}</style>
        </head>
        <body>
            <div class="header">
                <div>
                    <h2 style="margin: 0;">Open Tabs</h2>
                    <span class="tab-count">${tabs.length} tabs • ${dateTimeString}</span>
                </div>
                <div class="button-group">
                    <button class="btn md-btn copy-all-btn" onclick="copyAllAsMarkdown()">Copy All</button>
                    <button class="btn md-btn" onclick="downloadMarkdown()">Download .md</button>
                </div>
            </div>

            <table>
                <thead>
                    <tr>
                        <th>Title</th>
                        <th>URL</th>
                    </tr>
                </thead>
                <tbody>${tableRows}</tbody>
            </table>

            <script>${script}</script>
        </body>
        </html>
    `;
}

/**
 * Main function - creates a new tab with the tab list
 */
async function createTabList() {
    try {
        const dateTimeString = new Date().toLocaleString();
        const tabs = await chrome.tabs.query({});
        const htmlContent = generateHtmlContent(tabs, dateTimeString);
        
        try {
            // Primary approach - data URL (works in most browsers)
            await chrome.tabs.create({
                url: `data:text/html;charset=utf-8,${encodeURIComponent(htmlContent)}`
            });
        } catch (dataUrlError) {
            // Fallback for browsers with data URL restrictions (like some Edge versions)
            console.warn('Data URL approach failed, using blob URL fallback:', dataUrlError);
            
            const blob = new Blob([htmlContent], {type: 'text/html'});
            const blobUrl = URL.createObjectURL(blob);
            
            await chrome.tabs.create({ url: blobUrl });
        }
    } catch (error) {
        console.error('Error in createTabList:', error);
        const errorHtml = `
            <!DOCTYPE html>
            <html>
            <head><meta name="color-scheme" content="light dark"></head>
            <body>
                <h1>Error</h1>
                <p>Sorry, there was an error creating the tab list: ${escapeHtml(error.message)}</p>
            </body>
            </html>
        `;
        
        try {
            await chrome.tabs.create({
                url: `data:text/html;charset=utf-8,${encodeURIComponent(errorHtml)}`
            });
        } catch (e) {
            alert(`Error: ${error.message}`);
        }
    }
}

// Initialize extension
chrome.action.onClicked.addListener(createTabList);
