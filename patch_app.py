import sys

with open("src/App.tsx", "r") as f:
    content = f.read()

import_statement = "import { ItemsList } from './pages/ItemsList';\n"
content = content.replace("import { LabDefaultItems } from './pages/LabDefaultItems';", "import { LabDefaultItems } from './pages/LabDefaultItems';\n" + import_statement)

route_statement = '              <Route path="items" element={<ItemsList />} />\n'
content = content.replace('<Route path="types" element={<ModelsList />} />', '<Route path="types" element={<ModelsList />} />\n' + route_statement)

with open("src/App.tsx", "w") as f:
    f.write(content)

with open("src/components/Layout.tsx", "r") as f:
    layout_content = f.read()

layout_content = layout_content.replace("{ name: 'Types', path: '/types', icon: Layers },", "{ name: 'Item Names', path: '/items', icon: Package },\n    { name: 'Types', path: '/types', icon: Layers },")
layout_content = layout_content.replace("import { Layers, ChevronRight, Tag, LayoutTemplate, CheckCircle2, Activity, Settings, LogOut, Package as Box, Folder, Search, List, ChevronLeft, Home } from 'lucide-react';", "import { Layers, ChevronRight, Tag, LayoutTemplate, CheckCircle2, Activity, Settings, LogOut, Package as Box, Folder, Search, List, ChevronLeft, Home, Package } from 'lucide-react';")

with open("src/components/Layout.tsx", "w") as f:
    f.write(layout_content)
