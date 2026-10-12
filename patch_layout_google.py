import sys

with open("src/components/Layout.tsx", "r") as f:
    content = f.read()

content = content.replace("onClick={linkGoogle}", "onClick={login}")
content = content.replace("Link Google Account", "Authorize Google Sheets")

with open("src/components/Layout.tsx", "w") as f:
    f.write(content)
