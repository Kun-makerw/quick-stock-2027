import sys

def patch_file(filename):
    with open(filename, "r") as f:
        content = f.read()

    # Dark mode classes replacements
    replacements = {
        'text-slate-900': 'text-slate-900 dark:text-white',
        'text-slate-800': 'text-slate-800 dark:text-slate-200',
        'text-slate-700': 'text-slate-700 dark:text-slate-300',
        'bg-slate-50': 'bg-slate-50 dark:bg-slate-800/50',
        'border-slate-200': 'border-slate-200 dark:border-slate-700/50',
        'bg-white/70': 'bg-white/70 dark:bg-slate-900/60',
        'border-white/60': 'border-white/60 dark:border-white/10',
        'bg-white ': 'bg-white dark:bg-slate-800 ',
        'hover:bg-slate-50': 'hover:bg-slate-50 dark:hover:bg-slate-800',
        'hover:bg-indigo-50/50': 'hover:bg-indigo-50/50 dark:hover:bg-indigo-500/10',
        'hover:border-indigo-200': 'hover:border-indigo-200 dark:hover:border-indigo-500/30',
        'border-slate-100': 'border-slate-100 dark:border-slate-700/30',
        'bg-slate-100': 'bg-slate-100 dark:bg-slate-800',
        'text-slate-900 dark:text-white dark:text-white': 'text-slate-900 dark:text-white', # Deduplicate
        'text-slate-800 dark:text-slate-200 dark:text-slate-200': 'text-slate-800 dark:text-slate-200',
        'text-slate-700 dark:text-slate-300 dark:text-slate-300': 'text-slate-700 dark:text-slate-300',
        'bg-slate-50 dark:bg-slate-800/50 dark:bg-slate-800/50': 'bg-slate-50 dark:bg-slate-800/50',
        'border-slate-200 dark:border-slate-700/50 dark:border-slate-700/50': 'border-slate-200 dark:border-slate-700/50',
        'bg-white/70 dark:bg-slate-900/60 dark:bg-slate-900/60': 'bg-white/70 dark:bg-slate-900/60',
        'border-white/60 dark:border-white/10 dark:border-white/10': 'border-white/60 dark:border-white/10',
        'bg-white dark:bg-slate-800 ': 'bg-white dark:bg-slate-800 ',
        'hover:bg-slate-50 dark:hover:bg-slate-800 dark:hover:bg-slate-800': 'hover:bg-slate-50 dark:hover:bg-slate-800',
    }
    
    for old, new in replacements.items():
        content = content.replace(old, new)
        
    with open(filename, "w") as f:
        f.write(content)

patch_file("src/pages/ItemsList.tsx")
patch_file("src/pages/ModelsList.tsx")
