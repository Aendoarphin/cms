import { Firestore, deleteDoc, setDoc, getDoc, doc } from "firebase/firestore";
import { json } from "stream/consumers";

interface UserData {
  userId: string,
  userName: string,
  userPw: string,
  userEmail: string,
  userRole: string,
}

const addUser = async (db: Firestore, collPath: string, data: UserData) => {
  const userRef = doc(db, collPath, data.userId);
  const userSnap = await getDoc(userRef);
  if (!userSnap.exists()) {
    await setDoc(userRef, data);
  } else {
    console.log("User already exists. Nothing to add.")
  }
};

const getUser = async (db: Firestore, docPath: string, docId: string) => {
  const docRef = doc(db, docPath, docId);
  const docSnap = await getDoc(docRef);
  if (docSnap.exists()) {
    console.log(docSnap.data())
    return docSnap.data();
  } else {
    console.log("User does not exist.")
    return null;
  }
};

const setUser = async (
  db: Firestore,
  docPath: string,
  docId: string,
  data: UserData
) => {
  try {
    const userRef = doc(db, docPath, docId);
    await setDoc(userRef, data, { merge: true });
  } catch (error) {
    console.error(error);
  }
};

const deleteUser = async (db: Firestore, docPath: string, docId: string) => {
  const userRef = doc(db, docPath, docId);
  const userSnap = await getDoc(userRef);
  if (userSnap.exists()) {
    await deleteDoc(userRef);
  } else {
    console.log("User does not exist. Nothing to delete.")
  }
};

export { addUser, getUser, setUser, deleteUser };
