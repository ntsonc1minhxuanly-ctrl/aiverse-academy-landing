import { initializeApp } from "firebase/app";
import { 
  getFirestore, 
  collection, 
  doc, 
  getDoc, 
  getDocs, 
  setDoc, 
  query, 
  where, 
  deleteDoc 
} from "firebase/firestore";
import fs from "fs";
import path from "path";

// Load configuration from firebase-applet-config.json
let firebaseConfig: any = {};
let dbInstance: any = null;

try {
  const configPath = path.join(process.cwd(), "firebase-applet-config.json");
  if (fs.existsSync(configPath)) {
    firebaseConfig = JSON.parse(fs.readFileSync(configPath, "utf8"));
    const app = initializeApp(firebaseConfig);
    // Specify the custom databaseId from the config
    dbInstance = getFirestore(app, firebaseConfig.firestoreDatabaseId || "(default)");
    console.log("Firebase initialized successfully with config from firebase-applet-config.json");
  } else {
    console.error("firebase-applet-config.json not found in", process.cwd());
  }
} catch (error) {
  console.error("Error initializing Firebase:", error);
}

export const db = dbInstance;
export { collection, doc, getDoc, getDocs, setDoc, query, where, deleteDoc };
export const config = firebaseConfig;
