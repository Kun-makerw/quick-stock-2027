import sys

with open("src/lib/sheets.ts", "r") as f:
    content = f.read()

# Replace the beginning of fetchWithRetry
search_str = """export async function fetchWithRetry(url: string, options: RequestInit = {}, maxRetries = 3) {
  let attempt = 0;
  
  while (attempt < maxRetries) {
    try {
      const token = getAccessToken();
      if (!token) {
        throw new SheetsApiError('Not authenticated', 401);
      }"""

replace_str = """export async function fetchWithRetry(url: string, options: RequestInit = {}, maxRetries = 3) {
  let attempt = 0;
  
  while (attempt < maxRetries) {
    try {
      const token = getAccessToken();
      if (!token) {
        throw new SheetsApiError('Not authenticated', 401);
      }

      if (token === 'dummy_token_for_email_login') {
         // Mock data for Admin demo
         if (url.includes(':batchUpdate') || url.includes(':append') || options.method === 'POST' || options.method === 'PUT' || options.method === 'DELETE') {
             return {}; // Success for mutations
         }
         
         const decodedUrl = decodeURIComponent(url);
         
         if (url.includes('spreadsheets/') && !url.includes('/values/')) {
            // Metadata
            return {
               spreadsheetId: 'mock_spreadsheet_id',
               properties: { title: 'Mock Spreadsheet' },
               sheets: [
                 { properties: { sheetId: 1, title: 'Classes' } },
                 { properties: { sheetId: 2, title: 'Stock Room' } },
                 { properties: { sheetId: 3, title: 'Item Master' } },
                 { properties: { sheetId: 4, title: 'Lab_Template' } }
               ]
            };
         }

         if (url.includes('/values/')) {
            if (decodedUrl.includes('Item Master')) {
                return { values: [['Item Name'], ['Laptop'], ['Mouse'], ['Keyboard']] };
            }
            if (decodedUrl.includes('Lab_Template')) {
                return { values: [['Item Name', 'Default Tag', 'Default Type'], ['Desktop', 'Computer', 'Dell'], ['Monitor', 'Peripheral', '24" Dell']] };
            }
            if (decodedUrl.includes('Classes')) {
                return { values: [
                    ['Class Name', 'Item Name', 'Quantity', 'Category', 'Type/Model', 'Hostname', 'SNID', 'Last Updated', 'Status'],
                    ['Room 101', 'Laptop', '15', 'Computer', 'Dell XPS', 'HOST-1', 'SN-1', '2023-01-01', 'Checked'],
                    ['Room 101', 'Mouse', '15', 'Peripheral', 'Logitech', '', '', '', ''],
                    ['Room 102', 'Laptop', '20', 'Computer', 'MacBook', 'HOST-2', 'SN-2', '2023-01-02', 'Checked']
                ]};
            }
            if (decodedUrl.includes('Stock Room')) {
                return { values: [
                    ['Item Name', 'Quantity', 'Category', 'Type/Model', 'Last Updated', 'Status', 'Hostname', 'SNID', 'Location'],
                    ['Laptop', '50', 'Computer', 'Dell XPS', '2023-01-01', 'Checked', 'DEV-1', 'SN-10', 'Storage A'],
                    ['Mouse', '100', 'Peripheral', 'Logitech', '', '', '', '', 'Storage B'],
                    ['Keyboard', '40', 'Peripheral', 'Mechanical', '', '', '', '', 'Storage B']
                ]};
            }
            return { values: [] };
         }
      }"""

content = content.replace(search_str, replace_str)

with open("src/lib/sheets.ts", "w") as f:
    f.write(content)
