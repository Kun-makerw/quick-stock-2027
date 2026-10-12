import sys

with open("src/lib/auth.ts", "r") as f:
    content = f.read()

if "linkGoogleAccount" not in content:
    content = content.replace("import { getAuth, signInWithPopup, GoogleAuthProvider, onAuthStateChanged, User, signInWithEmailAndPassword, createUserWithEmailAndPassword } from 'firebase/auth';", 
                              "import { getAuth, signInWithPopup, GoogleAuthProvider, onAuthStateChanged, User, signInWithEmailAndPassword, createUserWithEmailAndPassword, linkWithPopup } from 'firebase/auth';")
    
    link_func = """
export const linkGoogleAccount = async (): Promise<{ user: User; accessToken: string } | null> => {
  try {
    isSigningIn = true;
    const currentUser = auth.currentUser;
    if (!currentUser) throw new Error("No user is signed in");
    
    const result = await linkWithPopup(currentUser, provider);
    const credential = GoogleAuthProvider.credentialFromResult(result);
    if (!credential?.accessToken) {
      throw new Error('Failed to get access token from Google');
    }
    cachedAccessToken = credential.accessToken;
    return { user: result.user, accessToken: cachedAccessToken };
  } catch (error: any) {
    if (error?.code === 'auth/credential-already-in-use') {
      alert("This Google account is already linked to another user. Please sign in directly with Google.");
    } else if (error?.code !== 'auth/popup-closed-by-user') {
      console.error('Link error:', error);
    }
    throw error;
  } finally {
    isSigningIn = false;
  }
};
"""
    content += link_func

with open("src/lib/auth.ts", "w") as f:
    f.write(content)
