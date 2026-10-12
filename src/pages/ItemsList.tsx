import React, { useState, useEffect } from 'react';
import { Plus, X, ArrowLeft, Trash2, Package } from 'lucide-react';
import { Link } from 'react-router-dom';
import { getMasterItems, addMasterItem, removeMasterItem, ensureItemMasterSheetExists } from '../lib/sheets';
import { FluidSpinner } from '../components/FluidSpinner';

export function ItemsList() {
  const [items, setItems] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [newItemName, setNewItemName] = useState('');
  
  const classesSheetId = localStorage.getItem('quickStock_classesSheetId') || '';

  useEffect(() => {
    loadData();
  }, [classesSheetId]);
  
  const loadData = async () => {
    if (!classesSheetId) {
      setLoading(false);
      return;
    }
    setLoading(true);
    try {
      await ensureItemMasterSheetExists(classesSheetId);
      const masterItems = await getMasterItems(classesSheetId, 'Item Master');
      setItems(Array.from(new Set(masterItems.filter(i => i && i.toLowerCase() !== 'item name'))).sort((a,b) => a.localeCompare(b)));
    } catch(e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };
  
  const handleAdd = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newItemName.trim() || !classesSheetId) return;
    
    const trimmed = newItemName.trim();
    if (items.some(i => i.toLowerCase() === trimmed.toLowerCase())) {
      setNewItemName('');
      return;
    }
    
    setSaving(true);
    try {
      await addMasterItem(classesSheetId, trimmed);
      setItems(prev => [...prev, trimmed].sort((a,b) => a.localeCompare(b)));
      setNewItemName('');
    } catch (e) {
      console.error("Failed to add item", e);
    } finally {
      setSaving(false);
    }
  };

  const handleRemove = async (itemToRemove: string) => {
    if (!classesSheetId) return;
    setSaving(true);
    try {
      await removeMasterItem(classesSheetId, itemToRemove);
      setItems(prev => prev.filter(i => i !== itemToRemove));
    } catch (e) {
      console.error("Failed to remove item", e);
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center p-12">
        <FluidSpinner size="md" />
        <p className="text-slate-500 font-medium">Loading items...</p>
      </div>
    );
  }

  return (
    <div className="space-y-6 max-w-3xl mx-auto">
      <div className="flex items-center gap-4">
        <Link 
          to="/"
          className="p-2.5 rounded-full text-slate-400 hover:text-indigo-600 hover:bg-indigo-50 dark:hover:bg-indigo-500/10 transition-colors bg-white/60 dark:bg-slate-800/60 backdrop-blur-md border border-white/40 dark:border-white/10 shadow-sm"
        >
          <ArrowLeft className="w-5 h-5" />
        </Link>
        <div>
          <h1 className="text-3xl font-bold text-slate-900 dark:text-white tracking-tight">Item Names</h1>
          <p className="text-slate-500 font-medium mt-1">Manage global item names available in dropdowns.</p>
        </div>
        {saving && <span className="ml-auto text-xs text-slate-500 font-medium bg-slate-100 dark:bg-slate-800 px-3 py-1 rounded-full flex items-center gap-2"><FluidSpinner size="sm"/> Saving...</span>}
      </div>

      <div className="bg-white/70 dark:bg-slate-900/60 backdrop-blur-2xl rounded-[32px] border border-white/60 dark:border-white/10 shadow-[0_8px_32px_rgba(0,0,0,0.04)] overflow-hidden p-6">
        <form onSubmit={handleAdd} className="mb-8">
          <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
            Add New Item Name
          </label>
          <div className="flex flex-col sm:flex-row gap-3">
            <input
              type="text"
              value={newItemName}
              onChange={(e) => setNewItemName(e.target.value)}
              className="flex-1 px-4 py-3 bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700/50 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition-all dark:text-white dark:placeholder-slate-400"
              placeholder="e.g. HDMI Cable (2m)"
            />
            <button
              type="submit"
              disabled={!newItemName.trim() || saving}
              className="px-6 py-3 bg-indigo-600 text-white hover:bg-indigo-700 font-bold rounded-xl transition-colors flex items-center justify-center gap-2 disabled:opacity-50"
            >
              <Plus className="w-5 h-5" />
              Add
            </button>
          </div>
        </form>

        <div>
          <h3 className="text-sm font-bold uppercase tracking-widest text-slate-400 mb-4">All Items ({items.length})</h3>
          
          {items.length === 0 ? (
            <div className="text-center py-10 bg-slate-50 dark:bg-slate-800/50 rounded-2xl border border-slate-200 dark:border-slate-700/50 border-dashed">
              <Package className="w-10 h-10 text-slate-300 mx-auto mb-2" />
              <p className="text-slate-500 text-sm">No items found.</p>
            </div>
          ) : (
            <div className="grid gap-3 sm:grid-cols-2">
              {items.map((item, index) => (
                <div key={`${item}-${index}`} className="flex items-center justify-between bg-slate-50 dark:bg-slate-800/50 px-4 py-3 rounded-xl border border-slate-100 dark:border-slate-700/30 group hover:border-indigo-200 dark:hover:border-indigo-500/30 hover:bg-indigo-50/50 dark:hover:bg-indigo-500/10 transition-colors">
                  <span className="text-sm font-semibold text-slate-800 dark:text-slate-200 truncate pr-2">{item}</span>
                  <button
                    onClick={() => handleRemove(item)}
                    disabled={saving}
                    className="text-slate-400 hover:text-red-500 opacity-0 group-hover:opacity-100 transition-all disabled:opacity-50 shrink-0"
                    title="Remove item"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
