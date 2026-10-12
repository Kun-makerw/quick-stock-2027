const fs = require('fs');
const file = 'src/lib/sheets.ts';
let code = fs.readFileSync(file, 'utf8');

code = code.replace(/const templateItems = className\.toLowerCase\(\)\.startsWith\("lab"\) \? await getLabTemplate\(spreadsheetId\) : await getClassTemplate\(spreadsheetId\);\s*const range = `'\$\{actualSheetName\}'!A1:I`;/g, 
`const templateItems = className.toLowerCase().startsWith("lab") ? await getLabTemplate(spreadsheetId) : await getClassTemplate(spreadsheetId);
  const range = \`'\${actualSheetName}'!A1:I\`;`);

code = code.replace(/const actualSheetId = sheet\?\.properties\.sheetId;\s*const insertIndex = lastDataRow > 0 \? lastDataRow : 1;/g, 
`const actualSheetId = sheet?.properties.sheetId;
  const insertIndex = lastDataRow > 0 ? lastDataRow : 1;`);

fs.writeFileSync(file, code);
