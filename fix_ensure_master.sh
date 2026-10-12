cat << 'INNER' > update_master_cache.cjs
const fs = require('fs');
let code = fs.readFileSync('src/lib/sheets.ts', 'utf8');

const oldEnsure = `export async function ensureItemMasterSheetExists(spreadsheetId: string): Promise<void> {
  const meta = await getSpreadsheetMetadata(spreadsheetId);
  const hasItemMaster = meta.sheets.some(s => s.properties.title === 'Item Master');`;

const newEnsure = `const itemMasterExistsCache = new Set<string>();

export async function ensureItemMasterSheetExists(spreadsheetId: string): Promise<void> {
  if (itemMasterExistsCache.has(spreadsheetId)) return;
  const meta = await getSpreadsheetMetadata(spreadsheetId);
  const hasItemMaster = meta.sheets.some(s => s.properties.title === 'Item Master');
  if (hasItemMaster) itemMasterExistsCache.add(spreadsheetId);`;

if (code.includes(oldEnsure)) {
  code = code.replace(oldEnsure, newEnsure);
  fs.writeFileSync('src/lib/sheets.ts', code);
  console.log('Successfully cached ensureItemMasterSheetExists');
} else {
  console.log('oldEnsure not found');
}
INNER
node update_master_cache.cjs
