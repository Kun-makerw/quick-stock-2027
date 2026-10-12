import sys

def patch_file(filename):
    with open(filename, "r") as f:
        content = f.read()
    
    content = content.replace("const { user, loading, isLoggingIn, login, logout } = useAuth();", """const { user, loading, isLoggingIn, login, emailLogin, emailRegister, logout } = useAuth();
  const [authMode, setAuthMode] = useState<'google' | 'email' | 'register'>('google');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  
  const handleEmailLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (email && password) emailLogin(email, password);
  };
  
  const handleEmailRegister = (e: React.FormEvent) => {
    e.preventDefault();
    if (email && password) emailRegister(email, password);
  };""")

    # Find the login form replacement
    search_str = """        <div className="bg-white/80 dark:bg-slate-900/80 backdrop-blur-xl p-8 rounded-[32px] shadow-xl border border-white/50 dark:border-white/10 max-w-sm w-full text-center space-y-6 relative z-10">
          <div className="mx-auto w-14 h-14 bg-[#1A1A1A] text-white dark:bg-white dark:text-[#1A1A1A] rounded-2xl flex items-center justify-center mb-4">
            <PackageSearch className="w-7 h-7" strokeWidth={2} />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-slate-900 dark:text-white tracking-tight">Quick Stock</h1>
            <p className="text-slate-500 dark:text-slate-400 mt-2 text-sm font-medium">Sign in to manage IT inventory seamlessly connected to Google Sheets.</p>
          </div>
          
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
                <div className="absolute inset-[3px] [transform-style:preserve-3d]" style={{ transform: 'rotateX(30deg) rotateY(60deg)' }}>
                  <div className="w-full h-full rounded-full border-[2px] border-purple-500/80 border-b-transparent animate-[spin_3s_linear_infinite_reverse]"></div>
                </div>
                <div className="absolute inset-[6px] [transform-style:preserve-3d]" style={{ transform: 'rotateX(70deg) rotateZ(45deg)' }}>
                  <div className="w-full h-full rounded-full border-[1.5px] border-blue-500/80 border-l-transparent animate-[spin_2s_linear_infinite]"></div>
                </div>
              </div>
            ) : (
              <svg className="w-5 h-5" viewBox="0 0 24 24">
                <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
                <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
                <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
                <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
              </svg>
            )}
            <span>Sign in with Google</span>
          </button>
        </div>"""
    
    replace_str = """        <div className="bg-white/80 dark:bg-slate-900/80 backdrop-blur-xl p-8 rounded-[32px] shadow-xl border border-white/50 dark:border-white/10 max-w-sm w-full text-center space-y-6 relative z-10">
          <div className="mx-auto w-14 h-14 bg-[#1A1A1A] text-white dark:bg-white dark:text-[#1A1A1A] rounded-2xl flex items-center justify-center mb-4">
            <PackageSearch className="w-7 h-7" strokeWidth={2} />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-slate-900 dark:text-white tracking-tight">Quick Stock</h1>
            <p className="text-slate-500 dark:text-slate-400 mt-2 text-sm font-medium">Sign in to manage IT inventory seamlessly connected to Google Sheets.</p>
          </div>
          
          {authMode === 'google' && (
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
                    <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
                    <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
                    <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
                    <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
                  </svg>
                )}
                <span>Sign in with Google</span>
              </button>
              <button 
                onClick={() => setAuthMode('email')}
                className="text-sm font-medium text-slate-500 hover:text-indigo-600 transition-colors"
              >
                Or use email & password
              </button>
            </div>
          )}

          {authMode === 'email' && (
            <form onSubmit={handleEmailLogin} className="space-y-4">
              <input 
                type="email" 
                placeholder="Email address"
                value={email}
                onChange={e => setEmail(e.target.value)}
                required
                className="w-full px-4 py-3 rounded-xl bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-600 outline-none focus:ring-2 focus:ring-indigo-500"
              />
              <input 
                type="password" 
                placeholder="Password"
                value={password}
                onChange={e => setPassword(e.target.value)}
                required
                className="w-full px-4 py-3 rounded-xl bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-600 outline-none focus:ring-2 focus:ring-indigo-500"
              />
              <button 
                type="submit"
                disabled={isLoggingIn}
                className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-3 px-4 rounded-xl transition-all"
              >
                {isLoggingIn ? "Signing In..." : "Sign In"}
              </button>
              <div className="flex justify-between text-sm">
                <button 
                  type="button"
                  onClick={() => setAuthMode('google')}
                  className="text-slate-500 hover:text-indigo-600 font-medium"
                >
                  Back
                </button>
                <button 
                  type="button"
                  onClick={() => setAuthMode('register')}
                  className="text-slate-500 hover:text-indigo-600 font-medium"
                >
                  Create Account
                </button>
              </div>
            </form>
          )}

          {authMode === 'register' && (
            <form onSubmit={handleEmailRegister} className="space-y-4">
              <input 
                type="email" 
                placeholder="Email address"
                value={email}
                onChange={e => setEmail(e.target.value)}
                required
                className="w-full px-4 py-3 rounded-xl bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-600 outline-none focus:ring-2 focus:ring-indigo-500"
              />
              <input 
                type="password" 
                placeholder="Password"
                value={password}
                onChange={e => setPassword(e.target.value)}
                required
                className="w-full px-4 py-3 rounded-xl bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-600 outline-none focus:ring-2 focus:ring-indigo-500"
              />
              <button 
                type="submit"
                disabled={isLoggingIn}
                className="w-full bg-emerald-600 hover:bg-emerald-700 text-white font-bold py-3 px-4 rounded-xl transition-all"
              >
                {isLoggingIn ? "Creating Account..." : "Sign Up"}
              </button>
              <div className="flex justify-between text-sm">
                <button 
                  type="button"
                  onClick={() => setAuthMode('email')}
                  className="text-slate-500 hover:text-indigo-600 font-medium"
                >
                  Back to Sign In
                </button>
              </div>
            </form>
          )}
        </div>"""
    
    content = content.replace(search_str, replace_str)
    
    with open(filename, "w") as f:
        f.write(content)

patch_file("src/components/Layout.tsx")
