# Quick Stock

## Overview
Quick Stock is a clean, mobile-friendly web application designed to streamline IT support tasks by managing inventory and stock counts directly in Google Sheets. It provides a simple UI for tracking IT assets, updating quantities, and integrating directly with Google Workspace.

## Features
- **Google Sheets Integration**: Uses your Google Sheets as a database for durable cloud persistence.
- **Barcode & QR Scanning**: Built-in camera support for quickly finding and updating items (`html5-qrcode`).
- **Responsive Layout**: Designed to work seamlessly on mobile devices for on-the-go inventory management.
- **Secure Authentication**: Uses OAuth to securely authenticate users and read/write to their Google Drive/Sheets.

## Recent Updates (Disabled Auto Sheet Creation)
I have updated the application to stop automatically creating new sheets in your Google Spreadsheet. 

Previously, the app would auto-create sheets like "Classes", "Stock Room", "Item Master", or "Class_Template" if it couldn't find them. This was causing unwanted clutter in your spreadsheets.

The behavior has been fixed:
1. **Disabled Auto-Creation**: The application will no longer attempt to use `batchUpdate` to `addSheet` for missing sheets.
2. **Graceful Fallback**: If a specific expected sheet tab (like "Classes" or "Stock Room") is not found, the application will simply fall back to reading and writing from your first existing sheet (e.g., `Sheet1`). 
3. This ensures the app runs properly and stores data normally using your existing configuration without generating unsolicited sheets!

## Tech Stack
- React 19 + Vite
- Tailwind CSS
- Lucide React (Icons)
- Framer Motion (Animations)
- Google Workspace APIs (Sheets API)
