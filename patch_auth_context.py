import sys

with open("src/components/AuthProvider.tsx", "r") as f:
    content = f.read()

# Add hasGoogleAccess to AuthContextType
if "hasGoogleAccess: boolean;" not in content:
    content = content.replace("user: User | null;", "user: User | null;\n  hasGoogleAccess: boolean;")
    content = content.replace("user: null,", "user: null,\n  hasGoogleAccess: false,")
    content = content.replace("const [user, setUser] = useState<User | null>(null);", "const [user, setUser] = useState<User | null>(null);\n  const [hasGoogleAccess, setHasGoogleAccess] = useState(false);")
    
    # Update initAuth callback
    content = content.replace("""        setUser(user);
        setLoading(false);""", """        setUser(user);
        setHasGoogleAccess(!!token && token !== 'dummy_token_for_email_login');
        setLoading(false);""")

    # Update googleSignIn
    content = content.replace("""      if (result) {
        setUser(result.user);
      }""", """      if (result) {
        setUser(result.user);
        setHasGoogleAccess(!!result.accessToken);
      }""")
      
    # Update emailLogin
    content = content.replace("""      const result = await emailSignIn(email, password);
      if (result) {
        setUser(result.user);
      }""", """      const result = await emailSignIn(email, password);
      if (result) {
        setUser(result.user);
        setHasGoogleAccess(false);
      }""")

    content = content.replace("login, emailLogin, emailRegister, logout }", "login, emailLogin, emailRegister, logout, hasGoogleAccess }")

with open("src/components/AuthProvider.tsx", "w") as f:
    f.write(content)
