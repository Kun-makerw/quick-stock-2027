sed -i 's/tagValue={item.tag || "Other"}/tagValue={(item.tag || "Other").trim()}/g' src/components/InventoryList.tsx
sed -i 's/customDropdowns.typesByTag\[item.tag || "Other"\]/customDropdowns.typesByTag[(item.tag || "Other").trim()]/g' src/components/InventoryList.tsx
sed -i 's/existingTypesByTag\[item.tag || "Other"\]/existingTypesByTag[(item.tag || "Other").trim()]/g' src/components/InventoryList.tsx

sed -i 's/tagValue={item.tag}/tagValue={(item.tag || "Other").trim()}/g' src/pages/DefaultItems.tsx
sed -i 's/customDropdowns.typesByTag\[item.tag || "Other"\]/customDropdowns.typesByTag[(item.tag || "Other").trim()]/g' src/pages/DefaultItems.tsx
sed -i 's/existingTypesByTag\[item.tag || "Other"\]/existingTypesByTag[(item.tag || "Other").trim()]/g' src/pages/DefaultItems.tsx
