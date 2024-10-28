import { collection, Firestore, addDoc, setDoc, getDoc } from "firebase/firestore";

const createCollection = (db: Firestore, collectionName: string, data: Object = {}) => {
  try {
    const newCollection = addDoc(collection(db, collectionName), data);
    return newCollection;
  } catch (e) {
    console.log("Error creating collection: ", e);
  }
}

export default createCollection;