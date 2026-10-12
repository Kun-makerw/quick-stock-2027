cat << 'INNER' > update_dropdowns_cache.js
const fs = require('fs');
let code = fs.readFileSync('src/lib/dropdowns.ts', 'utf8');

const oldEnsure = `export async function ensureDropdownsSheetExists(spreadsheetId: string): Promise<void> {
  const meta = await getSpreadsheetMetadata(spreadsheetId);
  const hasDropdowns = meta.sheets.some(s => s.properties.title === 'Dropdowns');`;

const newEnsure = `const dropdownsSheetExistsCache = new Set<string>();

export async function ensureDropdownsSheetExists(spreadsheetId: string): Promise<void> {
  if (dropdownsSheetExistsCache.has(spreadsheetId)) return;
  const meta = await getSpreadsheetMetadata(spreadsheetId);
  const hasDropdowns = meta.sheets.some(s => s.properties.title === 'Dropdowns');
  if (hasDropdowns) dropdownsSheetExistsCache.add(spreadsheetId);`;

if (code.includes(oldEnsure)) {
  code = code.replace(oldEnsure, newEnsure);
  fs.writeFileSync('src/lib/dropdowns.ts', code);
  console.log('Successfully cached ensureDropdownsSheetExists');
} else {
  console.log('oldEnsure not found');
}
INNER
node update_dropdowns_cache.js
