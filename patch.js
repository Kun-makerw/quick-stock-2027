const fs = require('fs');
const file = 'src/lib/sheets.ts';
let code = fs.readFileSync(file, 'utf8');

code = code.replace(/const headerData = await fetchWithRetry\(`https:\/\/sheets\.googleapis\.com\/v4\/spreadsheets\/\$\{spreadsheetId\}\/values\/'\$\{actualSheetName\}'!A1:I2`\);\s*const header = headerData\.values\?\.\[0\];\s*const sampleRows = headerData\.values\?\.slice\(1\);\s*const format = detectSheetFormat\(header, sampleRows\);/g, 
`const fullData = await fetchWithRetry(\`https://sheets.googleapis.com/v4/spreadsheets/\${spreadsheetId}/values/'\${actualSheetName}'!A1:I\`);
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
  }`);

code = code.replace(/const insertIndex = headerData\.values \? headerData\.values\.length : 1; \/\/ Append after the last row with data/g, 
`const insertIndex = lastDataRow > 0 ? lastDataRow : 1;`);

fs.writeFileSync(file, code);
