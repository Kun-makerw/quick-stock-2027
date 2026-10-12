const fs = require('fs');
const content = fs.readFileSync('src/lib/sheets.ts', 'utf8');

const newFunctions = `
export async function addMasterItem(spreadsheetId: string, itemName: string): Promise<void> {
  const actualSheetName = await resolveSheetName(spreadsheetId, 'Item Master');
  const encodedRange = encodeURIComponent(\`'\${actualSheetName}'!A:A\`);
  await fetchWithRetry(\`https://sheets.googleapis.com/v4/spreadsheets/\${spreadsheetId}/values/\${encodedRange}:append?valueInputOption=USER_ENTERED&insertDataOption=INSERT_ROWS\`, {
    method: 'POST',
    body: JSON.stringify({
      values: [[itemName]]
    })
  });
}

export async function removeMasterItem(spreadsheetId: string, itemName: string): Promise<void> {
  const actualSheetName = await resolveSheetName(spreadsheetId, 'Item Master');
  const encodedRange = encodeURIComponent(\`'\${actualSheetName}'!A:A\`);
  const data = await fetchWithRetry(\`https://sheets.googleapis.com/v4/spreadsheets/\${spreadsheetId}/values/\${encodedRange}\`);
  
  if (!data.values) return;
  
  const rowIndex = data.values.findIndex((row: string[]) => row[0]?.trim() === itemName.trim());
  if (rowIndex === -1) return;
  
  const actualSheetId = await resolveSheetNumericalId(spreadsheetId, actualSheetName, 0); // we need actual sheet id
  
  await deleteRows(spreadsheetId, actualSheetId, actualSheetName, [rowIndex + 1]);
}
`;

fs.writeFileSync('src/lib/sheets.ts', content + '\n' + newFunctions);
