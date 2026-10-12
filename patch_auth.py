import sys

with open("src/lib/auth.ts", "r") as f:
    content = f.read()

content += "\nexport const setCachedAccessToken = (token: string | null) => { cachedAccessToken = token; };\n"

with open("src/lib/auth.ts", "w") as f:
    f.write(content)
