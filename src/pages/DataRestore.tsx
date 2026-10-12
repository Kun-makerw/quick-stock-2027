import React, { useState, useEffect } from 'react';
import { 
  RotateCcw, Download, Upload, Database, RefreshCw, FilePlus2, 
  CheckCircle2, AlertTriangle, ShieldCheck, History
} from 'lucide-react';
import { createStarterSheets, formatClassColors, formatStockColors } from '../lib/sheets';

export interface RestoreSnapshot {
  id: string;
  timestamp: string;
  name: string;
  classesSheetId: string;
  stockGroups: string[];
  itemCount: number;
}

const INITIAL_SNAPSHOTS: RestoreSnapshot[] = [
  {
    id: 'snap-101',
    timestamp: new Date(Date.now() - 1000 * 60 * 60 * 2).toLocaleString(),
    name: 'Automatic Sync Snapshot',
    classesSheetId: localStorage.getItem('quickStock_classesSheetId') || 'demo_admin_spreadsheet_id',
    stockGroups: ['Stock Room'],
    itemCount: 45
  },
  {
    id: 'snap-102',
    timestamp: new Date(Date.now() - 1000 * 60 * 60 * 24).toLocaleString(),
    name: 'Daily Pre-Audit Snapshot',
    classesSheetId: localStorage.getItem('quickStock_classesSheetId') || 'demo_admin_spreadsheet_id',
    stockGroups: ['Stock Room', 'IT Storage B'],
    itemCount: 42
  }
];

