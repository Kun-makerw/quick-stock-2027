import sys

def patch_file(filename):
    with open(filename, "r") as f:
        content = f.read()
    
    # Remove the register auth mode and rename email to admin
    replace_str = """          {authMode === 'google' && (
            <div className="space-y-4">
              <button 
                onClick={login}
                disabled={isLoggingIn}
                className="w-full flex items-center justify-center gap-3 bg-white/60 dark:bg-slate-800/60 backdrop-blur-md border border-white/40 dark:border-white/10 font-bold py-3.5 px-4 rounded-2xl transition-all hover:shadow-md hover:scale-[1.02] text-slate-800 dark:text-slate-200"
              >
                <svg className="w-5 h-5" viewBox="0 0 24 24">
                  <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
                  <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
                  <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
                  <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
                </svg>
                <span>Sign in with Google</span>
              </button>
              <button 
                onClick={() => setAuthMode('email')}
                className="text-sm font-medium text-slate-500 hover:text-indigo-600 transition-colors"
              >
                Admin Credential Login
              </button>
            </div>
          )}

          {authMode === 'email' && (
            <form onSubmit={handleEmailLogin} className="space-y-4">
              <h2 className="text-lg font-bold text-slate-800 dark:text-slate-200 mb-2">Admin Login</h2>
              <input 
                type="text" 
                placeholder="Admin Username or Email"
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
              <p className="text-xs text-amber-600 dark:text-amber-400 mt-4 text-left bg-amber-50 dark:bg-amber-500/10 p-3 rounded-lg">
                Note: Logging in with a local admin credential bypasses Google OAuth. You will not be able to write to private Google Sheets unless they are fully public, as writes require a Google access token.
              </p>
            </form>
          )}"""
    
    # We need to replace from {authMode === 'google' to the end of the auth form block.
    # It's easier to use a regex or string replacement.
    import re
    content = re.sub(r'\{authMode === \'google\'.*?Back to Sign In\n\s*</button>\n\s*</div>\n\s*</form>\n\s*\)}', replace_str, content, flags=re.DOTALL)
    
    with open(filename, "w") as f:
        f.write(content)

patch_file("src/components/Layout.tsx")
