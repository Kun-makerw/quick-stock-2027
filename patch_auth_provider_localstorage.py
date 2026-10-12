import sys

with open("src/components/AuthProvider.tsx", "r") as f:
    content = f.read()

# Auto-set a dummy spreadsheet ID if it doesn't exist so the user gets instant demo data.
search_str = "        setCachedAccessToken('dummy_token_for_email_login');"
replace_str = """        setCachedAccessToken('dummy_token_for_email_login');
        if (!localStorage.getItem('quickStock_classesSheetId')) {
           localStorage.setItem('quickStock_classesSheetId', 'demo_admin_spreadsheet_id');
        }"""

content = content.replace(search_str, replace_str)

with open("src/components/AuthProvider.tsx", "w") as f:
    f.write(content)
