import { ref, set } from "firebase/database";
import { database } from "./config";

async function writeUserData(auth) {
  const db = database;
  return await set(ref(db, 'users/' + auth.currentUser.uid), {
    uid: auth.currentUser.uid,
    name: auth.currentUser.displayName,
    email: auth.currentUser.email,
    profile_picture: auth.currentUser.photoURL
  });
}

export { writeUserData }