import { collection, Firestore, addDoc, getDoc } from "firebase/firestore";

const createCollection = async (db: Firestore, collectionName: string, document: object) => {
  try {
    const colRef = collection(db, collectionName);
    await addDoc(colRef, document); // Try to add a document to the collection
    console.log(`Collection '${collectionName}' created successfully.`);
  } catch (e) {
    console.log("Error creating collection: ", e);
  }
}



export { createCollection }