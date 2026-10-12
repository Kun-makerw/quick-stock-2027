cat << 'INNER_EOF' >> src/lib/dropdowns.ts

export async function updateAllDropdowns(spreadsheetId: string, dropdowns: CustomDropdowns): Promise<void> {
  const meta = await getSpreadsheetMetadata(spreadsheetId);
  const sheet = meta.sheets.find(s => s.properties.title === 'Dropdowns');
  if (!sheet) return;

  const rows = [['Category', 'Value', 'Parent Tag']];
  dropdowns.tags.forEach(tag => {
    rows.push(['Tag', tag, '']);
  });
  Object.entries(dropdowns.typesByTag).forEach(([tag, types]) => {
    types.forEach(type => {
      rows.push(['Type', type, tag]);
    });
  });

  // Clear existing
  await fetchWithRetry(`https://sheets.googleapis.com/v4/spreadsheets/${spreadsheetId}/values/Dropdowns!A:C:clear`, {
    method: 'POST'
  });

  // Write new
  await fetchWithRetry(`https://sheets.googleapis.com/v4/spreadsheets/${spreadsheetId}/values/Dropdowns!A1:C?valueInputOption=USER_ENTERED`, {
    method: 'PUT',
    body: JSON.stringify({
      values: rows
    })
  });
}
INNER_EOF
