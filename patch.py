import sys

with open("src/lib/sheets.ts", "a") as f:
    f.write("""
export async function addMasterItem(spreadsheetId: string, itemName: string): Promise<void> {
  const actualSheetName = await resolveSheetName(spreadsheetId, 'Item Master');
  const encodedRange = encodeURIComponent(`'${actualSheetName}'!A:A`);
  await fetchWithRetry(`https://sheets.googleapis.com/v4/spreadsheets/${spreadsheetId}/values/${encodedRange}:append?valueInputOption=USER_ENTERED&insertDataOption=INSERT_ROWS`, {
    method: 'POST',
    body: JSON.stringify({
      values: [[itemName]]
    })
  });
}

export async function removeMasterItem(spreadsheetId: string, itemName: string): Promise<void> {
  const actualSheetName = await resolveSheetName(spreadsheetId, 'Item Master');
  const encodedRange = encodeURIComponent(`'${actualSheetName}'!A:A`);
  const data = await fetchWithRetry(`https://sheets.googleapis.com/v4/spreadsheets/${spreadsheetId}/values/${encodedRange}`);
  
  if (!data.values) return;
  
  const rowIndex = data.values.findIndex((row: string[]) => row[0]?.trim() === itemName.trim());
  if (rowIndex === -1) return;
  
  const meta = await getSpreadsheetMetadata(spreadsheetId);
  const sheet = meta.sheets.find((s: any) => s.properties.title === actualSheetName);
  const actualSheetId = sheet?.properties?.sheetId || 0;
  
  await deleteRows(spreadsheetId, actualSheetId, actualSheetName, [rowIndex + 1]);
}
""")
