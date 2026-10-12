sed -i '/onKeyDown={(e) => { if (e.key === "Enter") { e.preventDefault(); handleCustomBlur(); } }}/d' src/components/InventoryList.tsx
