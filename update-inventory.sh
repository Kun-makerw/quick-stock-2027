sed -i 's/const cd = await getCustomDropdowns(sheetId);/const cd = await getMergedCustomDropdowns();/g' src/components/InventoryList.tsx
sed -i 's/await addCustomType(sheetId, tag, type);/await addMergedCustomType(tag, type);/g' src/components/InventoryList.tsx
sed -i 's/await addCustomTag(sheetId, tag);/await addMergedCustomTag(tag);/g' src/components/InventoryList.tsx
sed -i 's/import { getCustomDropdowns, addCustomTag, addCustomType, CustomDropdowns }/import { getCustomDropdowns, addCustomTag, addCustomType, CustomDropdowns, getMergedCustomDropdowns, addMergedCustomTag, addMergedCustomType }/g' src/components/InventoryList.tsx

sed -i 's/const cd = await getCustomDropdowns(spreadsheetId);/const cd = await getMergedCustomDropdowns();/g' src/pages/DefaultItems.tsx
sed -i 's/await addCustomType(spreadsheetId, tag, type);/await addMergedCustomType(tag, type);/g' src/pages/DefaultItems.tsx
sed -i 's/await addCustomTag(spreadsheetId, tag);/await addMergedCustomTag(tag);/g' src/pages/DefaultItems.tsx
sed -i 's/import { getCustomDropdowns, addCustomTag, addCustomType, CustomDropdowns }/import { getCustomDropdowns, addCustomTag, addCustomType, CustomDropdowns, getMergedCustomDropdowns, addMergedCustomTag, addMergedCustomType }/g' src/pages/DefaultItems.tsx

sed -i 's/const cd = await getCustomDropdowns(sheetId);/const cd = await getMergedCustomDropdowns();/g' src/pages/ModelsList.tsx
sed -i 's/await updateAllDropdowns(sheetId, newDropdowns);/await updateMergedAllDropdowns(newDropdowns);/g' src/pages/ModelsList.tsx
sed -i 's/import { getCustomDropdowns, updateAllDropdowns, CustomDropdowns }/import { getCustomDropdowns, updateAllDropdowns, CustomDropdowns, getMergedCustomDropdowns, updateMergedAllDropdowns }/g' src/pages/ModelsList.tsx
