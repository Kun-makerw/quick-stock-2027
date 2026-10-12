import sys

def patch_file(filename):
    with open(filename, "r") as f:
        content = f.read()

    # The interface in AuthProvider might not have emailLogin
    with open("src/components/AuthProvider.tsx", "r") as f:
        auth_content = f.read()

    if "emailLogin: (email: string, password: string) => Promise<void>;" not in auth_content:
        auth_content = auth_content.replace(
            "login: () => Promise<void>;", 
            "login: () => Promise<void>;\n  emailLogin?: (email: string, password: string) => Promise<void>;"
        )
        auth_content = auth_content.replace(
            "login: async () => {},", 
            "login: async () => {},\n  emailLogin: async () => {},"
        )
        with open("src/components/AuthProvider.tsx", "w") as f:
            f.write(auth_content)
