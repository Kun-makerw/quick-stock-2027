sed -i -n '1,133p' src/lib/dropdowns.ts
cat << 'INNEREOF' >> src/lib/dropdowns.ts
export async function getMergedCustomDropdowns(): Promise<CustomDropdowns> {
  const stockSheetId = localStorage.getItem('quickStock_stockSheetId') || '';
  const classesSheetId = localStorage.getItem('quickStock_classesSheetId') || '';
  
  const result: CustomDropdowns = { tags: [], typesByTag: {} };
  
  const merge = (cd: CustomDropdowns) => {
    cd.tags.forEach(tag => {
      if (!result.tags.includes(tag)) result.tags.push(tag);
    });
    Object.entries(cd.typesByTag).forEach(([tag, types]) => {
      if (!result.typesByTag[tag]) result.typesByTag[tag] = [];
      types.forEach(type => {
        if (!result.typesByTag[tag].includes(type)) result.typesByTag[tag].push(type);
      });
    });
  };

  const promises = [];
  if (stockSheetId) promises.push(getCustomDropdowns(stockSheetId).then(merge).catch(() => {}));
  if (classesSheetId && classesSheetId !== stockSheetId) promises.push(getCustomDropdowns(classesSheetId).then(merge).catch(() => {}));
  
  await Promise.all(promises);
  return result;
}

export async function addMergedCustomTag(tag: string): Promise<void> {
  const stockSheetId = localStorage.getItem('quickStock_stockSheetId') || '';
  const classesSheetId = localStorage.getItem('quickStock_classesSheetId') || '';
  
  const promises = [];
  if (stockSheetId) promises.push(addCustomTag(stockSheetId, tag).catch(() => {}));
  if (classesSheetId && classesSheetId !== stockSheetId) promises.push(addCustomTag(classesSheetId, tag).catch(() => {}));
  
  await Promise.all(promises);
}

export async function addMergedCustomType(tag: string, type: string): Promise<void> {
  const stockSheetId = localStorage.getItem('quickStock_stockSheetId') || '';
  const classesSheetId = localStorage.getItem('quickStock_classesSheetId') || '';
  
  const promises = [];
  if (stockSheetId) promises.push(addCustomType(stockSheetId, tag, type).catch(() => {}));
  if (classesSheetId && classesSheetId !== stockSheetId) promises.push(addCustomType(classesSheetId, tag, type).catch(() => {}));
  
  await Promise.all(promises);
}

export async function updateMergedAllDropdowns(dropdowns: CustomDropdowns): Promise<void> {
  const stockSheetId = localStorage.getItem('quickStock_stockSheetId') || '';
  const classesSheetId = localStorage.getItem('quickStock_classesSheetId') || '';
  
  const promises = [];
  if (stockSheetId) promises.push(updateAllDropdowns(stockSheetId, dropdowns).catch(() => {}));
  if (classesSheetId && classesSheetId !== stockSheetId) promises.push(updateAllDropdowns(classesSheetId, dropdowns).catch(() => {}));
  
  await Promise.all(promises);
}
INNEREOF
