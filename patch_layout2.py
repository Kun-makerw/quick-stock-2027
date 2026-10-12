import sys
import re

def patch_file(filename):
    with open(filename, "r") as f:
        content = f.read()

    auth_block_replace = """          {authMode === 'google' ? (
            <div className="space-y-4">
              <button 
                onClick={login}
                disabled={isLoggingIn}
                className={cn(
                  "w-full flex items-center justify-center gap-3 bg-white/60 dark:bg-slate-800/60 backdrop-blur-md border border-white/40 dark:border-white/10 font-bold py-3.5 px-4 rounded-2xl transition-all hover:shadow-md",
                  isLoggingIn ? "opacity-50 cursor-not-allowed" : "hover:scale-[1.02] text-slate-800 dark:text-slate-200"
                )}
              >
                {isLoggingIn ? (
                  <div className="relative w-6 h-6 [perspective:1000px] shrink-0">
                    <div className="absolute inset-0 [transform-style:preserve-3d]" style={{ transform: 'rotateX(60deg) rotateY(20deg)' }}>
                      <div className="w-full h-full rounded-full border-[2px] border-indigo-500/80 border-t-transparent animate-[spin_2.5s_linear_infinite]"></div>
                    </div>
                  </div>
                ) : (
                  <svg className="w-5 h-5" viewBox="0 0 24 24">
                    <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
                    <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                    <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" />
                    <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
                  </svg>
                )}
                <span>Sign in with Google</span>
              </button>
              <button 
                onClick={() => setAuthMode('email')}
                className="text-sm font-medium text-slate-500 hover:text-indigo-600 transition-colors"
              >
                Admin Credential Login
              </button>
            </div>
          ) : (
            <form onSubmit={handleEmailLogin} className="space-y-4">
              <h2 className="text-lg font-bold text-slate-800 dark:text-slate-200 mb-2">Admin Login</h2>
              <input 
                type="text" 
                placeholder="Username or Email"
                value={email}
                onChange={e => setEmail(e.target.value)}
                required
                className="w-full px-4 py-3 rounded-xl bg-white/60 dark:bg-slate-800/60 backdrop-blur-md border border-slate-200 dark:border-slate-700 outline-none focus:ring-2 focus:ring-indigo-500 text-slate-900 dark:text-white"
              />
              <input 
                type="password" 
                placeholder="Password"
                value={password}
                onChange={e => setPassword(e.target.value)}
                required
                className="w-full px-4 py-3 rounded-xl bg-white/60 dark:bg-slate-800/60 backdrop-blur-md border border-slate-200 dark:border-slate-700 outline-none focus:ring-2 focus:ring-indigo-500 text-slate-900 dark:text-white"
              />
              <button 
                type="submit"
                disabled={isLoggingIn}
                className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-3 px-4 rounded-xl transition-all shadow-lg shadow-indigo-600/20"
              >
                {isLoggingIn ? "Signing In..." : "Sign In as Admin"}
              </button>
              <div className="flex justify-center text-sm mt-4">
                <button 
                  type="button"
                  onClick={() => setAuthMode('google')}
                  className="text-slate-500 hover:text-indigo-600 font-medium"
                >
                  Back to Google Sign In
                </button>
              </div>
              <p className="text-xs text-amber-600 dark:text-amber-400 mt-4 text-left bg-amber-50 dark:bg-amber-500/10 border border-amber-200 dark:border-amber-500/20 p-3 rounded-lg leading-relaxed">
                Note: Local admin credentials bypass Google OAuth. You cannot write to private Google Sheets without a Google access token.
              </p>
            </form>
          )}
"""
    
    # Replace the button block
    content = re.sub(r'<button\s+onClick=\{login\}.*?</button>', auth_block_replace, content, flags=re.DOTALL)
    
    # Add state variables
    if 'const [authMode' not in content:
        content = content.replace("const { user, loading, isLoggingIn, login, logout } = useAuth();", """const { user, loading, isLoggingIn, login, emailLogin, logout } = useAuth();
  const [authMode, setAuthMode] = useState<'google' | 'email'>('google');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  
  const handleEmailLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (email && password && emailLogin) emailLogin(email, password);
  };""")
        
    with open(filename, "w") as f:
        f.write(content)

patch_file("src/components/Layout.tsx")
