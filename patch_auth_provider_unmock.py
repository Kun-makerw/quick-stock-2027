import sys
import re

with open("src/components/AuthProvider.tsx", "r") as f:
    content = f.read()

# Remove the hardcoded admin check
pattern = r"if\s*\(email === 'admin' && password === 'admin'\)\s*\{.*?(?=const result = await emailSignIn)"
content = re.sub(pattern, "", content, flags=re.DOTALL)

with open("src/components/AuthProvider.tsx", "w") as f:
    f.write(content)
