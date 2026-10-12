const fs = require('fs');
const file = 'src/lib/sheets.ts';
let code = fs.readFileSync(file, 'utf8');

code = code.replace(/export async function addDefaultMasterItems\([\s\S]*?\): Promise<void> \{([\s\S]*?)(?=export async function updateTemplateItem)/g,
`export async function addDefaultMasterItems(spreadsheetId: string, items: string[]): Promise<void> {
  await ensureItemMasterSheetExists(spreadsheetId);
  const meta = await getSpreadsheetMetadata(spreadsheetId);
  const sheet = meta.sheets.find((s: any) => s.properties.title === 'Item Master');
  const actualSheetName = sheet ? sheet.properties.title : 'Item Master';
  const actualSheetId = sheet ? sheet.properties.sheetId : 0;
  
  const fullData = await fetchWithRetry(\`https://sheets.googleapis.com/v4/spreadsheets/\${spreadsheetId}/values/'\${actualSheetName}'!A1:A\`);
  
  let lastDataRow = 0;
  if (fullData.values) {
    for (let i = fullData.values.length - 1; i >= 0; i--) {
      if (fullData.values[i].some((cell: any) => String(cell).trim() !== '')) {
        lastDataRow = i + 1;
        break;
      }
    }
  }

  const insertIndex = lastDataRow > 0 ? lastDataRow : 1;

  if (items.length > 0) {
    const cellRows = items.map(itemName => ({
      values: [ { userEnteredValue: { stringValue: itemName } } ]
    }));

    await fetchWithRetry(\`https://sheets.googleapis.com/v4/spreadsheets/\${spreadsheetId}:batchUpdate\`, {
      method: 'POST',
      body: JSON.stringify({
        requests: [
          {
            insertDimension: {
              range: {
                sheetId: actualSheetId,
                dimension: 'ROWS',
                startIndex: insertIndex,
                endIndex: insertIndex + items.length
              },
              inheritFromBefore: insertIndex > 1
            }
          },
          {
            updateCells: {
              rows: cellRows,
              fields: 'userEnteredValue',
              start: {
                sheetId: actualSheetId,
                rowIndex: insertIndex,
                columnIndex: 0
              }
            }
          }
        ]
      })
    });
  }
}

`);

fs.writeFileSync(file, code);
