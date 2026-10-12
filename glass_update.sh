#!/bin/bash
find src/pages src/components -type f -name "*.tsx" -print0 | xargs -0 sed -i \
  -e 's/bg-white dark:bg-slate-800 rounded-3xl border border-slate-200 dark:border-slate-700/bg-white\/70 dark:bg-slate-900\/70 backdrop-blur-2xl rounded-[32px] border border-white\/60 dark:border-white\/10 shadow-[0_8px_32px_rgba(0,0,0,0.04)]/g' \
  -e 's/bg-white dark:bg-slate-800 rounded-2xl shadow-xl/bg-white\/80 dark:bg-slate-900\/80 backdrop-blur-2xl rounded-[32px] shadow-[0_8px_32px_rgba(0,0,0,0.08)] border border-white\/60 dark:border-white\/10/g' \
  -e 's/bg-white rounded-3xl shadow-xl/bg-white\/80 dark:bg-slate-900\/80 backdrop-blur-2xl rounded-[32px] shadow-[0_8px_32px_rgba(0,0,0,0.08)] border border-white\/60 dark:border-white\/10/g' \
  -e 's/bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700/bg-white\/60 dark:bg-slate-800\/60 border-white\/40 dark:border-white\/10 backdrop-blur-md/g' \
  -e 's/bg-white dark:bg-slate-800 p-6 sm:p-10 rounded-2xl/bg-white\/70 dark:bg-slate-900\/70 backdrop-blur-2xl p-6 sm:p-10 rounded-[32px] border border-white\/60 dark:border-white\/10 shadow-[0_8px_32px_rgba(0,0,0,0.04)]/g'

