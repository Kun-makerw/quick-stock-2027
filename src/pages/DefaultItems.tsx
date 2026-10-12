import { FluidSpinner } from "../components/FluidSpinner";
import React, { useState, useEffect } from 'react';
import { ChevronLeft, Save, Plus, Loader2, Trash2, AlertCircle } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useAuth } from '../components/AuthProvider';
import { fetchWithRetry, getSpreadsheetMetadata, deleteRows, ensureClassTemplateSheetExists } from '../lib/sheets';
import { cn, getItemIcon } from '../lib/utils';
import { TagInput, TypeInput } from '../components/InventoryList';
import { getCustomDropdowns, addCustomTag, addCustomType, CustomDropdowns, getMergedCustomDropdowns, addMergedCustomTag, addMergedCustomType } from '../lib/dropdowns';

export function DefaultItems() {
  const { user } = useAuth();
  const [spreadsheetId, setSpreadsheetId] = useState<string | null>(null);

  useEffect(() => {
    const savedId = localStorage.getItem('quickStock_classesSheetId');
    setSpreadsheetId(savedId);
  }, []);

  const [items, setItems] = useState<Array<{row: number, name: string, tag: string, type: string}>>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);
  const [modifiedRows, setModifiedRows] = useState<Set<number>>(new Set());
  const [templateSheetId, setTemplateSheetId] = useState<number | null>(null);
  const [itemToDelete, setItemToDelete] = useState<number | null>(null);
  const [customDropdowns, setCustomDropdowns] = useState<CustomDropdowns>({ tags: [], typesByTag: {} });

  const loadTemplate = async () => {
    if (!spreadsheetId) {
      setLoading(false);
      return;
    }
    try {
      setLoading(true);
      await ensureClassTemplateSheetExists(spreadsheetId);
      const meta = await getSpreadsheetMetadata(spreadsheetId);
      const sheet = meta.sheets.find(s => s.properties.title === 'Class_Template');
      try {
        const cd = await getMergedCustomDropdowns();
        setCustomDropdowns(cd);
      } catch (e) {}
      if (sheet) {
        setTemplateSheetId(sheet.properties.sheetId);
      }

      const range = `'Class_Template'!A2:C`;
      const encodedRange = encodeURIComponent(range);
      let data;
      try {
        data = await fetchWithRetry(`https://sheets.googleapis.com/v4/spreadsheets/${spreadsheetId}/values/${encodedRange}`);
      } catch (err: any) {
        if (err.status === 400 && err.message?.includes('Unable to parse range')) {
          data = { values: [
            ['USB Mouse', 'Peripheral', ''],
            ['HDMI Cable (2m)', 'Cable', '2m'],
            ['Standard Keyboard', 'Peripheral', ''],
            ['DisplayPort Adaptor', 'Accessory', '']
          ]};
        } else {
          throw err;
        }
      }
      
      if (data.values) {
        setItems(data.values.map((row: any[], index: number) => ({
          row: index + 2,
          name: row[0] || '',
          tag: row[1] || '',
          type: row[2] || '',
        })));
      } else {
        setItems([]);
      }
    } catch (err: any) {
      console.error('Failed to load template:', err);
      setError(err.message || 'Failed to load template');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadTemplate();
  }, [spreadsheetId]);

  const handleAddCustomTag = async (tag: string) => {
    if (!spreadsheetId) return;
    try {
      await addMergedCustomTag(tag);
      setCustomDropdowns((prev) => ({
        ...prev,
        tags: [...new Set([...prev.tags, tag])],
      }));
    } catch (e) {
      console.error("Failed to add custom tag", e);
    }
  };

  const handleAddCustomType = async (tag: string, type: string) => {
    if (!spreadsheetId) return;
    try {
      await addMergedCustomType(tag, type);
      setCustomDropdowns((prev) => {
        const existingTypes = prev.typesByTag[tag] || [];
        return {
          ...prev,
          typesByTag: {
            ...prev.typesByTag,
            [tag]: [...new Set([...existingTypes, type])],
          },
        };
      });
    } catch (e) {
      console.error("Failed to add custom type", e);
    }
  };

  const existingTags = React.useMemo(() => {
    const tags = new Set<string>();
    items.forEach(item => {
      if (item.tag) tags.add(item.tag);
    });
    return Array.from(tags).sort((a, b) => a.localeCompare(b));
  }, [items]);

  const existingTypesByTag = React.useMemo(() => {
    const map: Record<string, Set<string>> = {};
    items.forEach(item => {
      if (item.tag && item.type) {
        if (!map[item.tag]) map[item.tag] = new Set();
        map[item.tag].add(item.type);
      }
    });
    const result: Record<string, string[]> = {};
    for (const tag in map) {
      result[tag] = Array.from(map[tag]).sort((a, b) => a.localeCompare(b));
    }
    return result;
  }, [items]);

  const handleNameChange = (rowIndex: number, val: string) => {
    setItems(prev => prev.map((item, idx) => {
      if (idx === rowIndex) {
        setModifiedRows(prevMod => new Set(prevMod).add(item.row));
        return { ...item, name: val };
      }
      return item;
    }));
  };

  const handleTagChange = (rowIndex: number, val: string) => {
    setItems(prev => prev.map((item, idx) => {
      if (idx === rowIndex) {
        setModifiedRows(prevMod => new Set(prevMod).add(item.row));
        return { ...item, tag: val };
      }
      return item;
    }));
  };

  const handleTypeChange = (rowIndex: number, val: string) => {
    setItems(prev => prev.map((item, idx) => {
      if (idx === rowIndex) {
        setModifiedRows(prevMod => new Set(prevMod).add(item.row));
        return { ...item, type: val };
      }
      return item;
    }));
  };

  const handleAddNew = () => {
    const newRow = items.length > 0 ? Math.max(...items.map(i => i.row)) + 1 : 2;
    setItems(prev => [...prev, { row: newRow, name: 'New Default Item', tag: 'Peripheral', type: '' }]);
    setModifiedRows(prevMod => new Set(prevMod).add(newRow));
  };

  const handleDelete = (rowIndex: number) => {
    setItemToDelete(rowIndex);
  };

  const confirmDelete = () => {
    if (itemToDelete === null) return;
    setItems(prev => prev.map((item, idx) => {
      if (idx === itemToDelete) {
        setModifiedRows(prevMod => new Set(prevMod).add(item.row));
        return { ...item, name: '', tag: '', type: '' }; // Will be filtered out on save
      }
      return item;
    }));
    setItemToDelete(null);
  };

  const cancelDelete = () => {
    setItemToDelete(null);
  };

  const handleSave = async () => {
    if (!spreadsheetId || modifiedRows.size === 0) return;
    setSaving(true);
    try {
      const allUpdates = items.filter(i => modifiedRows.has(i.row));
      const deletes = allUpdates.filter(i => i.name === '');
      const updates = allUpdates.filter(i => i.name !== '');

      if (updates.length > 0) {
        const data = updates.map(update => ({
          range: `'Class_Template'!A${update.row}:C${update.row}`,
          values: [[update.name, update.tag, update.type]]
        }));
        await fetchWithRetry(`https://sheets.googleapis.com/v4/spreadsheets/${spreadsheetId}/values:batchUpdate`, {
          method: 'POST',
          body: JSON.stringify({
            valueInputOption: 'USER_ENTERED',
            data
          })
        });
      }

      if (deletes.length > 0 && templateSheetId !== null) {
        await deleteRows(spreadsheetId, templateSheetId, 'Class_Template', deletes.map(d => d.row));
      }

      setModifiedRows(new Set());
      if (deletes.length > 0) {
        await loadTemplate();
      }
    } catch (error) {
      console.error('Failed to save template:', error);
      alert('Failed to save changes.');
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center p-12">
        <FluidSpinner size="md" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex flex-col h-[calc(100vh-10rem)] sm:h-auto max-w-2xl mx-auto">
        <div className="flex items-center gap-4 mb-6">
          <Link to="/" className="p-2 -ml-2 rounded-full hover:bg-slate-200 dark:bg-slate-700 transition-colors text-slate-500 dark:text-slate-400">
            <ChevronLeft className="w-6 h-6" />
          </Link>
          <h2 className="text-2xl font-bold text-slate-800 dark:text-slate-200">Class Default Items</h2>
        </div>
        <div className="bg-red-50 text-red-700 p-6 rounded-2xl flex items-center justify-between shadow-sm border border-red-100">
          <div className="flex flex-col gap-1">
            <span className="font-semibold text-lg">Error</span>
            <span className="text-sm opacity-80">{error}</span>
          </div>
          <Link to="/settings" className="px-5 py-2.5 bg-red-600 hover:bg-red-700 text-white font-medium rounded-xl transition-colors shadow-sm">
            Check Settings
          </Link>
        </div>
      </div>
    );
  }

  if (!spreadsheetId) {
    return (
      <div className="flex flex-col h-[calc(100vh-10rem)] sm:h-auto max-w-2xl mx-auto">
        <div className="flex items-center gap-4 mb-6">
          <Link to="/" className="p-2 -ml-2 rounded-full hover:bg-slate-200 dark:bg-slate-700 transition-colors text-slate-500 dark:text-slate-400">
            <ChevronLeft className="w-6 h-6" />
          </Link>
          <h2 className="text-2xl font-bold text-slate-800 dark:text-slate-200">Default Items</h2>
        </div>
        <div className="bg-red-50 text-red-700 p-6 rounded-2xl flex items-center justify-between shadow-sm border border-red-100">
          <div className="flex flex-col gap-1">
            <span className="font-semibold text-lg">Not Configured</span>
            <span className="text-sm opacity-80">Classes Spreadsheet ID is missing.</span>
          </div>
          <Link to="/settings" className="px-5 py-2.5 bg-red-600 hover:bg-red-700 text-white font-medium rounded-xl transition-colors shadow-sm">
            Go to Settings
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-[calc(100vh-10rem)] sm:h-auto max-w-2xl mx-auto">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-4">
          <Link to="/" className="p-2 -ml-2 rounded-full hover:bg-slate-200 dark:bg-slate-700 transition-colors text-slate-500 dark:text-slate-400">
            <ChevronLeft className="w-6 h-6" />
          </Link>
          <h2 className="text-2xl font-bold text-slate-800 dark:text-slate-200">Default Items</h2>
        </div>
        <div className="flex gap-2">
          <button
            onClick={handleAddNew}
            className="flex items-center gap-2 px-4 py-2 bg-white/60 dark:bg-slate-800/60 backdrop-blur-md border border-white/40 dark:border-white/10 text-slate-700 dark:text-slate-300 font-semibold rounded-full hover:bg-slate-50 dark:hover:bg-slate-700 transition-colors shadow-sm text-sm"
          >
            <Plus className="w-4 h-4" />
            Add
          </button>
          <button
            onClick={handleSave}
            disabled={saving || modifiedRows.size === 0}
            className={cn(
              "flex items-center gap-2 px-4 py-2 bg-indigo-600 text-white font-semibold rounded-full shadow-md transition-all text-sm",
              (saving || modifiedRows.size === 0) ? "opacity-50 cursor-not-allowed" : "hover:bg-indigo-700 hover:shadow-lg"
            )}
          >
            {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
            Save
          </button>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto min-h-0 bg-white/70 dark:bg-slate-900/60 backdrop-blur-2xl rounded-[32px] shadow-sm border border-slate-200 dark:border-slate-700/50 divide-y divide-slate-100 dark:divide-slate-700/50">
        {items.filter(i => i.name).length === 0 ? (
          <div className="p-8 text-center text-slate-500 dark:text-slate-400">No default items found.</div>
        ) : (
          items.map((item, idx) => {
            if (!item.name) return null;
            const ItemIcon = getItemIcon(item.name || "", item.tag || "", item.type || "");
            return (
            <div key={`${item.row}-${idx}`} className="flex flex-col gap-3 py-4 px-4 hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors">
              <div className="flex items-start">
                <div className="flex items-center justify-center p-1.5 rounded-lg bg-indigo-50 dark:bg-indigo-500/10 text-indigo-500 dark:text-indigo-400 shrink-0 mr-2">
                  <ItemIcon className="w-4 h-4" />
                </div>
                <input
                  type="text"
                  value={item.name}
                  onChange={(e) => handleNameChange(idx, e.target.value)}
                  placeholder="Item Name"
                  className={cn(
                    "flex-1 text-base font-semibold text-slate-900 dark:text-white bg-transparent border-none outline-none focus:ring-1 focus:ring-indigo-300 dark:focus:ring-indigo-500 rounded px-1 -ml-1 min-w-0",
                    modifiedRows.has(item.row) && "text-indigo-900 dark:text-indigo-300"
                  )}
                />
                <button
                  onClick={() => handleDelete(idx)}
                  className="p-1.5 text-slate-400 dark:text-slate-500 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-500/10 rounded-lg transition-colors ml-2 shrink-0"
                  title="Remove default item"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
              <div className="flex items-center gap-2">
                <TagInput 
                  value={item.tag} 
                  onChange={(val) => handleTagChange(idx, val)} 
                  isActive={modifiedRows.has(item.row)}
                  existingTags={existingTags}
                  customTags={customDropdowns.tags}
                  onAddCustom={handleAddCustomTag}
                />
                <TypeInput 
                  value={item.type} 
                  tagValue={(item.tag || "Other").trim()} 
                  onChange={(val) => handleTypeChange(idx, val)} 
                  isActive={modifiedRows.has(item.row)}
                  existingTypes={existingTypesByTag[(item.tag || "Other").trim()] || []}
                  customTypes={customDropdowns.typesByTag[(item.tag || "Other").trim()] || []}
                  onAddCustom={handleAddCustomType}
                />
              </div>
            </div>
          )})
        )}
      </div>

      {itemToDelete !== null && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-sm">
          <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-xl max-w-sm w-full overflow-hidden animate-in fade-in zoom-in-95 duration-200">
            <div className="p-6">
              <div className="flex items-center gap-3 text-red-600 mb-2">
                <AlertCircle className="w-6 h-6" />
                <h3 className="font-bold text-lg text-slate-900 dark:text-white">Remove Default Item</h3>
              </div>
              <p className="text-slate-600 dark:text-slate-300 mb-6 mt-2">
                Are you sure you want to remove <span className="font-semibold text-slate-900 dark:text-white">{items[itemToDelete]?.name}</span>? You must click 'Save Changes' to finalize this change.
              </p>
              <div className="flex justify-end gap-3">
                <button
                  onClick={cancelDelete}
                  className="px-4 py-2 font-semibold text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700 rounded-xl transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={confirmDelete}
                  className="px-4 py-2 font-bold text-white bg-red-500 hover:bg-red-600 rounded-xl transition-colors shadow-sm shadow-red-200"
                >
                  Remove
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
