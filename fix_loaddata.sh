cat << 'INNER' > replace_loaddata.js
const fs = require('fs');
let code = fs.readFileSync('src/components/InventoryList.tsx', 'utf8');

const oldLoadData = `      let data: SheetRow[] = [];
      if (type === "stock") {
        data = await getInventory(sheetId, targetTab);
      } else {
        if (!className)
          throw new Error("Class Name is required for class inventory");
        data = await getClassInventory(sheetId, targetTab, className);

        try {
          await ensureItemMasterSheetExists(sheetId);
          const mItems = await getMasterItems(sheetId, "Item Master");
          setMasterItems(mItems);
        } catch (e) {
          console.error("Failed to load master items", e);
        }
      }

      try {
        const cd = await getMergedCustomDropdowns();
        setCustomDropdowns(cd);
      } catch(e) { console.error("Failed to load custom dropdowns", e); }

      setItems(data);
      setModifiedRows(new Set());`;

const newLoadData = `      const promises: Promise<any>[] = [];
      let data: SheetRow[] = [];

      promises.push(
        (type === "stock"
          ? getInventory(sheetId, targetTab)
          : getClassInventory(sheetId, targetTab, className!)
        ).then(res => { data = res; })
      );

      if (type === "class") {
        promises.push(
          ensureItemMasterSheetExists(sheetId)
            .then(() => getMasterItems(sheetId, "Item Master"))
            .then(mItems => setMasterItems(mItems))
            .catch(e => console.error("Failed to load master items", e))
        );
      }

      promises.push(
        getMergedCustomDropdowns()
          .then(cd => setCustomDropdowns(cd))
          .catch(e => console.error("Failed to load custom dropdowns", e))
      );

      await Promise.all(promises);

      setItems(data);
      setModifiedRows(new Set());`;

if (code.includes(oldLoadData)) {
  code = code.replace(oldLoadData, newLoadData);
  fs.writeFileSync('src/components/InventoryList.tsx', code);
  console.log('Successfully replaced loadData');
} else {
  console.log('oldLoadData not found');
}
INNER
node replace_loaddata.js
