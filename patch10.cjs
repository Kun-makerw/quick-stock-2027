const fs = require('fs');
const file = 'src/lib/sheets.ts';
let code = fs.readFileSync(file, 'utf8');

code += `
export async function ensureLabTemplateSheetExists(spreadsheetId: string): Promise<void> {
  const meta = await getSpreadsheetMetadata(spreadsheetId);
  const exists = meta.sheets.some((s: any) => s.properties.title === 'Lab Default Template');
  if (exists) return;

  await fetchWithRetry(\`https://sheets.googleapis.com/v4/spreadsheets/\${spreadsheetId}:batchUpdate\`, {
    method: 'POST',
    body: JSON.stringify({
      requests: [
        {
          addSheet: {
            properties: {
              title: 'Lab Default Template',
              gridProperties: {
                rowCount: 100,
                columnCount: 9
              }
            }
          }
        }
      ]
    })
  });

  const newMeta = await getSpreadsheetMetadata(spreadsheetId);
  const newSheet = newMeta.sheets.find((s: any) => s.properties.title === 'Lab Default Template');
  if (newSheet) {
    const sheetId = newSheet.properties.sheetId;
    await fetchWithRetry(\`https://sheets.googleapis.com/v4/spreadsheets/\${spreadsheetId}:batchUpdate\`, {
      method: 'POST',
      body: JSON.stringify({
        requests: [
          {
            updateCells: {
              rows: [
                {
                  values: [
                    { userEnteredValue: { stringValue: 'Item Name' } },
                    { userEnteredValue: { stringValue: 'Tag' } },
                    { userEnteredValue: { stringValue: 'Type' } }
                  ]
                }
              ],
              fields: 'userEnteredValue',
              start: {
                sheetId,
                rowIndex: 0,
                columnIndex: 0
              }
            }
          }
        ]
      })
    });
  }
}
`;

fs.writeFileSync(file, code);
