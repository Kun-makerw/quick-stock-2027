sed -i 's/  if (stockSheetId) {/  const promises = [];\n  if (stockSheetId) { promises.push(getCustomDropdowns(stockSheetId).then(merge).catch(e => {})); }/g' src/lib/dropdowns.ts
