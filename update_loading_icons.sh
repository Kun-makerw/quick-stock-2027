#!/bin/bash

# Update src/pages/ClassesList.tsx
sed -i 's/import { RefreshCw, Download, Plus, Settings, X, Search, MoreVertical, Edit2, ShieldAlert }/import { RefreshCw, Download, Plus, Settings, X, Search, MoreVertical, Edit2, ShieldAlert }\nimport { FluidSpinner } from "..\/components\/FluidSpinner";/g' src/pages/ClassesList.tsx
sed -i 's/<RefreshCw className="w-8 h-8 animate-spin text-indigo-500" \/>/<FluidSpinner size="md" \/>/g' src/pages/ClassesList.tsx

# Update src/components/InventoryList.tsx
sed -i 's/import { PackageSearch, QrCode, Search, RefreshCw, X, Image as ImageIcon, MapPin, AlertCircle, AlertTriangle, Cloud, MoreVertical, CheckCircle2, ScanLine, Type }/import { PackageSearch, QrCode, Search, RefreshCw, X, Image as ImageIcon, MapPin, AlertCircle, AlertTriangle, Cloud, MoreVertical, CheckCircle2, ScanLine, Type }\nimport { FluidSpinner } from ".\/FluidSpinner";/g' src/components/InventoryList.tsx
sed -i 's/<RefreshCw className="w-8 h-8 animate-spin text-blue-500 dark:text-blue-400" \/>/<FluidSpinner size="md" \/>/g' src/components/InventoryList.tsx

# Update src/pages/DefaultItems.tsx
sed -i 's/import { Plus, X, Search, Edit2, Check, AlertCircle, Loader2, Save, MoreVertical, Settings }/import { Plus, X, Search, Edit2, Check, AlertCircle, Loader2, Save, MoreVertical, Settings }\nimport { FluidSpinner } from "..\/components\/FluidSpinner";/g' src/pages/DefaultItems.tsx
sed -i 's/<Loader2 className="w-8 h-8 text-indigo-600 animate-spin" \/>/<FluidSpinner size="md" \/>/g' src/pages/DefaultItems.tsx

chmod +x update_loading_icons.sh
./update_loading_icons.sh
