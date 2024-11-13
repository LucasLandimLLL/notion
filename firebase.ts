import { initializeApp, getApps, getApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyB9niwwiDvuMcapCNngsSxFW8y_Rav7TNg",
  authDomain: "notion-fire.firebaseapp.com",
  projectId: "notion-fire",
  storageBucket: "notion-fire.firebasestorage.app",
  messagingSenderId: "1039329000184",
  appId: "1:1039329000184:web:4ec2ab4fcd5abf418c990d"
};


const app = getApps.length === 0 ? initializeApp(firebaseConfig) : getApp ();
const db = getFirestore (app);

export { db };