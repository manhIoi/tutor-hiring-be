import { getStorage, ref } from "firebase/storage";
import { initializeApp } from "firebase/app";

const firebaseConfig = {
  apiKey: "AIzaSyCsA2Iho3wsuc4bcUCn5-Jj0pgPbf2DPEk",
  authDomain: "tutor-firebase-1353f.firebaseapp.com",
  projectId: "tutor-firebase-1353f",
  storageBucket: "tutor-firebase-1353f.appspot.com",
  messagingSenderId: "784976831851",
  appId: "1:784976831851:web:cff7587837d2e764e9582e",
};

// Initialize Firebase
initializeApp(firebaseConfig);
const storage = getStorage();
export { storage, ref };
