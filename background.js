/// <reference types="chrome"/>

// Constants for file naming and styling
const STYLE_SHEET = `
    body {
        font-family: system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, sans-serif;
        margin: 20px;
        line-height: 1.6;
        color: #333;
        background-color: #f8f9fa;
    }
    table {
        width: 100%;
        border-collapse: collapse;
        margin: 20px 0;
        background-color: white;
        box-shadow: 0 1px 3px rgba(0,0,0,0.12);
        border-radius: 8px;
        overflow: hidden;
    }
    th, td {
        border: 1px solid #e9ecef;
        padding: 12px;
        text-align: left;
    }
    th {
        background-color: #f8f9fa;
        font-weight: 600;
    }
    tr:nth-child(even) {
        background-color: #f8f9fa;
    }
    tr:hover {
        background-color: #f1f3f5;
    }
    .btn {
        color: white;
        padding: 10px 20px;
        border: none;
        border-radius: 6px;
        cursor: pointer;
        margin-right: 10px;
        margin-bottom: 20px;
        font-weight: 500;
        transition: all 0.2s ease;
    }
    .csv-btn {
        background-color: #40c057;
    }
    .csv-btn:hover {
        background-color: #37b24d;
    }
    .md-btn {
        background-color: #228be6;
    }
    .md-btn:hover {
        background-color: #1c7ed6;
    }
    .header {
        display: flex;
        justify-content: space-between;
        align-items: center;
        padding: 20px 0;
    }
    .button-group {
        display: flex;
        gap: 12px;
    }
    a {
        color: #228be6;
        text-decoration: none;
    }
    a:hover {
        text-decoration: underline;
    }
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
        box-shadow: 0 1px 3px rgba(0,0,0,0.12);
    }
`;

// Utility functions
function escapeHtml(unsafe) {
    return unsafe
        .replace(/&/g, "&amp;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;")
        .replace(/"/g, "&quot;")
        .replace(/'/g, "&#039;");
}

function escapeCsv(field) {
    return `"${field.replace(/"/g, '""')}"`;
}

const getDomainFromUrl = (url) => {
    try {
        return new URL(url).hostname;
    } catch {
        return 'unknown';
    }
};

// Main functionality
async function createTabList() {
    try {
        const now = new Date();
        const dateTimeString = now.toLocaleString();
        const dateForFile = now.toISOString().slice(0,10);

        // Get all tabs
        const tabs = await chrome.tabs.query({});

        // Generate the HTML content
        const htmlContent = generateHtmlContent(tabs, dateTimeString);

        // Create new tab with the content
        await chrome.tabs.create({
            url: "data:text/html;charset=utf-8," + encodeURIComponent(htmlContent)
        });

    } catch (error) {
        console.error('Error in createTabList:', error);
        // Notify user of error
        await chrome.tabs.create({
            url: "data:text/html;charset=utf-8," + encodeURIComponent(`
                <h1>Error</h1>
                <p>Sorry, there was an error creating the tab list: ${escapeHtml(error.message)}</p>
            `)
        });
    }
}

function generateCsvContent(tabs) {
    return "Title,URL\n" + 
        tabs.map(tab => 
            `${escapeCsv(tab.title)},${escapeCsv(tab.url)}`
        ).join("\n");
}

function generateMarkdownContent(tabs, dateTimeString) {
    return `# Open Tabs List - ${dateTimeString}

## Tabs
${tabs.map(tab => `- [${tab.title}](${tab.url})`).join("\n")}
`;
}

function generateHtmlContent(tabs, dateTimeString) {
    const csvContent = generateCsvContent(tabs);
    const markdownContent = generateMarkdownContent(tabs, dateTimeString);
    const sanitizedDateTime = dateTimeString.replace(/[/\\?%*:|"<>]/g, '-');
    
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
                <tbody>
                    ${tabs.map(tab => `
                        <tr>
                            <td>
                                <img src="${tab.favIconUrl || 'data:image/gif;base64,R0lGODlhAQABAIAAAAAAAP///yH5BAEAAAAALAAAAAABAAEAAAIBRAA7'}" 
                                     class="favicon" alt="">
                                ${escapeHtml(tab.title)}
                            </td>
                            <td><a href="${escapeHtml(tab.url)}" target="_blank">${escapeHtml(tab.url)}</a></td>
                        </tr>
                    `).join('')}
                </tbody>
            </table>

            <script>
                // Pre-computed content
                const csvContent = ${JSON.stringify(csvContent)};
                const markdownContent = ${JSON.stringify(markdownContent)};
                const dateStr = ${JSON.stringify(sanitizedDateTime)};

                function downloadFile(type) {
                    const content = type === 'csv' ? csvContent : markdownContent;
                    const mimeType = type === 'csv' ? 'text/csv' : 'text/markdown';
                    const ext = type === 'csv' ? 'csv' : 'md';
                    
                    const blob = new Blob([content], { type: mimeType });
                    const url = window.URL.createObjectURL(blob);
                    const a = document.createElement('a');
                    a.style.display = 'none';
                    a.href = url;
                    a.download = \`open_tabs_\${dateStr}.\${ext}\`;
                    
                    document.body.appendChild(a);
                    a.click();
                    window.URL.revokeObjectURL(url);
                    document.body.removeChild(a);
                }
            </script>
        </body>
        </html>
    `;
}

// Listen for browser action click
chrome.action.onClicked.addListener(createTabList);