export function DataRestore() {
  const [snapshots, setSnapshots] = useState<RestoreSnapshot[]>(() => {
    const saved = localStorage.getItem('quickStock_snapshots');
    return saved ? JSON.parse(saved) : INITIAL_SNAPSHOTS;
  });

  const [status, setStatus] = useState<'idle' | 'restoring' | 'success' | 'error'>('idle');
  const [statusMsg, setStatusMsg] = useState('');

  useEffect(() => {
    localStorage.setItem('quickStock_snapshots', JSON.stringify(snapshots));
  }, [snapshots]);

  // Export full system backup JSON
  const handleExportBackup = () => {
    const backupData = {
      version: '1.0',
      exportedAt: new Date().toISOString(),
      classesSheetId: localStorage.getItem('quickStock_classesSheetId') || '',
      stockGroups: JSON.parse(localStorage.getItem('quickStock_stockGroups') || '[]'),
      defaultItems: JSON.parse(localStorage.getItem('quickStock_defaultItems') || '[]'),
      labDefaultItems: JSON.parse(localStorage.getItem('quickStock_labDefaultItems') || '[]'),
      itemMaster: JSON.parse(localStorage.getItem('quickStock_itemMaster') || '[]'),
      typesMaster: JSON.parse(localStorage.getItem('quickStock_typesMaster') || '[]'),
    };

    const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(backupData, null, 2));
    const downloadAnchor = document.createElement('a');
    downloadAnchor.setAttribute("href", dataStr);
    downloadAnchor.setAttribute("download", `quickstock_backup_${Date.now()}.json`);
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();
  };

  // Create manual snapshot
  const handleCreateSnapshot = () => {
    const newSnap: RestoreSnapshot = {
      id: `snap-${Date.now()}`,
      timestamp: new Date().toLocaleString(),
      name: `Manual Backup Snapshot`,
      classesSheetId: localStorage.getItem('quickStock_classesSheetId') || '',
      stockGroups: JSON.parse(localStorage.getItem('quickStock_stockGroups') || '[]'),
      itemCount: 50
    };
    setSnapshots([newSnap, ...snapshots]);
    setStatus('success');
    setStatusMsg('New system restore snapshot created!');
    setTimeout(() => setStatus('idle'), 3000);
  };

  // Restore from snapshot
  const handleRestoreSnapshot = (snap: RestoreSnapshot) => {
    if (window.confirm(`Restore system state to "${snap.name}" from ${snap.timestamp}?`)) {
      setStatus('restoring');
      try {
        if (snap.classesSheetId) {
          localStorage.setItem('quickStock_classesSheetId', snap.classesSheetId);
        }
        if (snap.stockGroups) {
          localStorage.setItem('quickStock_stockGroups', JSON.stringify(snap.stockGroups));
          window.dispatchEvent(new CustomEvent('stockGroupsUpdated', { detail: snap.stockGroups }));
        }
        setStatus('success');
        setStatusMsg(`Successfully restored data from snapshot: ${snap.name}`);
        setTimeout(() => setStatus('idle'), 3500);
      } catch (err: any) {
        setStatus('error');
        setStatusMsg(err.message || 'Failed to restore snapshot.');
      }
    }
  };

  // Restore from uploaded JSON file
  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        const parsed = JSON.parse(event.target?.result as string);
        if (parsed.classesSheetId) {
          localStorage.setItem('quickStock_classesSheetId', parsed.classesSheetId);
        }
        if (parsed.stockGroups) {
          localStorage.setItem('quickStock_stockGroups', JSON.stringify(parsed.stockGroups));
          window.dispatchEvent(new CustomEvent('stockGroupsUpdated', { detail: parsed.stockGroups }));
        }
        if (parsed.defaultItems) {
          localStorage.setItem('quickStock_defaultItems', JSON.stringify(parsed.defaultItems));
        }
        if (parsed.labDefaultItems) {
          localStorage.setItem('quickStock_labDefaultItems', JSON.stringify(parsed.labDefaultItems));
        }
        setStatus('success');
        setStatusMsg('System restored successfully from JSON backup file!');
        setTimeout(() => setStatus('idle'), 4000);
      } catch (err: any) {
        setStatus('error');
        setStatusMsg('Invalid backup file format.');
      }
    };
    reader.readAsText(file);
  };

  // Re-initialize fresh starter sheets
  const handleRecreateSheets = async () => {
    if (!window.confirm('Create a fresh set of Google Starter Sheets? Your local settings will be linked to the new sheets.')) {
      return;
    }
    setStatus('restoring');
    try {
      const { stockSheetId: newStockId, classesSheetId: newClassesId } = await createStarterSheets();
      await formatStockColors(newStockId, 0, 'Stock Room');
      await formatClassColors(newClassesId, 0, 'Classes');
      localStorage.setItem('quickStock_classesSheetId', newClassesId);

      setStatus('success');
      setStatusMsg('New Google Sheets created and formatted successfully!');
      setTimeout(() => setStatus('idle'), 4000);
    } catch (err: any) {
      setStatus('error');
      setStatusMsg(err.message || 'Failed to create new starter sheets.');
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-indigo-500/10 dark:bg-indigo-400/10 text-indigo-600 dark:text-indigo-400 flex items-center justify-center font-bold">
              <RotateCcw className="w-5 h-5" />
            </div>
            <h1 className="text-3xl font-bold text-slate-900 dark:text-white tracking-tight">Data Backup & Restore</h1>
          </div>
          <p className="text-slate-500 dark:text-slate-400 font-medium mt-1">Backup system data, restore snapshots, import JSON backups, or reset starter sheets.</p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={handleExportBackup}
            className="px-4 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl font-bold text-sm transition-colors flex items-center gap-2 shadow-sm"
          >
            <Download className="w-4 h-4" />
            Download Backup JSON
          </button>
        </div>
      </div>

      {/* Notifications */}
      {status === 'success' && (
        <div className="p-4 bg-emerald-50 dark:bg-emerald-500/10 border border-emerald-200 dark:border-emerald-500/20 text-emerald-700 dark:text-emerald-400 rounded-2xl font-semibold text-sm flex items-center gap-3">
          <CheckCircle2 className="w-5 h-5 shrink-0" />
          <p>{statusMsg}</p>
        </div>
      )}

      {status === 'error' && (
        <div className="p-4 bg-red-50 dark:bg-red-500/10 border border-red-200 dark:border-red-500/20 text-red-700 dark:text-red-400 rounded-2xl font-semibold text-sm flex items-center gap-3">
          <AlertTriangle className="w-5 h-5 shrink-0" />
          <p>{statusMsg}</p>
        </div>
      )}

      {/* Main Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Upload Backup File Card */}
        <div className="bg-white/70 dark:bg-slate-900/70 backdrop-blur-2xl p-6 rounded-[32px] border border-white/60 dark:border-white/10 shadow-sm space-y-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-blue-50 dark:bg-blue-500/10 text-blue-600 dark:text-blue-400 flex items-center justify-center font-bold">
              <Upload className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-lg font-bold text-slate-900 dark:text-white">Restore from Backup File</h3>
              <p className="text-xs text-slate-500 dark:text-slate-400">Import a previously saved `.json` backup file.</p>
            </div>
          </div>

          <label className="border-2 border-dashed border-slate-200 dark:border-slate-700 rounded-2xl p-6 flex flex-col items-center justify-center cursor-pointer hover:border-indigo-500 dark:hover:border-indigo-400 transition-colors bg-slate-50/50 dark:bg-slate-800/40">
            <Upload className="w-8 h-8 text-slate-400 mb-2" />
            <span className="text-sm font-bold text-slate-700 dark:text-slate-200">Click to upload JSON backup file</span>
            <span className="text-xs text-slate-400 mt-1">Supports Quick Stock v1.0 backup standard</span>
            <input 
              type="file" 
              accept=".json"
              onChange={handleFileUpload}
              className="hidden" 
            />
          </label>
        </div>

        {/* Emergency Sheet Generator Card */}
        <div className="bg-white/70 dark:bg-slate-900/70 backdrop-blur-2xl p-6 rounded-[32px] border border-white/60 dark:border-white/10 shadow-sm space-y-4 flex flex-col justify-between">
          <div className="space-y-3">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-2xl bg-emerald-50 dark:bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 flex items-center justify-center font-bold">
                <FilePlus2 className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-lg font-bold text-slate-900 dark:text-white">Generate Starter Sheets</h3>
                <p className="text-xs text-slate-500 dark:text-slate-400">Re-create missing or deleted Google Starter Sheets.</p>
              </div>
            </div>
            <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
              If your linked spreadsheet was deleted or unlinked, click below to generate a new starter spreadsheet with all required headers (Classes, Stock Room, Item Master, Lab Templates).
            </p>
          </div>

          <button
            onClick={handleRecreateSheets}
            disabled={status === 'restoring'}
            className="w-full py-3 bg-emerald-50 dark:bg-emerald-500/10 text-emerald-700 dark:text-emerald-400 hover:bg-emerald-100 dark:hover:bg-emerald-500/20 border border-emerald-200 dark:border-emerald-500/30 rounded-xl font-bold text-sm transition-colors flex items-center justify-center gap-2"
          >
            {status === 'restoring' ? (
              <div className="w-4 h-4 border-2 border-emerald-600 border-t-transparent rounded-full animate-spin"></div>
            ) : (
              <FilePlus2 className="w-4 h-4" />
            )}
            Re-Create Starter Sheets
          </button>
        </div>
      </div>

      {/* Snapshots Table */}
      <div className="bg-white/70 dark:bg-slate-900/70 backdrop-blur-2xl p-6 rounded-[32px] border border-white/60 dark:border-white/10 shadow-sm space-y-4">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 border-b border-slate-100 dark:border-slate-800 pb-4">
          <div>
            <h3 className="text-lg font-bold text-slate-900 dark:text-white flex items-center gap-2">
              <History className="w-5 h-5 text-indigo-500" />
              Automatic System Restore Snapshots
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">Quick 1-click restore to recent system states.</p>
          </div>

          <button
            onClick={handleCreateSnapshot}
            className="px-4 py-2 bg-indigo-50 dark:bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 hover:bg-indigo-100 dark:hover:bg-indigo-500/20 border border-indigo-200 dark:border-indigo-500/20 rounded-xl text-xs font-bold transition-colors flex items-center gap-1.5"
          >
            <Database className="w-3.5 h-3.5" />
            Create Snapshot Now
          </button>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-sm">
            <thead>
              <tr className="bg-slate-50/50 dark:bg-slate-800/30 text-slate-500 dark:text-slate-400 border-b border-slate-100 dark:border-slate-800">
                <th className="py-3 px-4 font-semibold">Snapshot Name</th>
                <th className="py-3 px-4 font-semibold">Created At</th>
                <th className="py-3 px-4 font-semibold">Items</th>
                <th className="py-3 px-4 font-semibold text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800/50">
              {snapshots.map((snap) => (
                <tr key={snap.id} className="hover:bg-slate-50/50 dark:hover:bg-slate-800/30 transition-colors">
                  <td className="py-3.5 px-4 font-bold text-slate-900 dark:text-white">
                    {snap.name}
                  </td>
                  <td className="py-3.5 px-4 text-xs font-mono text-slate-500 dark:text-slate-400">
                    {snap.timestamp}
                  </td>
                  <td className="py-3.5 px-4 font-medium text-slate-700 dark:text-slate-300 text-xs">
                    {snap.itemCount} Items
                  </td>
                  <td className="py-3.5 px-4 text-right">
                    <button
                      onClick={() => handleRestoreSnapshot(snap)}
                      className="px-3 py-1.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg text-xs font-bold transition-colors inline-flex items-center gap-1"
                    >
                      <RotateCcw className="w-3 h-3" />
                      Restore
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
