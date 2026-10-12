import sys

with open("src/components/AuthProvider.tsx", "r") as f:
    content = f.read()

if "linkGoogle:" not in content:
    content = content.replace("import { initAuth, googleSignIn, logout as firebaseLogout, emailSignIn, emailSignUp, setCachedAccessToken } from '../lib/auth';",
                              "import { initAuth, googleSignIn, logout as firebaseLogout, emailSignIn, emailSignUp, setCachedAccessToken, linkGoogleAccount } from '../lib/auth';")
    
    content = content.replace("logout: () => Promise<void>;\n  hasGoogleAccess: boolean;", "linkGoogle: () => Promise<void>;\n  logout: () => Promise<void>;\n  hasGoogleAccess: boolean;")
    content = content.replace("logout: async () => {},", "linkGoogle: async () => {},\n  logout: async () => {},")

    link_impl = """  const linkGoogle = async () => {
    if (isLoggingIn) return;
    setIsLoggingIn(true);
    try {
      const result = await linkGoogleAccount();
      if (result) {
        setUser(result.user);
        setHasGoogleAccess(true);
      }
    } catch (error: any) {
      console.error(error);
    } finally {
      setIsLoggingIn(false);
    }
  };"""

    content = content.replace("const logout = async () => {", link_impl + "\n\n  const logout = async () => {")
    content = content.replace("login, emailLogin, emailRegister, logout, hasGoogleAccess }", "login, emailLogin, emailRegister, linkGoogle, logout, hasGoogleAccess }")

with open("src/components/AuthProvider.tsx", "w") as f:
    f.write(content)
