#!/bin/bash

# Update src/pages/ClassesList.tsx
sed -i 's/import React/import { FluidSpinner } from "..\/components\/FluidSpinner";\nimport React/g' src/pages/ClassesList.tsx
sed -i 's/<RefreshCw className="w-8 h-8 animate-spin text-indigo-500" \/>/<FluidSpinner size="md" \/>/g' src/pages/ClassesList.tsx

# Update src/components/InventoryList.tsx
sed -i 's/import React/import { FluidSpinner } from ".\/FluidSpinner";\nimport React/g' src/components/InventoryList.tsx
sed -i 's/<RefreshCw className="w-8 h-8 animate-spin text-blue-500 dark:text-blue-400" \/>/<FluidSpinner size="md" \/>/g' src/components/InventoryList.tsx

# Update src/pages/DefaultItems.tsx
sed -i 's/import React/import { FluidSpinner } from "..\/components\/FluidSpinner";\nimport React/g' src/pages/DefaultItems.tsx
sed -i 's/<Loader2 className="w-8 h-8 text-indigo-600 animate-spin" \/>/<FluidSpinner size="md" \/>/g' src/pages/DefaultItems.tsx

chmod +x update_loading_icons2.sh
./update_loading_icons2.sh
