
import {
  getAuth,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  GoogleAuthProvider,
  signInWithPopup,
  sendPasswordResetEmail,
  onAuthStateChanged
} from 'firebase/auth'
import app from '@/services/init'



const auth = getAuth(app)
const googleProvider = new GoogleAuthProvider()

export const loginWithEmailPassword = (email:string, password:string) => {
  return signInWithEmailAndPassword(auth, email, password)
}

export const loginWithGoogle = () => {
  return signInWithPopup(auth, googleProvider)
}

export const resetPassword = (email:string) => {
  return sendPasswordResetEmail(auth, email)
}

export function isLogin(): Promise<boolean> {
  return new Promise((resolve) => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      unsubscribe(); // Stop listening after first event
      if (user) {
        console.log("User is signed in:", user.email);
        resolve(true);
      } else {
        console.log("No user is signed in");
        resolve(false);
      }
    });
  });
}

export { auth }
