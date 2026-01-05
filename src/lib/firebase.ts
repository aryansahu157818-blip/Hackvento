import { initializeApp } from "firebase/app";

import {
  getAuth,
  signOut,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  onAuthStateChanged,
  User,
} from "firebase/auth";

import {
  getFirestore,
  collection,
  addDoc,
  getDocs,
  doc,
  getDoc,
  Timestamp,
} from "firebase/firestore";

// ---------- CONFIG ----------

const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: import.meta.env.VITE_FIREBASE_APP_ID,
};

const app = initializeApp(firebaseConfig);

export const auth = getAuth(app);
export const db = getFirestore(app);

// ---------- AUTH HELPERS ----------

export const signIn = (email: string, password: string) =>
  signInWithEmailAndPassword(auth, email, password);

export const signUp = (email: string, password: string) =>
  createUserWithEmailAndPassword(auth, email, password);

export const logOut = () => signOut(auth);

export const subscribeToAuth = (callback: (user: User | null) => void) =>
  onAuthStateChanged(auth, callback);

// ---------- PROJECT TYPES ----------

export interface Project {
  id?: string;
  title: string;
  githubUrl: string;
  creatorName: string;
  creatorEmail: string;
  ghostLog: string;
  vitalityScore: number;
  status: "active" | "dormant" | "haunted";
  stars?: number;
  forks?: number;
  lastUpdated?: string;
  createdAt?: Timestamp;
}

// ---------- FIRESTORE HELPERS ----------

export const addProject = async (
  project: Omit<Project, "id" | "createdAt">
) => {
  const docRef = await addDoc(collection(db, "projects"), {
    ...project,
    createdAt: Timestamp.now(),
  });

  return docRef.id;
};

export const getProjects = async (): Promise<Project[]> => {
  const snapshot = await getDocs(collection(db, "projects"));

  return snapshot.docs.map((doc) => ({
    id: doc.id,
    ...doc.data(),
  })) as Project[];
};

export const getProjectById = async (
  id: string
): Promise<Project | null> => {
  const ref = doc(db, "projects", id);
  const snap = await getDoc(ref);

  if (!snap.exists()) return null;

  return { id: snap.id, ...snap.data() } as Project;
};
