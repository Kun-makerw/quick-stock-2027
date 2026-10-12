#!/bin/bash
find src -type f -name "*.tsx" -print0 | xargs -0 sed -i \
  -e 's/bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700/bg-white\/60 dark:bg-slate-800\/60 backdrop-blur-md border border-white\/40 dark:border-white\/10/g' \
  -e 's/bg-white border border-slate-200 shadow-sm/bg-white\/60 backdrop-blur-md border border-white\/40 shadow-sm/g' \
  -e 's/bg-white border border-slate-300/bg-white\/60 backdrop-blur-md border border-white\/40/g' \
  -e 's/bg-white rounded-3xl border border-slate-200 shadow-sm/bg-white\/70 backdrop-blur-2xl rounded-[32px] border border-white\/60 shadow-[0_8px_32px_rgba(0,0,0,0.04)]/g' \
  -e 's/bg-white rounded-3xl/bg-white\/70 backdrop-blur-2xl rounded-[32px]/g'

