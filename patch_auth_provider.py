import sys

with open("src/components/AuthProvider.tsx", "r") as f:
    content = f.read()

content = content.replace("import { initAuth, googleSignIn, logout as firebaseLogout, emailSignIn, emailSignUp } from '../lib/auth';", 
"import { initAuth, googleSignIn, logout as firebaseLogout, emailSignIn, emailSignUp, setCachedAccessToken } from '../lib/auth';")

content = content.replace("        setUser({ uid: 'admin_local', email: 'admin@quickstock.local', displayName: 'Administrator' } as any);\n        return;",
"        setCachedAccessToken('dummy_token_for_email_login');\n        setUser({ uid: 'admin_local', email: 'admin@quickstock.local', displayName: 'Administrator' } as any);\n        return;")

with open("src/components/AuthProvider.tsx", "w") as f:
    f.write(content)
