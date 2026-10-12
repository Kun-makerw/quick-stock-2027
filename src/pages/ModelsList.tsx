import React, { useState, useEffect, useRef } from 'react';
import { Tag, Plus, X, ArrowLeft, ChevronDown, Trash2 } from 'lucide-react';
import { Link } from 'react-router-dom';
import { getCustomDropdowns, updateAllDropdowns, CustomDropdowns, getMergedCustomDropdowns, updateMergedAllDropdowns } from '../lib/dropdowns';
import { FluidSpinner } from '../components/FluidSpinner';

const DEFAULT_DEVICE_TYPES = ['Computer', 'Peripheral', 'Accessory', 'Cable', 'TV', 'Interactive', 'Other'];

export function ModelsList() {
  const [dropdowns, setDropdowns] = useState<CustomDropdowns>({ tags: [], typesByTag: {} });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [newTag, setNewTag] = useState('');
  const [selectedType, setSelectedType] = useState('Computer');
  
  const [isAddingNewType, setIsAddingNewType] = useState(false);
  const [newCustomType, setNewCustomType] = useState('');
  
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  
    const classesSheetId = localStorage.getItem('quickStock_classesSheetId') || '';
  const stockSheetId = localStorage.getItem('quickStock_classesSheetId') || '';

  const DEVICE_TYPES = Array.from(new Set([...DEFAULT_DEVICE_TYPES, ...dropdowns.tags])).sort((a,b) => a.localeCompare(b));

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsDropdownOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  useEffect(() => {
    loadData();
  }, [classesSheetId, stockSheetId]);
  
  const loadData = async () => {
    if (!classesSheetId) {
      setLoading(false);
      return;
    }
    setLoading(true);
    try {
      const cd = await getMergedCustomDropdowns();
      setDropdowns(cd);
    } catch(e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };
  
  const handleSaveDropdowns = async (newDropdowns: CustomDropdowns) => {
    setDropdowns(newDropdowns);
    if (!classesSheetId) return;
    setSaving(true);
    try {
      await updateMergedAllDropdowns(newDropdowns);
    } catch (e) {
      console.error("Failed to save", e);
    } finally {
      setSaving(false);
    }
  };

  const handleAdd = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTag.trim()) return;
    const trimmed = newTag.trim();
    
    const newDropdowns = { ...dropdowns };
    if (!newDropdowns.typesByTag[selectedType]) {
      newDropdowns.typesByTag[selectedType] = [];
    }
    if (!newDropdowns.typesByTag[selectedType].includes(trimmed)) {
      newDropdowns.typesByTag[selectedType] = [...newDropdowns.typesByTag[selectedType], trimmed];
      handleSaveDropdowns(newDropdowns);
    }
    setNewTag('');
  };

  const handleRemove = (parentTag: string, typeToRemove: string) => {
    const newDropdowns = { ...dropdowns };
    if (newDropdowns.typesByTag[parentTag]) {
      newDropdowns.typesByTag[parentTag] = newDropdowns.typesByTag[parentTag].filter(t => t !== typeToRemove);
      handleSaveDropdowns(newDropdowns);
    }
  };

  const handleSaveNewCustomType = () => {
    setIsAddingNewType(false);
    if (newCustomType && newCustomType.trim() !== '') {
      const trimmed = newCustomType.trim();
      const newDropdowns = { ...dropdowns };
      if (!newDropdowns.tags.includes(trimmed) && !DEFAULT_DEVICE_TYPES.includes(trimmed)) {
        newDropdowns.tags = [...newDropdowns.tags, trimmed];
        handleSaveDropdowns(newDropdowns);
      }
      setSelectedType(trimmed);
      setNewCustomType('');
    } else {
      setSelectedType(DEVICE_TYPES[0] || 'Computer');
    }
  };

  const handleDeleteCustomType = (typeToDelete: string, e: React.MouseEvent) => {
    e.stopPropagation();
    const newDropdowns = { ...dropdowns };
    newDropdowns.tags = newDropdowns.tags.filter(t => t !== typeToDelete);
    // optionally remove all types for this tag
    delete newDropdowns.typesByTag[typeToDelete];
    handleSaveDropdowns(newDropdowns);
    
    if (selectedType === typeToDelete) {
      setSelectedType(DEFAULT_DEVICE_TYPES[0]);
    }
  };

  const totalTags = Object.values(dropdowns.typesByTag).reduce((acc: number, curr) => acc + (Array.isArray(curr) ? curr.length : 0), 0);

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center p-12">
        <FluidSpinner size="md" />
        <p className="text-slate-500 font-medium">Loading types...</p>
      </div>
    );
  }

  return (
    <div className="space-y-6 max-w-3xl mx-auto">
      <div className="flex items-center gap-4">
        <Link 
          to="/"
          className="p-2.5 rounded-full text-slate-400 hover:text-indigo-600 hover:bg-indigo-50 dark:hover:bg-indigo-500/10 transition-colors dark:text-indigo-400 bg-white/60 backdrop-blur-md border border-white/40 shadow-sm"
        >
          <ArrowLeft className="w-5 h-5" />
        </Link>
        <div>
          <h1 className="text-3xl font-bold text-slate-900 dark:text-white tracking-tight">Types</h1>
          <p className="text-slate-500 font-medium mt-1">Manage options for the Type dropdown based on device tag.</p>
        </div>
        {saving && <span className="ml-auto text-xs text-slate-500 font-medium bg-slate-100 dark:bg-slate-800 px-3 py-1 rounded-full flex items-center gap-2"><FluidSpinner size="sm"/> Saving...</span>}
      </div>

      <div className="bg-white/70 dark:bg-slate-900/60 backdrop-blur-2xl rounded-[32px] border border-white/60 dark:border-white/10 shadow-[0_8px_32px_rgba(0,0,0,0.04)] overflow-hidden p-6">
        <form onSubmit={handleAdd} className="mb-8">
          <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
            Add New Type
          </label>
          <div className="flex flex-col sm:flex-row gap-3">
            {isAddingNewType ? (
              <input
                autoFocus
                type="text"
                value={newCustomType}
                onChange={(e) => setNewCustomType(e.target.value)}
                onBlur={handleSaveNewCustomType}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') handleSaveNewCustomType();
                }}
                className="px-4 py-3 bg-white dark:bg-slate-800 border border-indigo-300 text-indigo-900 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition-all w-full sm:w-48 dark:text-white dark:bg-slate-800 dark:border-indigo-500/50"
                placeholder="Type custom tag..."
              />
            ) : (
              <div className="relative w-full sm:w-56" ref={dropdownRef}>
                <div 
                  className="px-4 py-3 bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700/50 rounded-xl outline-none transition-all cursor-pointer flex items-center justify-between hover:bg-slate-100 dark:bg-slate-800"
                  onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                >
                  <span className="truncate pr-2">{selectedType}</span>
                  <ChevronDown className={`w-4 h-4 text-slate-500 transition-transform ${isDropdownOpen ? 'rotate-180' : ''}`} />
                </div>
                
                {isDropdownOpen && (
                  <div className="absolute z-10 w-full mt-2 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700/50 rounded-xl shadow-lg overflow-hidden flex flex-col py-1">
                    <div className="max-h-60 overflow-y-auto">
                      {DEVICE_TYPES.map(t => (
                        <div 
                          key={t}
                          className={`px-4 py-2.5 cursor-pointer flex items-center justify-between group hover:bg-slate-50 dark:hover:bg-slate-800 dark:bg-slate-800/50 ${selectedType === t ? 'bg-indigo-50/50 text-indigo-700 font-medium' : 'text-slate-700 dark:text-slate-300'}`}
                          onClick={() => {
                            setSelectedType(t);
                            setIsDropdownOpen(false);
                          }}
                        >
                          <span className="truncate">{t}</span>
                          {!DEFAULT_DEVICE_TYPES.includes(t) && (
                            <button
                              type="button"
                              onClick={(e) => handleDeleteCustomType(t, e)}
                              className="text-slate-300 hover:text-red-500 opacity-0 group-hover:opacity-100 transition-opacity"
                              title="Delete type"
                            >
                              <X className="w-4 h-4" />
                            </button>
                          )}
                        </div>
                      ))}
                    </div>
                    <div className="border-t border-slate-100 dark:border-slate-700/30 mt-1 pt-1">
                      <div 
                        className="px-4 py-2.5 cursor-pointer text-indigo-600 font-bold hover:bg-indigo-50 dark:hover:bg-indigo-500/10 transition-colors dark:text-indigo-400"
                        onClick={() => {
                          setIsDropdownOpen(false);
                          setIsAddingNewType(true);
                          setNewCustomType('');
                        }}
                      >
                        + Type Custom Tag...
                      </div>
                    </div>
                  </div>
                )}
              </div>
            )}

            <input
              type="text"
              value={newTag}
              onChange={(e) => setNewTag(e.target.value)}
              className="flex-1 px-4 py-3 bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700/50 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition-all dark:text-white dark:placeholder-slate-400"
              placeholder="e.g. Keyboard"
            />
            <button
              type="submit"
              disabled={!newTag.trim() || saving}
              className="px-6 py-3 bg-indigo-600 text-white hover:bg-indigo-700 font-bold rounded-xl transition-colors flex items-center justify-center gap-2 disabled:opacity-50"
            >
              <Plus className="w-5 h-5" />
              Add
            </button>
          </div>
        </form>

        <div>
          <h3 className="text-sm font-bold uppercase tracking-widest text-slate-400 mb-4">Custom Types ({totalTags})</h3>
          
          {totalTags === 0 ? (
            <div className="text-center py-10 bg-slate-50 dark:bg-slate-800/50 rounded-2xl border border-slate-200 dark:border-slate-700/50 border-dashed">
              <Tag className="w-10 h-10 text-slate-300 mx-auto mb-2" />
              <p className="text-slate-500 text-sm">No custom types added yet.</p>
            </div>
          ) : (
            <div className="space-y-6">
              {Array.from(new Set([...DEVICE_TYPES, ...Object.keys(dropdowns.typesByTag)])).map(type => {
                const typeTags = dropdowns.typesByTag[type] || [];
                if (typeTags.length === 0) return null;
                
                return (
                  <div key={type}>
                    <h4 className="text-xs font-bold uppercase text-slate-500 mb-3">{type}</h4>
                    <div className="grid gap-3 sm:grid-cols-2 md:grid-cols-3">
                      {typeTags.map(tag => (
                        <div key={tag} className="flex items-center justify-between bg-slate-50 dark:bg-slate-800/50 px-4 py-3 rounded-xl border border-slate-100 dark:border-slate-700/30 group hover:border-indigo-200 dark:hover:border-indigo-500/30 hover:bg-indigo-50/50 dark:hover:bg-indigo-500/10 transition-colors">
                          <span className="text-sm font-semibold text-slate-800 dark:text-slate-200">{tag}</span>
                          <button
                            onClick={() => handleRemove(type, tag)}
                            disabled={saving}
                            className="text-slate-400 hover:text-red-500 opacity-0 group-hover:opacity-100 transition-all disabled:opacity-50"
                            title="Remove"
                          >
                            <X className="w-4 h-4" />
                          </button>
                        </div>
                      ))}
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
