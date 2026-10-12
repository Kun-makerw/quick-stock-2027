import sys

def patch_file(filename):
    with open(filename, "r") as f:
        content = f.read()

    # Dark mode classes replacements
    replacements = {
        'bg-white/60 backdrop-blur-md border border-white/40 text-slate-700': 'bg-white/60 dark:bg-slate-800/60 backdrop-blur-md border border-white/40 dark:border-white/10 text-slate-700 dark:text-slate-300',
        'hover:bg-slate-50 transition-colors shadow-sm text-sm': 'hover:bg-slate-50 dark:hover:bg-slate-700 transition-colors shadow-sm text-sm',
        'bg-white/70 backdrop-blur-2xl rounded-[32px] shadow-sm border border-slate-200 divide-y divide-slate-100': 'bg-white/70 dark:bg-slate-900/60 backdrop-blur-2xl rounded-[32px] shadow-sm border border-slate-200 dark:border-slate-700/50 divide-y divide-slate-100 dark:divide-slate-700/50',
        'text-slate-500': 'text-slate-500 dark:text-slate-400',
        'hover:bg-slate-50 transition-colors': 'hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors',
        'bg-indigo-50 text-indigo-500': 'bg-indigo-50 dark:bg-indigo-500/10 text-indigo-500 dark:text-indigo-400',
        'text-slate-400 hover:text-red-500 hover:bg-red-50': 'text-slate-400 dark:text-slate-500 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-500/10',
        'bg-white rounded-2xl shadow-xl': 'bg-white dark:bg-slate-800 rounded-2xl shadow-xl',
        'text-slate-900': 'text-slate-900 dark:text-white',
        'text-slate-600': 'text-slate-600 dark:text-slate-300',
        'hover:bg-slate-100': 'hover:bg-slate-100 dark:hover:bg-slate-700',
        'text-slate-800': 'text-slate-800 dark:text-slate-200',
        'bg-slate-200': 'bg-slate-200 dark:bg-slate-700',
        'text-slate-500 dark:text-slate-400 dark:text-slate-400': 'text-slate-500 dark:text-slate-400',
        'text-slate-900 dark:text-white dark:text-white': 'text-slate-900 dark:text-white'
    }
    
    for old, new in replacements.items():
        content = content.replace(old, new)
        
    with open(filename, "w") as f:
        f.write(content)

patch_file("src/pages/DefaultItems.tsx")
patch_file("src/pages/LabDefaultItems.tsx")
