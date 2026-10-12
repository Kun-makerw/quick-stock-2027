cat << 'INNER' > fix_debounced_input.cjs
const fs = require('fs');
const code = fs.readFileSync('src/components/InventoryList.tsx', 'utf8');

const debouncedComponent = `function DebouncedInput({ value, onChange, ...props }: any) {
  const [local, setLocal] = useState(value);
  
  useEffect(() => {
    setLocal(value);
  }, [value]);

  return (
    <input
      {...props}
      value={local}
      onChange={e => {
        setLocal(e.target.value);
      }}
      onBlur={e => {
        if (local !== value) {
          onChange(e.target.value);
        }
      }}
      onKeyDown={e => {
        if (e.key === 'Enter') {
          e.currentTarget.blur();
        }
      }}
    />
  );
}

export function InventoryList(`;

if (!code.includes('function DebouncedInput')) {
  fs.writeFileSync('src/components/InventoryList.tsx', code.replace('export function InventoryList(', debouncedComponent));
  
  let newCode = fs.readFileSync('src/components/InventoryList.tsx', 'utf8');
  newCode = newCode.replace(/<input\n\s*type="text"\n\s*value=\{item\.item\}/g, '<DebouncedInput\n                type="text"\n                value={item.item}');
  newCode = newCode.replace(/<input\n\s*type="text"\n\s*inputMode="numeric"\n\s*value=\{item\.quantity\}/g, '<DebouncedInput\n                type="text"\n                inputMode="numeric"\n                value={item.quantity}');
  newCode = newCode.replace(/<input\n\s*type="text"\n\s*placeholder="Hostname"\n\s*value=\{item\.hostname \|\| ""\}/g, '<DebouncedInput\n                  type="text"\n                  placeholder="Hostname"\n                  value={item.hostname || ""}');
  newCode = newCode.replace(/<input\n\s*type="text"\n\s*placeholder="SNID \(Scan\)"\n\s*value=\{item\.snid \|\| ""\}/g, '<DebouncedInput\n                    type="text"\n                    placeholder="SNID (Scan)"\n                    value={item.snid || ""}');
  
  fs.writeFileSync('src/components/InventoryList.tsx', newCode);
  console.log('Successfully injected DebouncedInput');
}
INNER
node fix_debounced_input.cjs
