import sys

def patch_file(filename):
    with open(filename, "r") as f:
        content = f.read()

    # Modify emailLogin to support hardcoded admin
    hardcoded_admin = """
  const emailLogin = async (email: string, password: string) => {
    if (isLoggingIn) return;
    setIsLoggingIn(true);
    try {
      if (email === 'admin' && password === 'admin') {
        setUser({ uid: 'admin_local', email: 'admin@quickstock.local', displayName: 'Administrator' } as any);
        return;
      }
      const result = await emailSignIn(email, password);
      if (result) {
        setUser(result.user);
      }
    } catch (error: any) {
      alert(error.message || 'Failed to sign in with credentials.');
    } finally {
      setIsLoggingIn(false);
    }
  };
"""
    import re
    content = re.sub(r'const emailLogin = async.*?finally \{\n\s*setIsLoggingIn\(false\);\n\s*\}\n\s*\};', hardcoded_admin.strip(), content, flags=re.DOTALL)

    with open(filename, "w") as f:
        f.write(content)

patch_file("src/components/AuthProvider.tsx")
