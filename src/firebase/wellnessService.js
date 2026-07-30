import { db, storage } from "./firebase";

import {
  ref,
  uploadBytes,
  getDownloadURL,
} from "firebase/storage";

import {
  collection,
  addDoc,
  getDocs,
  query,
  orderBy,
  serverTimestamp,
} from "firebase/firestore";

const COLLECTION = "wellnessVideos";

export const uploadWellnessVideo = async (file) => {
  const fileName = `${Date.now()}-${file.name}`;

  const storageRef = ref(storage, `wellnessVideos/${fileName}`);

  await uploadBytes(storageRef, file);

  const videoURL = await getDownloadURL(storageRef);

  await addDoc(collection(db, COLLECTION), {
    title: file.name.replace(/\.[^/.]+$/, ""),
    description: "Uploaded webinar",
    category: "Mental Health",
    duration: "--",
    thumbnail:
      "https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=900",
    video: videoURL,
    createdAt: serverTimestamp(),
  });
};

export const getWellnessVideos = async () => {
  const q = query(
    collection(db, COLLECTION),
    orderBy("createdAt", "desc")
  );

  const snapshot = await getDocs(q);

  return snapshot.docs.map((doc) => ({
    id: doc.id,
    ...doc.data(),
  }));
};