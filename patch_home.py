import sys

new_home_content = """import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Layers, ChevronRight, Tag, LayoutTemplate, CheckCircle2, Activity, Box, Folder, AlertCircle } from 'lucide-react';
import { getDashboardSummary, DashboardSummary } from '../lib/sheets';
import { getItemIcon } from "../lib/utils";

export function Home() {
  const [summary, setSummary] = useState<DashboardSummary | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchSummary = async () => {
      try {
        const sheetId = localStorage.getItem('quickStock_classesSheetId');
        if (sheetId) {
          const data = await getDashboardSummary(sheetId);
          setSummary(data);
        } else {
          setError('Spreadsheet ID is not configured. Please go to Settings.');
        }
      } catch (err: any) {
        console.error("Failed to load inventory summary", err);
        setError(err.message || 'Failed to load inventory summary');
      } finally {
        setLoading(false);
      }
    };

    fetchSummary();
  }, []);

  const totalGlobalItems = summary ? (summary.classes.totalItems + summary.stock.totalItems) : 0;
  const totalGlobalChecked = summary ? (summary.classes.checkedItems + summary.stock.checkedItems) : 0;

  return (
    <div className="flex flex-col gap-8 max-w-6xl mx-auto pb-12">
      <div>
        <h1 className="text-3xl font-bold text-slate-900 dark:text-white tracking-tight">Inventory Control Dashboard</h1>
        <p className="text-slate-500 dark:text-slate-400 font-medium mt-1">High-level overview of all your assets and locations.</p>
      </div>

      {loading ? (
        <div className="p-12 text-center text-slate-500 font-medium animate-pulse bg-white/70 dark:bg-slate-900/70 backdrop-blur-2xl rounded-[32px] border border-white/60 dark:border-white/10 shadow-sm">Loading summary...</div>
      ) : error ? (
        <div className="p-12 text-center text-red-500 font-medium bg-red-50 dark:bg-red-500/10 rounded-[32px] border border-red-200 dark:border-red-500/30">{error}</div>
      ) : !summary ? null : (
        <>
          {/* Top Level Stats */}
          <div className="grid gap-6 md:grid-cols-3">
            <div className="bg-white/70 dark:bg-slate-900/70 backdrop-blur-2xl rounded-[24px] border border-white/60 dark:border-white/10 shadow-[0_8px_32px_rgba(0,0,0,0.04)] p-6 flex flex-col justify-between hover:shadow-md transition-shadow">
              <div className="flex items-start justify-between mb-4">
                <div className="w-12 h-12 rounded-[16px] bg-slate-900 dark:bg-white flex items-center justify-center shrink-0 text-white dark:text-slate-900">
                  <Activity className="w-6 h-6" strokeWidth={2} />
                </div>
                <span className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-widest bg-slate-100 dark:bg-slate-800 px-3 py-1 rounded-full">Global</span>
              </div>
              <div>
                <p className="text-slate-500 dark:text-slate-400 font-medium text-sm mb-1">Total Assets Tracked</p>
                <div className="flex items-baseline gap-2">
                  <span className="text-4xl font-bold text-slate-900 dark:text-white tracking-tight">{totalGlobalItems}</span>
                  <span className="text-sm font-semibold text-slate-400 dark:text-slate-500">items</span>
                </div>
                <p className="text-xs text-slate-400 dark:text-slate-500 mt-2 flex items-center gap-1"><CheckCircle2 className="w-3 h-3 text-emerald-500" /> {totalGlobalChecked} verified</p>
              </div>
            </div>

            <div className="bg-white/70 dark:bg-slate-900/70 backdrop-blur-2xl rounded-[24px] border border-white/60 dark:border-white/10 shadow-[0_8px_32px_rgba(0,0,0,0.04)] p-6 flex flex-col justify-between hover:shadow-md transition-shadow relative overflow-hidden group">
              <Link to="/classes" className="absolute inset-0 z-10" />
              <div className="flex items-start justify-between mb-4 relative z-0">
                <div className="w-12 h-12 rounded-[16px] bg-indigo-50 dark:bg-indigo-500/10 flex items-center justify-center shrink-0 text-indigo-600 dark:text-indigo-400 group-hover:scale-110 transition-transform">
                  <Folder className="w-6 h-6" strokeWidth={2} />
                </div>
                <ChevronRight className="w-5 h-5 text-slate-300 dark:text-slate-600 group-hover:text-indigo-500 transition-colors" />
              </div>
              <div className="relative z-0">
                <p className="text-slate-500 dark:text-slate-400 font-medium text-sm mb-1">Deployed in Classes</p>
                <div className="flex items-baseline gap-2">
                  <span className="text-4xl font-bold text-slate-900 dark:text-white tracking-tight">{summary.classes.totalItems}</span>
                  <span className="text-sm font-semibold text-slate-400 dark:text-slate-500">items</span>
                </div>
                <div className="w-full bg-slate-100 dark:bg-slate-800 h-1.5 rounded-full mt-3 overflow-hidden">
                  <div className="bg-indigo-500 h-full rounded-full" style={{ width: `${totalGlobalItems > 0 ? (summary.classes.totalItems / totalGlobalItems) * 100 : 0}%` }}></div>
                </div>
              </div>
            </div>

            <div className="bg-white/70 dark:bg-slate-900/70 backdrop-blur-2xl rounded-[24px] border border-white/60 dark:border-white/10 shadow-[0_8px_32px_rgba(0,0,0,0.04)] p-6 flex flex-col justify-between hover:shadow-md transition-shadow relative overflow-hidden group">
              <Link to="/stock-room" className="absolute inset-0 z-10" />
              <div className="flex items-start justify-between mb-4 relative z-0">
                <div className="w-12 h-12 rounded-[16px] bg-emerald-50 dark:bg-emerald-500/10 flex items-center justify-center shrink-0 text-emerald-600 dark:text-emerald-400 group-hover:scale-110 transition-transform">
                  <Box className="w-6 h-6" strokeWidth={2} />
                </div>
                <ChevronRight className="w-5 h-5 text-slate-300 dark:text-slate-600 group-hover:text-emerald-500 transition-colors" />
              </div>
              <div className="relative z-0">
                <p className="text-slate-500 dark:text-slate-400 font-medium text-sm mb-1">In Stock Rooms</p>
                <div className="flex items-baseline gap-2">
                  <span className="text-4xl font-bold text-slate-900 dark:text-white tracking-tight">{summary.stock.totalItems}</span>
                  <span className="text-sm font-semibold text-slate-400 dark:text-slate-500">items</span>
                </div>
                <div className="w-full bg-slate-100 dark:bg-slate-800 h-1.5 rounded-full mt-3 overflow-hidden">
                  <div className="bg-emerald-500 h-full rounded-full" style={{ width: `${totalGlobalItems > 0 ? (summary.stock.totalItems / totalGlobalItems) * 100 : 0}%` }}></div>
                </div>
              </div>
            </div>
          </div>

          <div className="grid gap-6 lg:grid-cols-3">
            {/* Tag Breakdown */}
            <div className="lg:col-span-1 bg-white/70 dark:bg-slate-900/70 backdrop-blur-2xl rounded-[32px] border border-white/60 dark:border-white/10 shadow-[0_8px_32px_rgba(0,0,0,0.04)] p-6 flex flex-col">
              <h3 className="text-lg font-bold text-slate-900 dark:text-white flex items-center gap-2 mb-6">
                <Tag className="w-5 h-5 text-slate-400" />
                Distribution by Category
              </h3>
              <div className="flex-1 space-y-4">
                {summary.tags.length === 0 ? (
                  <p className="text-slate-500 text-sm text-center py-4">No categories found.</p>
                ) : (
                  summary.tags.slice(0, 8).map((tag, idx) => (
                    <div key={idx} className="flex flex-col gap-1.5">
                      <div className="flex justify-between items-center text-sm">
                        <span className="font-semibold text-slate-700 dark:text-slate-300 truncate pr-2">{tag.name}</span>
                        <span className="font-bold text-slate-900 dark:text-white">{tag.quantity}</span>
                      </div>
                      <div className="w-full bg-slate-100 dark:bg-slate-800 h-1.5 rounded-full overflow-hidden">
                        <div className="bg-indigo-400 dark:bg-indigo-500 h-full rounded-full" style={{ width: `${(tag.quantity / totalGlobalItems) * 100}%` }}></div>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>

            {/* Top Items List */}
            <div className="lg:col-span-2 bg-white/70 dark:bg-slate-900/70 backdrop-blur-2xl rounded-[32px] border border-white/60 dark:border-white/10 shadow-[0_8px_32px_rgba(0,0,0,0.04)] overflow-hidden flex flex-col">
              <div className="p-6 border-b border-slate-100 dark:border-slate-800">
                <h3 className="text-lg font-bold text-slate-900 dark:text-white flex items-center gap-2">
                  <Layers className="w-5 h-5 text-slate-400" />
                  Top Items Inventory
                </h3>
                <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">Aggregated breakdown of your most abundant assets.</p>
              </div>
              
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse text-sm">
                  <thead>
                    <tr className="bg-slate-50/50 dark:bg-slate-800/30 text-slate-500 dark:text-slate-400 border-b border-slate-100 dark:border-slate-800/50">
                      <th className="py-3 px-6 font-semibold">Item Name</th>
                      <th className="py-3 px-4 font-semibold text-center w-24">In Stock</th>
                      <th className="py-3 px-4 font-semibold text-center w-24">Deployed</th>
                      <th className="py-3 px-6 font-semibold text-right w-32">Total Qty</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-50 dark:divide-slate-800/50">
                    {summary.items.length === 0 ? (
                      <tr>
                        <td colSpan={4} className="py-12 text-center text-slate-500 font-medium">No items found.</td>
                      </tr>
                    ) : (
                      summary.items.slice(0, 10).map((item, i) => {
                        const ItemIcon = getItemIcon(item.name || "", item.tag || "", item.type || "");
                        return (
                          <tr key={i} className="hover:bg-slate-50/50 dark:hover:bg-slate-800/30 transition-colors group">
                            <td className="py-3 px-6">
                              <div className="flex items-center gap-3">
                                <div className="w-8 h-8 rounded-lg bg-slate-100 dark:bg-slate-800 flex items-center justify-center shrink-0">
                                  <ItemIcon className="w-4 h-4 text-slate-500 dark:text-slate-400" />
                                </div>
                                <div className="flex flex-col">
                                  <span className="font-semibold text-slate-800 dark:text-slate-200">{item.name}</span>
                                  <span className="text-[11px] font-medium text-slate-400 dark:text-slate-500 uppercase tracking-wider">{item.tag}</span>
                                </div>
                              </div>
                            </td>
                            <td className="py-3 px-4 text-center">
                              <span className="inline-flex items-center justify-center min-w-[2rem] px-1.5 py-0.5 rounded-md bg-emerald-50 dark:bg-emerald-500/10 text-emerald-700 dark:text-emerald-400 font-semibold text-xs border border-emerald-200 dark:border-emerald-500/20">
                                {item.inStock}
                              </span>
                            </td>
                            <td className="py-3 px-4 text-center">
                              <span className="inline-flex items-center justify-center min-w-[2rem] px-1.5 py-0.5 rounded-md bg-indigo-50 dark:bg-indigo-500/10 text-indigo-700 dark:text-indigo-400 font-semibold text-xs border border-indigo-200 dark:border-indigo-500/20">
                                {item.inClasses}
                              </span>
                            </td>
                            <td className="py-3 px-6 text-right">
                              <span className="text-base font-bold text-slate-900 dark:text-white">
                                {item.quantity}
                              </span>
                            </td>
                          </tr>
                        );
                      })
                    )}
                  </tbody>
                </table>
              </div>
              {summary.items.length > 10 && (
                <div className="p-4 text-center border-t border-slate-100 dark:border-slate-800 bg-slate-50/30 dark:bg-slate-800/20">
                  <span className="text-xs font-semibold text-slate-500 dark:text-slate-400 tracking-widest uppercase">Showing Top 10 of {summary.items.length} Unique Items</span>
                </div>
              )}
            </div>
          </div>
        </>
      )}
    </div>
  );
}
"""

with open("src/pages/Home.tsx", "w") as f:
    f.write(new_home_content)
