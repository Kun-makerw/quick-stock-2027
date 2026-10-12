sed -i 's/const sheetId = localStorage.getItem('\''quickStock_stockSheetId'\'') || '\'''\'';/const stockSheetId = localStorage.getItem('\''quickStock_stockSheetId'\'') || '\'''\'';\n  const classesSheetId = localStorage.getItem('\''quickStock_classesSheetId'\'') || '\'''\'';/g' src/pages/ModelsList.tsx
sed -i 's/}, \[sheetId\]);/}, \[stockSheetId, classesSheetId\]);/g' src/pages/ModelsList.tsx
sed -i 's/if (!sheetId) {/if (!stockSheetId \&\& !classesSheetId) {/g' src/pages/ModelsList.tsx
sed -i 's/if (!sheetId) return;/if (!stockSheetId \&\& !classesSheetId) return;/g' src/pages/ModelsList.tsx
