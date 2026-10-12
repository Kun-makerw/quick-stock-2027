import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft, Box, Folder, Package, Layers, List, Settings, QrCode, Home } from 'lucide-react';

export function About() {
  return (
    <div className="space-y-6 max-w-4xl mx-auto pb-12">
      <div className="flex items-center gap-4">
        <Link 
          to="/"
          className="p-2.5 rounded-full text-slate-400 hover:text-indigo-600 hover:bg-indigo-50 dark:hover:bg-indigo-500/10 transition-colors bg-white/60 dark:bg-slate-800/60 backdrop-blur-md border border-white/40 dark:border-white/10 shadow-sm"
        >
          <ArrowLeft className="w-5 h-5" />
        </Link>
        <div>
          <h1 className="text-3xl font-bold text-slate-900 dark:text-white tracking-tight">About App</h1>
          <p className="text-slate-500 dark:text-slate-400 font-medium mt-1">Learn how to use Quick Stock.</p>
        </div>
      </div>

      <div className="grid gap-6">
        <div className="bg-white/70 dark:bg-slate-900/60 backdrop-blur-2xl rounded-[32px] border border-white/60 dark:border-white/10 shadow-[0_8px_32px_rgba(0,0,0,0.04)] overflow-hidden p-8">
          <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-4">Core Functions</h2>
          <div className="space-y-6">
            <FeatureItem 
              icon={Home} 
              title="Home Dashboard" 
              description="Get a high-level overview of all items across your classes and stock rooms. It provides an aggregated count of all items, distinguishing between checked and unchecked statuses."
            />
            <FeatureItem 
              icon={Box} 
              title="Stock Rooms" 
              description="Manage inventory specifically stored in stock rooms. You can view, add, edit, delete, or move items from stock rooms to classes."
            />
            <FeatureItem 
              icon={Folder} 
              title="Classes" 
              description="Manage inventory deployed in classrooms or specific areas. Each tab in your Google Sheet corresponds to a different class."
            />
            <FeatureItem 
              icon={Package} 
              title="Item Names (Master List)" 
              description="Maintain a global list of standard item names (e.g., HDMI Cable, MacBook Pro) available in dropdowns when adding or editing items to prevent typos and ensure consistency."
            />
            <FeatureItem 
              icon={Layers} 
              title="Types & Tags" 
              description="Customize categorizations. Define which types (e.g., Apple, Dell) belong to which tags (e.g., Computer, Peripheral) for smarter dropdown filtering."
            />
            <FeatureItem 
              icon={List} 
              title="Default Items (Templates)" 
              description="Define templates for standard classrooms or labs. When a new class is added, you can quickly populate it with the default items to save time."
            />
            <FeatureItem 
              icon={QrCode} 
              title="Barcode Scanning" 
              description="Use your device's camera to scan barcodes and auto-fill serial numbers or asset tags when managing inventory items."
            />
          </div>
        </div>

        <div className="bg-white/70 dark:bg-slate-900/60 backdrop-blur-2xl rounded-[32px] border border-white/60 dark:border-white/10 shadow-[0_8px_32px_rgba(0,0,0,0.04)] overflow-hidden p-8">
          <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-4">Getting Started</h2>
          <ol className="list-decimal list-inside space-y-4 text-slate-700 dark:text-slate-300">
            <li><strong>Connect Google Sheets:</strong> Go to Settings and enter your Google Sheet ID. Your Google account must have read/write access.</li>
            <li><strong>Create Master Lists:</strong> Populate "Item Names" and "Types" to make data entry easier later.</li>
            <li><strong>Setup Default Templates:</strong> If you have standard setups, define them in "Default Items".</li>
            <li><strong>Manage Inventory:</strong> Start adding items in your Classes and Stock Rooms!</li>
          </ol>
        </div>
      </div>

      <div className="mt-8 text-center text-sm font-medium text-slate-500 dark:text-slate-400">
        Created by Sireykun Hout
      </div>
    </div>
  );
}

function FeatureItem({ icon: Icon, title, description }: { icon: any, title: string, description: string }) {
  return (
    <div className="flex gap-4">
      <div className="w-12 h-12 rounded-2xl bg-indigo-50 dark:bg-indigo-500/10 flex items-center justify-center shrink-0">
        <Icon className="w-6 h-6 text-indigo-600 dark:text-indigo-400" />
      </div>
      <div>
        <h3 className="text-lg font-bold text-slate-900 dark:text-white">{title}</h3>
        <p className="text-slate-600 dark:text-slate-400 mt-1">{description}</p>
      </div>
    </div>
  );
}