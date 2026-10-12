const fs = require('fs');
const file = 'src/lib/sheets.ts';
let code = fs.readFileSync(file, 'utf8');

code = code.replace(/export async function addClassToInventory\(spreadsheetId: string, sheetName: string, className: string\): Promise<void> \{([\\s\\S]*?)(?=export async function addTemplateItemsToClass)/g,
`export async function addClassToInventory(spreadsheetId: string, sheetName: string, className: string): Promise<void> {
  const actualSheetName = await resolveSheetName(spreadsheetId, sheetName);
  
  if (sheetName.toLowerCase().includes('stock')) {
    await ensureStockSheetMigrated(spreadsheetId, sheetName);
  }

  // Prevent Duplicates
  const existingClasses = await getClasses(spreadsheetId, sheetName);
  if (existingClasses.some(c => c.title.toLowerCase().trim() === className.toLowerCase().trim())) {
    throw new Error(\`Location "\${className}" already exists in this Google Sheet.\`);
  }

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

  const templateItems = className.toLowerCase().startsWith("lab") ? await getLabTemplate(spreadsheetId) : await getClassTemplate(spreadsheetId);
  
  const now = new Date().toLocaleString();
  
  let values: string[][] = [];
  if (format === 'FormatA') {
    if (templateItems.length === 0) {
      values = [[className, 'New Item', '0', '', '', '', '', now, '']];
    } else {
      values = templateItems.map((item, index) => [
        index === 0 ? className : '',
        item.name,
        '0',
        item.tag || '',
        item.type || '',
        '',
        '',
        now,
        ''
      ]);
    }
  } else {
    // Format B: Col A=Item, Col B=Qty, Col C=Tag, Col D=Type, Col E=Timestamp, Col F=Status, Col G=Hostname, Col H=SNID, Col I=Location
    if (templateItems.length === 0) {
      values = [['New Item', '0', '', '', now, '', '', '', className]];
    } else {
      values = templateItems.map((item) => [
        item.name,
        '0',
        item.tag || '',
        item.type || '',
        now,
        '',
        '',
        '',
        className
      ]);
    }
  }
  
  const meta = await getSpreadsheetMetadata(spreadsheetId);
  const sheet = meta.sheets.find((s: any) => s.properties.title === actualSheetName);
  const actualSheetId = sheet?.properties.sheetId;

  const insertIndex = lastDataRow > 0 ? lastDataRow : 1; // Append after the last row with data

  const cellRows = values.map(rowVals => ({
    values: rowVals.map(val => ({ userEnteredValue: { stringValue: val } }))
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
              endIndex: insertIndex + values.length
            },
            inheritFromBefore: insertIndex > 1
          }
        },
        {
          updateCells: {
            rows: cellRows,
            fields: 'userEnteredValue',
            range: {
              sheetId: actualSheetId,
              startRowIndex: insertIndex,
              endRowIndex: insertIndex + values.length,
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
