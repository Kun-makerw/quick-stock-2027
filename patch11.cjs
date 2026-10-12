const fs = require('fs');
const file = 'src/components/InventoryList.tsx';
let code = fs.readFileSync(file, 'utf8');

code = code.replace(/if \\(lastRow !== null\\) \\{[\s\S]*?await appendInventoryItem\([\s\S]*?\);\n        }/g,
`if (type === "class") {
          if (lastRow !== null) {
            await addItemToClass(
              sheetId,
              actualSheetNumericalId,
              actualTabName,
              targetLocation,
              nameToAdd,
              lastRow,
              qtyToAdd,
              tagToAdd,
              typeToAdd,
              hostToAdd,
              snidToAdd,
            );
          } else {
             await addClassToInventory(sheetId, actualTabName, targetLocation);
             let newLastRow = await getClassLastRow(sheetId, actualTabName, targetLocation);
             if (newLastRow !== null) {
                await addItemToClass(
                  sheetId,
                  actualSheetNumericalId,
                  actualTabName,
                  targetLocation,
                  nameToAdd,
                  newLastRow,
                  qtyToAdd,
                  tagToAdd,
                  typeToAdd,
                  hostToAdd,
                  snidToAdd,
                );
             }
          }
        } else {
          await appendInventoryItem(
            sheetId,
            actualTabName,
            nameToAdd,
            qtyToAdd,
            tagToAdd,
            typeToAdd,
            "",
            hostToAdd,
            snidToAdd,
            targetLocation,
          );
        }`);

fs.writeFileSync(file, code);
