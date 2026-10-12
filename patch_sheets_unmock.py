import sys

with open("src/lib/sheets.ts", "r") as f:
    content = f.read()

import re
# Remove the mock data block inside fetchWithRetry
# The block starts with `if (token === 'dummy_token_for_email_login') {` and ends before `const response = await fetch(url, {`

pattern = r"if\s*\(token === 'dummy_token_for_email_login'\)\s*\{.*?(?=const response = await fetch\()"
content = re.sub(pattern, "", content, flags=re.DOTALL)

with open("src/lib/sheets.ts", "w") as f:
    f.write(content)
