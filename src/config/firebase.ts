// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider } from "firebase/auth";
import { getStorage } from "firebase/storage";
import { getFirestore } from "firebase/firestore"
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyDyhok1apHAKGE5bhR81qn8lQVJgEwMd_Q",
  authDomain: "ai-social-media-e5577.firebaseapp.com",
  projectId: "ai-social-media-e5577",
  storageBucket: "ai-social-media-e5577.appspot.com",
  messagingSenderId: "658649396473",
  appId: "1:658649396473:web:902a4602a69a3b63635e28"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const storage = getStorage(app);

export const auth = getAuth(app);
export const provider = new GoogleAuthProvider();
export const db = getFirestore(app);