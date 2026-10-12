import sys

def patch_file(filename):
    with open(filename, "r") as f:
        content = f.read()

    new_function = """export interface DashboardSummary {
  classes: {
    totalItems: number;
    checkedItems: number;
  };
  stock: {
    totalItems: number;
    checkedItems: number;
  };
  items: { name: string, quantity: number, inStock: number, inClasses: number, tag: string, type: string }[];
  tags: { name: string, quantity: number }[];
}

export async function getDashboardSummary(spreadsheetId: string): Promise<DashboardSummary> {
  const meta = await getSpreadsheetMetadata(spreadsheetId);
  
  const classesSheet = meta.sheets.find((s: any) => s.properties.title.toLowerCase() === 'classes') || meta.sheets[0];
  const stockSheet = meta.sheets.find((s: any) => s.properties.title.toLowerCase() === 'stock room');

  const classesTabName = classesSheet?.properties?.title || 'Sheet1';
  const stockTabName = stockSheet?.properties?.title;

  const result: DashboardSummary = {
    classes: { totalItems: 0, checkedItems: 0 },
    stock: { totalItems: 0, checkedItems: 0 },
    items: [],
    tags: []
  };

  const itemMap = new Map<string, { quantity: number, inStock: number, inClasses: number, tag: string, type: string }>();
  const tagMap = new Map<string, number>();

  // Fetch Classes
  const classesRange = `'${classesTabName}'!A2:I`;
  try {
    const classesData = await fetchWithRetry(`https://sheets.googleapis.com/v4/spreadsheets/${spreadsheetId}/values/${encodeURIComponent(classesRange)}`);
    if (classesData.values) {
      let currentClass = '';
      classesData.values.forEach((row: string[]) => {
        if (row[0] && String(row[0]).trim() !== '') {
          currentClass = String(row[0]).trim();
        }
        if (currentClass && row[1] && String(row[1]).trim() !== '') {
          const itemName = String(row[1]).trim();
          const quantity = parseInt(row[2]) || 0;
          const tag = row[3] ? String(row[3]).trim() : 'Uncategorized';
          const type = row[4] ? String(row[4]).trim() : '';
          
          result.classes.totalItems += quantity;
          if (row[8] === 'Checked') result.classes.checkedItems += quantity;

          const existing = itemMap.get(itemName) || { quantity: 0, inStock: 0, inClasses: 0, tag, type };
          existing.quantity += quantity;
          existing.inClasses += quantity;
          itemMap.set(itemName, existing);

          tagMap.set(tag, (tagMap.get(tag) || 0) + quantity);
        }
      });
    }
  } catch (e) {
    console.error("Failed to load classes data for dashboard", e);
  }

  // Fetch Stock Room
  if (stockTabName) {
    const stockRange = `'${stockTabName}'!A2:I`;
    try {
      const stockData = await fetchWithRetry(`https://sheets.googleapis.com/v4/spreadsheets/${spreadsheetId}/values/${encodeURIComponent(stockRange)}`);
      if (stockData.values) {
        let currentStock = '';
        stockData.values.forEach((row: string[]) => {
          if (row[0] && String(row[0]).trim() !== '') {
            currentStock = String(row[0]).trim();
          }
          if (currentStock && row[1] && String(row[1]).trim() !== '') {
            const itemName = String(row[1]).trim();
            const quantity = parseInt(row[2]) || 0;
            const tag = row[3] ? String(row[3]).trim() : 'Uncategorized';
            const type = row[4] ? String(row[4]).trim() : '';
            
            result.stock.totalItems += quantity;
            if (row[8] === 'Checked') result.stock.checkedItems += quantity;

            const existing = itemMap.get(itemName) || { quantity: 0, inStock: 0, inClasses: 0, tag, type };
            existing.quantity += quantity;
            existing.inStock += quantity;
            itemMap.set(itemName, existing);

            tagMap.set(tag, (tagMap.get(tag) || 0) + quantity);
          }
        });
      }
    } catch (e) {
      console.error("Failed to load stock room data for dashboard", e);
    }
  }

  result.items = Array.from(itemMap.entries())
    .map(([name, data]) => ({ name, ...data }))
    .sort((a, b) => b.quantity - a.quantity);
    
  result.tags = Array.from(tagMap.entries())
    .map(([name, quantity]) => ({ name, quantity }))
    .sort((a, b) => b.quantity - a.quantity);

  return result;
}
"""

    with open(filename, "a") as f:
        f.write("\n" + new_function + "\n")

patch_file("src/lib/sheets.ts")
