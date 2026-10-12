const fs = require('fs');
const file = 'src/lib/sheets.ts';
let code = fs.readFileSync(file, 'utf8');

code = code.replace(/export async function addTemplateItemsToClass\([\s\S]*?\): Promise<void> \{([\s\S]*?)(?=export async function getLabTemplate)/g,
`export async function addTemplateItemsToClass(
  spreadsheetId: string, 
  sheetId: number, 
  sheetName: string, 
  className: string
): Promise<void> {
  const templateItems = await getClassTemplate(spreadsheetId);
  if (templateItems.length === 0) return;
  
  const actualSheetName = await resolveSheetName(spreadsheetId, sheetName);
  const actualSheetId = await resolveSheetNumericalId(spreadsheetId, actualSheetName, sheetId);

  const fullData = await fetchWithRetry(\`https://sheets.googleapis.com/v4/spreadsheets/\${spreadsheetId}/values/'\${actualSheetName}'!A1:I\`);
  
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
  
  const requests: any[] = [
    {
      insertDimension: {
        range: {
          sheetId: actualSheetId,
          dimension: 'ROWS',
          startIndex: insertIndex,
          endIndex: insertIndex + templateItems.length
        },
        inheritFromBefore: insertIndex > 1
      }
    },
    {
      updateCells: {
        rows: templateItems.map(item => ({
          values: [
            { userEnteredValue: { stringValue: '' } }, // Index 0 (Col A): Empty for sub-items
            { userEnteredValue: { stringValue: item.name } }, // Index 1 (Col B): Item Name
            { userEnteredValue: { stringValue: '0' } }, // Index 2 (Col C): Qty
            { userEnteredValue: { stringValue: item.tag || '' } }, // Col D: Tag
            { userEnteredValue: { stringValue: item.type || '' } }, // Col E: Type
            { userEnteredValue: { stringValue: '' } }, // Col F: Hostname
            { userEnteredValue: { stringValue: '' } }, // Col G: SNID
            { userEnteredValue: { stringValue: now } }, // Col H: Last Updated
            { userEnteredValue: { stringValue: '' } }  // Col I: Status
          ]
        })),
        fields: 'userEnteredValue',
        start: {
          sheetId: actualSheetId,
          rowIndex: insertIndex,
          columnIndex: 0
        }
      }
    }
  ];

  await fetchWithRetry(\`https://sheets.googleapis.com/v4/spreadsheets/\${spreadsheetId}:batchUpdate\`, {
    method: 'POST',
    body: JSON.stringify({ requests })
  });
}

`);

fs.writeFileSync(file, code);
