import sys

with open("src/components/AuthProvider.tsx", "r") as f:
    content = f.read()

import re

# Insert the admin check back into emailLogin
admin_check = """
      if (email === 'admin' && password === 'admin') {
        setCachedAccessToken('dummy_token_for_email_login'); // We set a dummy token, but hasGoogleAccess will be false
        setUser({ uid: 'admin_local', email: 'admin@quickstock.local', displayName: 'Administrator' } as any);
        setHasGoogleAccess(false);
        return;
      }
"""
content = content.replace("const result = await emailSignIn(email, password);", admin_check.strip() + "\n      const result = await emailSignIn(email, password);")

with open("src/components/AuthProvider.tsx", "w") as f:
    f.write(content)
