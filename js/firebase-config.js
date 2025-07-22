// firebase-config.js
import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider } from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyDhz__S3SlxeVYov8YM3rZsFJ2Voza3KtM",
  authDomain: "buckeyeride-8ca52.firebaseapp.com",
  projectId: "buckeyeride-8ca52",
  storageBucket: "buckeyeride-8ca52.appspot.com",
  messagingSenderId: "172661990754",
  appId: "1:172661990754:web:c2081794107508a7d2783b"
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const provider = new GoogleAuthProvider();

export { auth, provider };
