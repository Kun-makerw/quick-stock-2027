cat << 'INNER' > update_template_cache.cjs
const fs = require('fs');
let code = fs.readFileSync('src/lib/sheets.ts', 'utf8');

const oldEnsure = `export async function ensureClassTemplateSheetExists(spreadsheetId: string): Promise<void> {
  const meta = await getSpreadsheetMetadata(spreadsheetId);
  const hasTemplate = meta.sheets.some(s => s.properties.title === 'Class_Template');`;

const newEnsure = `const classTemplateExistsCache = new Set<string>();

export async function ensureClassTemplateSheetExists(spreadsheetId: string): Promise<void> {
  if (classTemplateExistsCache.has(spreadsheetId)) return;
  const meta = await getSpreadsheetMetadata(spreadsheetId);
  const hasTemplate = meta.sheets.some(s => s.properties.title === 'Class_Template');
  if (hasTemplate) classTemplateExistsCache.add(spreadsheetId);`;

if (code.includes(oldEnsure)) {
  code = code.replace(oldEnsure, newEnsure);
  fs.writeFileSync('src/lib/sheets.ts', code);
  console.log('Successfully cached ensureClassTemplateSheetExists');
} else {
  console.log('oldEnsure not found');
}
INNER
node update_template_cache.cjs
