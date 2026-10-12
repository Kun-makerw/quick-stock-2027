const fs = require('fs');
const file = 'src/lib/sheets.ts';
let code = fs.readFileSync(file, 'utf8');

code = code.replace(/export async function appendInventoryItem\(spreadsheetId: string, sheetName: string, item: string, quantity: string, tag: string = '', type: string = '', status: string = '', hostname: string = '', snid: string = '', location: string = ''\): Promise<void> \{([\\s\\S]*?)(?=export async function addLabTemplateItemsToClass)/g,
`export async function appendInventoryItem(spreadsheetId: string, sheetName: string, item: string, quantity: string, tag: string = '', type: string = '', status: string = '', hostname: string = '', snid: string = '', location: string = ''): Promise<void> {
  await ensureStockSheetMigrated(spreadsheetId, sheetName);
  const actualSheetName = await resolveSheetName(spreadsheetId, sheetName);
  const fullData = await fetchWithRetry(\`https://sheets.googleapis.com/v4/spreadsheets/\${spreadsheetId}/values/'\${actualSheetName}'!A1:I\`);
  const header = fullData.values?.[0];
  const sampleRows = fullData.values?.slice(1, 10);
  const format = detectSheetFormat(header, sampleRows);

  let lastDataRow = 0;
  if (fullData.values) {
    for (let i = fullData.values.length - 1; i >= 0; i--) {
      if (fullData.values[i].some((cell: any) => String(cell).trim() !== '')) {
        lastDataRow = i + 1;
        break;
      }
    }
  }

  const now = new Date().toLocaleString();
  let rowValues: string[];
  if (format === 'FormatA') {
    rowValues = [location, item, quantity, tag, type, hostname, snid, now, status];
  } else {
    rowValues = [item, quantity, tag, type, now, status, hostname, snid, location];
  }

  const meta = await getSpreadsheetMetadata(spreadsheetId);
  const sheet = meta.sheets.find((s: any) => s.properties.title === actualSheetName);
  const actualSheetId = sheet?.properties.sheetId;

  const insertIndex = lastDataRow > 0 ? lastDataRow : 1;

  const cellValues = rowValues.map(val => ({ userEnteredValue: { stringValue: val } }));

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
              endIndex: insertIndex + 1
            },
            inheritFromBefore: insertIndex > 1
          }
        },
        {
          updateCells: {
            rows: [
              {
                values: cellValues
              }
            ],
            fields: 'userEnteredValue',
            range: {
              sheetId: actualSheetId,
              startRowIndex: insertIndex,
              endRowIndex: insertIndex + 1,
              startColumnIndex: 0,
              endColumnIndex: 9
            }
          }
        }
      ]
    })
  });
}

`);

fs.writeFileSync(file, code);
