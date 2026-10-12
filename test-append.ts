import { addClassToInventory } from './src/lib/sheets.ts';

// Mock localStorage for Node
(global as any).localStorage = {
  store: {
    sheets: {
      'Classes': [
        ['Class Name', 'Item', 'Qty'],
        ['Room 1', 'Laptop', '1'],
        ['', 'Mouse', '1']
      ]
    }
  },
  getItem(key: string) { return this.store ? JSON.stringify(this.store) : null; },
  setItem(key: string, val: string) { this.store = JSON.parse(val); },
  removeItem(key: string) { delete this.store; }
};

async function main() {
  await addClassToInventory('admin_local_spreadsheet_id', 'Classes', 'My New Class');
  console.log("Mock store:", JSON.stringify((global as any).localStorage.store, null, 2));
}
main();
