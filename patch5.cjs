const fs = require('fs');
const file = 'src/lib/sheets.ts';
let code = fs.readFileSync(file, 'utf8');

code = code.replace(/export async function addItemToClass\(spreadsheetId: string, sheetId: number, sheetName: string, className: string, itemName: string, afterRowIndex: number, quantity: string = '0', tag: string = '', type: string = '', hostname: string = '', snid: string = ''\): Promise<void> \{([\\s\\S]*?)(?=export async function formatStockColors)/g,
`export async function addItemToClass(spreadsheetId: string, sheetId: number, sheetName: string, className: string, itemName: string, afterRowIndex: number, quantity: string = '0', tag: string = '', type: string = '', hostname: string = '', snid: string = ''): Promise<void> {
  const actualSheetName = await resolveSheetName(spreadsheetId, sheetName);
  const actualSheetId = await resolveSheetNumericalId(spreadsheetId, actualSheetName, sheetId);

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

  const insertIndex = lastDataRow > 0 ? lastDataRow : 1;
  const now = new Date().toLocaleString();
  let rowValues: string[];

  if (format === 'FormatA') {
    rowValues = ['', itemName, quantity, tag, type, hostname, snid, now, ''];
  } else {
    // Format B: Col A=Item, Col B=Qty, Col C=Tag, Col D=Type, Col E=Timestamp, Col F=Status, Col G=Hostname, Col H=SNID, Col I=Location
    rowValues = [itemName, quantity, tag, type, now, '', hostname, snid, className];
  }

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
            start: {
              sheetId: actualSheetId,
              rowIndex: insertIndex,
              columnIndex: 0
            }
          }
        },
        {
          updateBorders: {
            range: {
              sheetId: actualSheetId,
              startRowIndex: insertIndex - 1,
              endRowIndex: insertIndex,
              startColumnIndex: 0,
              endColumnIndex: 9
            },
            top: { style: 'SOLID_MEDIUM', color: { red: 0, green: 0, blue: 0, alpha: 1 } },
            bottom: { style: 'SOLID_MEDIUM', color: { red: 0, green: 0, blue: 0, alpha: 1 } },
            left: { style: 'SOLID_MEDIUM', color: { red: 0, green: 0, blue: 0, alpha: 1 } },
            right: { style: 'SOLID_MEDIUM', color: { red: 0, green: 0, blue: 0, alpha: 1 } },
            innerHorizontal: { style: 'SOLID', color: { red: 0.8, green: 0.8, blue: 0.8, alpha: 1 } },
            innerVertical: { style: 'SOLID', color: { red: 0.8, green: 0.8, blue: 0.8, alpha: 1 } }
          }
        }
      ]
    })
  });
}

`);

fs.writeFileSync(file, code);
