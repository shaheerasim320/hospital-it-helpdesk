import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getAnalytics } from "firebase/analytics";
import { getStorage } from "firebase/storage";

const firebaseConfig = {
  apiKey: "AIzaSyCVEQgayzqTuRQmYEG7mEQ9D-1pngaJdcI",
  authDomain: "hospital-it-help-desk.firebaseapp.com",
  projectId: "hospital-it-help-desk",
  storageBucket: "hospital-it-help-desk.firebasestorage.app",
  messagingSenderId: "520614879541",
  appId: "1:520614879541:web:901e7609a938f7b799ec7c",
  measurementId: "G-279JQVS0PL"
};

const app = initializeApp(firebaseConfig);

let analytics;
if (typeof window !== "undefined") {
  analytics = getAnalytics(app);
}

export const auth = getAuth(app);
export const db = getFirestore(app);
export const storage = getStorage(app);
