/// <reference types="chrome"/>

/**
 * Constants and Configuration
 * -------------------------
 * Define styling and configuration values used throughout the extension
 */

// Default empty favicon for tabs without one
const EMPTY_FAVICON = 'data:image/gif;base64,R0lGODlhAQABAIAAAAAAAP///yH5BAEAAAAALAAAAAABAAEAAAIBRAA7';

// MIME types for file downloads
const MIME_TYPES = {
    csv: 'text/csv',
    md: 'text/markdown'
};

/**
 * Styles for the generated HTML page
 */
const STYLE_SHEET = `
    :root {
        --primary-color: #228be6;
        --success-color: #40c057;
        --success-hover: #37b24d;
        --primary-hover: #1c7ed6;
        --border-color: #e9ecef;
        --bg-light: #f8f9fa;
        --shadow: 0 1px 3px rgba(0,0,0,0.12);
    }

    body {
        font-family: system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, sans-serif;
        margin: 20px;
        line-height: 1.6;
        color: #333;
        background-color: var(--bg-light);
    }

    table {
        width: 100%;
        border-collapse: collapse;
        margin: 20px 0;
        background-color: white;
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
    tr:hover { background-color: #f1f3f5; }

    .btn {
        color: white;
        padding: 10px 20px;
        border: none;
        border-radius: 6px;
        cursor: pointer;
        font-weight: 500;
        transition: all 0.2s ease;
    }

    .csv-btn { background-color: var(--success-color); }
    .csv-btn:hover { background-color: var(--success-hover); }
    .md-btn { background-color: var(--primary-color); }
    .md-btn:hover { background-color: var(--primary-hover); }

    .header {
        display: flex;
        justify-content: space-between;
        align-items: center;
        padding: 20px 0;
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

    .stats {
        margin-top: 20px;
        padding: 15px;
        background-color: white;
        border-radius: 8px;
        box-shadow: var(--shadow);
    }
`;

/**
 * Utility Functions
 * ---------------
 * Helper functions for string escaping and sanitization
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

function escapeCsv(field) {
    return `"${field.replace(/"/g, '""')}"`;
}

/**
 * Content Generation Functions
 * -------------------------
 * Functions to generate different formats of the tab list
 */

function generateCsvContent(tabs) {
    const header = "Title,URL";
    const rows = tabs.map(tab => `${escapeCsv(tab.title)},${escapeCsv(tab.url)}`);
    return [header, ...rows].join("\n");
}

function generateMarkdownContent(tabs, dateTimeString) {
    const header = `# Open Tabs List - ${dateTimeString}\n\n## Tabs`;
    const links = tabs.map(tab => `- [${tab.title}](${tab.url})`);
    return [header, ...links].join("\n");
}

/**
 * HTML Generation Functions
 * ----------------------
 * Functions to generate HTML content and components
 */

function generateTableRows(tabs) {
    return tabs.map(tab => `
        <tr>
            <td>
                <img src="${tab.favIconUrl || EMPTY_FAVICON}" 
                     class="favicon" alt="">
                ${escapeHtml(tab.title)}
            </td>
            <td><a href="${escapeHtml(tab.url)}" target="_blank">${escapeHtml(tab.url)}</a></td>
        </tr>
    `).join('');
}

function generateDownloadScript(csvContent, markdownContent, sanitizedDateTime) {
    return `
        const MIME_TYPES = ${JSON.stringify(MIME_TYPES)};
        const fileData = {
            csv: ${JSON.stringify(csvContent)},
            md: ${JSON.stringify(markdownContent)}
        };
        const dateStr = ${JSON.stringify(sanitizedDateTime)};

        function downloadFile(type) {
            const blob = new Blob([fileData[type]], { type: MIME_TYPES[type] });
            const url = window.URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.style.display = 'none';
            a.href = url;
            a.download = \`open_tabs_\${dateStr}.\${type}\`;
            document.body.appendChild(a);
            a.click();
            window.URL.revokeObjectURL(url);
            document.body.removeChild(a);
        }
    `;
}

function generateHtmlContent(tabs, dateTimeString) {
    const csvContent = generateCsvContent(tabs);
    const markdownContent = generateMarkdownContent(tabs, dateTimeString);
    const sanitizedDateTime = dateTimeString.replace(/[/\\?%*:|"<>]/g, '-');
    
    const tableRows = generateTableRows(tabs);
    const downloadScript = generateDownloadScript(csvContent, markdownContent, sanitizedDateTime);

    return `
        <!DOCTYPE html>
        <html>
        <head>
            <title>Open Tabs List - ${dateTimeString}</title>
            <meta charset="utf-8">
            <meta name="viewport" content="width=device-width, initial-scale=1">
            <style>${STYLE_SHEET}</style>
        </head>
        <body>
            <div class="header">
                <h2>Currently Open Tabs - ${dateTimeString}</h2>
                <div class="button-group">
                    <button class="btn csv-btn" onclick="downloadFile('csv')">Download as CSV</button>
                    <button class="btn md-btn" onclick="downloadFile('md')">Download as Markdown</button>
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

            <script>
                ${downloadScript}
            </script>
        </body>
        </html>
    `;
}

/**
 * Main Extension Functionality
 * -------------------------
 * Core functions for the extension's operation
 */

async function createTabList() {
    try {
        const dateTimeString = new Date().toLocaleString();
        const tabs = await chrome.tabs.query({});
        const htmlContent = generateHtmlContent(tabs, dateTimeString);
        
        await chrome.tabs.create({
            url: `data:text/html;charset=utf-8,${encodeURIComponent(htmlContent)}`
        });
    } catch (error) {
        console.error('Error in createTabList:', error);
        const errorHtml = `
            <h1>Error</h1>
            <p>Sorry, there was an error creating the tab list: ${escapeHtml(error.message)}</p>
        `;
        await chrome.tabs.create({
            url: `data:text/html;charset=utf-8,${encodeURIComponent(errorHtml)}`
        });
    }
}

// Initialize extension
chrome.action.onClicked.addListener(createTabList);
