import React, { useState, useEffect } from "react";
import {
  Save,
  AlertCircle,
  CheckCircle2,
  FilePlus2,
  Moon,
  Sun,
  KeyRound,
  Check,
} from "lucide-react";
import {
  getSpreadsheetMetadata,
  createStarterSheets,
  formatClassColors,
  formatStockColors,
} from "../lib/sheets";
import { useTheme } from "../components/ThemeProvider";
import { authorizeGoogleSheets, getAccessToken } from "../lib/auth";

export function Settings() {
  const [stockSheetId, setStockSheetId] = useState("");
  const [classesSheetId, setClassesSheetId] = useState("");
  const [lowInventoryThreshold, setLowInventoryThreshold] = useState("5");
  const { theme, toggleTheme } = useTheme();

  const [status, setStatus] = useState<
    "idle" | "saving" | "success" | "error" | "creating"
  >("idle");
  const [errorMsg, setErrorMsg] = useState("");
  const [authorizing, setAuthorizing] = useState(false);
  const [hasActiveGoogleToken, setHasActiveGoogleToken] = useState<boolean>(
    () => {
      const token = getAccessToken();
      return !!token && token !== "dummy_token_for_email_login";
    },
  );

  useEffect(() => {
    const savedClasses =
      localStorage.getItem("quickStock_classesSheetId") || "";
    const savedThreshold =
      localStorage.getItem("quickStock_lowInventoryThreshold") || "5";
    setClassesSheetId(savedClasses);
    setLowInventoryThreshold(savedThreshold);
  }, []);

  const handleAuthorizeGoogle = async () => {
    setAuthorizing(true);
    setErrorMsg("");
    try {
      await authorizeGoogleSheets();
      setHasActiveGoogleToken(true);
      setStatus("success");
      setTimeout(() => setStatus("idle"), 3000);
    } catch (err: any) {
      console.error(err);
      setErrorMsg(err.message || "Failed to authorize Google Sheets.");
    } finally {
      setAuthorizing(false);
    }
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus("saving");
    setErrorMsg("");

    try {
      if (classesSheetId) {
        try {
          await getSpreadsheetMetadata(classesSheetId);
        } catch (e) {
          console.warn("Metadata verification warning:", e);
        }
      }

      localStorage.setItem("quickStock_classesSheetId", classesSheetId);
      localStorage.setItem("quickStock_lowInventoryThreshold", lowInventoryThreshold);
      setStatus("success");

      setTimeout(() => setStatus("idle"), 3000);
    } catch (err: any) {
      console.error(err);
      setStatus("error");
      setErrorMsg(err.message || "Failed to save Spreadsheet ID.");
    }
  };

  const handleCreateStarterSheets = async () => {
    setStatus("creating");
    setErrorMsg("");
    try {
      const { stockSheetId: newStockId, classesSheetId: newClassesId } =
        await createStarterSheets();
      // Formatting handled within the app after load. But we can trigger a first-time format here if needed.
      await formatStockColors(newStockId, 0, "Stock Room");
      await formatClassColors(newClassesId, 0, "Classes");
      setClassesSheetId(newClassesId);

      localStorage.setItem("quickStock_classesSheetId", newClassesId);

      setStatus("success");
      setTimeout(() => setStatus("idle"), 3000);
    } catch (err: any) {
      console.error(err);
      setStatus("error");
      setErrorMsg(err.message || "Failed to create starter sheets.");
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold text-slate-900 dark:text-white tracking-tight">
            Settings
          </h1>
          <p className="text-slate-500 dark:text-slate-400 font-medium mt-1">
            Configure your Google Sheets connections.
          </p>
        </div>
        <button
          onClick={handleCreateStarterSheets}
          disabled={status === "creating"}
          className="px-5 py-2.5 bg-emerald-50 dark:bg-emerald-500/10 text-emerald-700 dark:text-emerald-400 hover:bg-emerald-100 dark:hover:bg-emerald-500/20 border border-emerald-200 dark:border-emerald-500/30 rounded-xl font-bold text-sm transition-colors flex items-center gap-2 disabled:opacity-50 whitespace-nowrap"
        >
          {status === "creating" ? (
            <div className="w-4 h-4 border-2 border-emerald-600 dark:border-emerald-400 border-t-transparent rounded-full animate-spin"></div>
          ) : (
            <FilePlus2 className="w-4 h-4" />
          )}
          Create Starter Sheets
        </button>
      </div>

      <form
        onSubmit={handleSave}
        className="bg-white dark:bg-slate-800 p-6 rounded-3xl border border-slate-200 dark:border-slate-700 shadow-sm space-y-6"
      >
        <div className="flex items-center justify-between p-4 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl">
          <div>
            <h3 className="text-sm font-bold text-slate-800 dark:text-slate-200">
              Application Theme
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
              Toggle between light and dark mode
            </p>
          </div>
          <button
            type="button"
            onClick={toggleTheme}
            className="flex items-center gap-2 px-4 py-2 bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-600 rounded-lg shadow-sm hover:bg-slate-50 dark:hover:bg-slate-700 transition-colors"
          >
            {theme === "light" ? (
              <>
                <Moon className="w-4 h-4 text-slate-600 dark:text-slate-400" />
                <span className="text-sm font-medium text-slate-700 dark:text-slate-300">
                  Dark Mode
                </span>
              </>
            ) : (
              <>
                <Sun className="w-4 h-4 text-slate-600 dark:text-slate-400" />
                <span className="text-sm font-medium text-slate-700 dark:text-slate-300">
                  Light Mode
                </span>
              </>
            )}
          </button>
        </div>

        <div className="space-y-2">
          <label
            htmlFor="classesSheetId"
            className="block text-sm font-medium text-slate-700 dark:text-slate-300"
          >
            Main Spreadsheet ID (Classes & Stock Room)
          </label>
          <input
            id="classesSheetId"
            type="text"
            value={classesSheetId}
            onChange={(e) => setClassesSheetId(e.target.value)}
            placeholder="e.g. 1BxiMVs0XRA5nFMdKvBdBZjgmUUqptlbs74OgvE2upms"
            className="w-full px-4 py-2.5 rounded-xl bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-600 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition-all text-slate-800 dark:text-slate-100"
          />
          <p className="text-xs text-slate-500 dark:text-slate-400">
            Each tab in this spreadsheet represents a different class/room.
          </p>
        </div>

        <div className="space-y-2">
          <label
            htmlFor="lowInventoryThreshold"
            className="block text-sm font-medium text-slate-700 dark:text-slate-300"
          >
            Low Inventory Threshold
          </label>
          <input
            id="lowInventoryThreshold"
            type="number"
            min="0"
            value={lowInventoryThreshold}
            onChange={(e) => setLowInventoryThreshold(e.target.value)}
            placeholder="e.g. 5"
            className="w-full px-4 py-2.5 rounded-xl bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-600 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition-all text-slate-800 dark:text-slate-100"
          />
          <p className="text-xs text-slate-500 dark:text-slate-400">
            Show a warning badge on items with quantity below or equal to this number.
          </p>
        </div>

        {status === "error" && (
          <div className="p-3 bg-red-50 dark:bg-red-500/10 border border-red-200 dark:border-red-500/20 text-red-700 dark:text-red-400 rounded-lg flex gap-3 text-sm">
            <AlertCircle className="w-5 h-5 shrink-0" />
            <p>{errorMsg}</p>
          </div>
        )}

        {status === "success" && (
          <div className="p-3 bg-emerald-50 dark:bg-emerald-500/10 border border-emerald-200 dark:border-emerald-500/20 text-emerald-700 dark:text-emerald-400 rounded-lg flex gap-3 text-sm">
            <CheckCircle2 className="w-5 h-5 shrink-0" />
            <p>Settings saved successfully!</p>
          </div>
        )}

        <button
          type="submit"
          disabled={status === "saving"}
          className="w-full py-4 bg-indigo-600 hover:bg-indigo-700 text-white rounded-2xl shadow-lg shadow-indigo-200 dark:shadow-none font-bold transition-all flex items-center justify-center gap-2 disabled:opacity-50"
        >
          {status === "saving" ? (
            <div className="w-5 h-5 border-2 border-white/80 border-t-transparent rounded-full animate-spin"></div>
          ) : (
            <Save className="w-5 h-5" />
          )}
          Save Configuration
        </button>
      </form>
    </div>
  );
}
