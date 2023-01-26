import { ref, set } from "firebase/database";
import { database } from "./config";

async function writeUserData(auth) {
  const db = database;
  return await set(ref(db, 'users/' + auth.currentUsers.uid), {
    uid: auth.currentUsers.uid,
    name: auth.currentUsers.displayName,
    email: auth.currentUsers.email,
    profile_picture: auth.currentUsers.photoURL
  });
}

export { writeUserData }