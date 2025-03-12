// == version 4 ==

// Background script (background.js)
function createTabList() {
    // Get current date and time
    const now = new Date();
    const dateTimeString = now.toLocaleString();
    
    // Create CSV data
    let csvContent = "Title,URL\n";
    
    // Create Markdown data
    let markdownContent = `# Open Tabs List - ${dateTimeString}\n\n`;
    
    // Create HTML content
    let htmlContent = `
        <!DOCTYPE html>
        <html>
        <head>
            <title>Open Tabs List - ${dateTimeString}</title>
            <style>
                body {
                    font-family: Arial, sans-serif;
                    margin: 20px;
                }
                table {
                    width: 100%;
                    border-collapse: collapse;
                    margin: 20px 0;
                }
                th, td {
                    border: 1px solid #ddd;
                    padding: 8px;
                    text-align: left;
                }
                th {
                    background-color: #f2f2f2;
                }
                tr:nth-child(even) {
                    background-color: #f9f9f9;
                }
                tr:hover {
                    background-color: #f5f5f5;
                }
                .btn {
                    color: white;
                    padding: 10px 20px;
                    border: none;
                    border-radius: 4px;
                    cursor: pointer;
                    margin-right: 10px;
                    margin-bottom: 20px;
                }
                .csv-btn {
                    background-color: #4CAF50;
                }
                .csv-btn:hover {
                    background-color: #45a049;
                }
                .md-btn {
                    background-color: #2196F3;
                }
                .md-btn:hover {
                    background-color: #1976D2;
                }
                .header {
                    display: flex;
                    justify-content: space-between;
                    align-items: center;
                }
                .button-group {
                    display: flex;
                    gap: 10px;
                }
            </style>
        </head>
        <body>
            <div class="header">
                <h2>Currently Open Tabs - ${dateTimeString}</h2>
                <div class="button-group">
                    <button class="btn csv-btn" onclick="downloadCSV()">Download as CSV</button>
                    <button class="btn md-btn" onclick="downloadMarkdown()">Download as Markdown</button>
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
    `;

    // Query all tabs
    chrome.tabs.query({}, function(tabs) {
        tabs.forEach(function(tab) {
            // Escape CSV fields properly
            const escapedTitle = tab.title.replace(/"/g, '""');
            const escapedUrl = tab.url.replace(/"/g, '""');
            
            // Add to CSV content
            csvContent += `"${escapedTitle}","${escapedUrl}"\n`;

            // Add to Markdown content
            markdownContent += `- [${escapedTitle}](${escapedUrl})\n`;

            // Add to HTML table
            htmlContent += `
                <tr>
                    <td>${tab.title}</td>
                    <td><a href="${tab.url}" target="_blank">${tab.url}</a></td>
                </tr>
            `;
        });

        htmlContent += `
                </tbody>
            </table>

            <script>
                // Function to download CSV
                function downloadCSV() {
                    const csvData = ${JSON.stringify(csvContent)};
                    const blob = new Blob([csvData], { type: 'text/csv' });
                    const url = window.URL.createObjectURL(blob);
                    const a = document.createElement('a');
                    a.setAttribute('hidden', '');
                    a.setAttribute('href', url);
                    a.setAttribute('download', 'open_tabs_${now.toISOString().slice(0,10)}.csv');
                    document.body.appendChild(a);
                    a.click();
                    document.body.removeChild(a);
                }

                // Function to download Markdown
                function downloadMarkdown() {
                    const mdData = ${JSON.stringify(markdownContent)};
                    const blob = new Blob([mdData], { type: 'text/markdown' });
                    const url = window.URL.createObjectURL(blob);
                    const a = document.createElement('a');
                    a.setAttribute('hidden', '');
                    a.setAttribute('href', url);
                    a.setAttribute('download', 'open_tabs_${now.toISOString().slice(0,10)}.md');
                    document.body.appendChild(a);
                    a.click();
                    document.body.removeChild(a);
                }
            </script>
        </body>
        </html>
        `;

        // Create new tab with the table
        chrome.tabs.create({
            url: "data:text/html;charset=utf-8," + encodeURIComponent(htmlContent)
        });
    });
}

// Add browser action (toolbar button)
chrome.browserAction.onClicked.addListener(createTabList);
