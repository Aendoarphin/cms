import { Firestore, deleteDoc, setDoc, getDoc, doc } from "firebase/firestore";

interface UserData {
  userId: string,
  userName: string,
  userPw: string,
  userEmail: string,
  userRole: string,
}

interface NewUserData {
  userId?: string,
  userName: string,
  userPw: string,
  userEmail: string,
  userRole: string,
}

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
  data: NewUserData
) => {
  try {
    const userRef = doc(db, docPath, docId);
    await setDoc(userRef, data, { merge: true });
    console.log("User updated.")
  } catch (error) {
    console.error("Error updating user:", error);
  }
};

const deleteUser = async (db: Firestore, docPath: string, docId: string) => {
  const docRef = doc(db, docPath, docId);
  const docSnap = await getDoc(docRef);
  if (docSnap.exists()) {
    await deleteDoc(docRef);
    return `User ${docId} deleted.`
  } else {
    return "User does not exist. Nothing to delete."
  }
};

export { getUser, setUser, deleteUser };
