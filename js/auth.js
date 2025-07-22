// auth.js
import { signInWithPopup, signInWithEmailAndPassword, createUserWithEmailAndPassword, signOut } from "firebase/auth";
import { auth, provider } from "./firebase-config";

export const signInWithGoogle = async () => {
  try {
    const result = await signInWithPopup(auth, provider);
    return result.user;
  } catch (error) {
    alert("Google sign-in failed: " + error.message);
    return null;
  }
};

export const signInWithEmail = async (email, password) => {
  try {
    const result = await signInWithEmailAndPassword(auth, email, password);
    return result.user;
  } catch (error) {
    alert("Email login failed: " + error.message);
    return null;
  }
};

export const signUpWithEmail = async (email, password) => {
  try {
    const result = await createUserWithEmailAndPassword(auth, email, password);
    return result.user;
  } catch (error) {
    alert("Sign-up failed: " + error.message);
    return null;
  }
};

export const signOutUser = async () => {
  try {
    await signOut(auth);
    alert("Signed out successfully.");
  } catch (error) {
    alert("Sign out failed: " + error.message);
  }
};
