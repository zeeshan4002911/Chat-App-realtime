import { ref, set, child, get } from "firebase/database";
import { database } from "./config";

const db = database;

async function writeUserData(auth) {
  return await set(ref(db, 'users/' + auth.currentUser.uid), {
    uid: auth.currentUser.uid,
    name: auth.currentUser.displayName,
    email_verified: auth.currentUser.emailVerified,
    email: auth.currentUser.email,
    profile_picture: auth.currentUser.photoURL,
  });
}

async function readUserData() {
  return await get(child(ref(db), `/users`)).then((snapshot) => {
    if (snapshot.exists()) {
      const users = snapshot.val(); // returns Object of users Object {{...}, {...}, ...}
      let arr_users = [];
      Object.keys(users).forEach(key => arr_users.push({ key: key, value: users[key] }));
      return arr_users;
    } else {
      console.log("No data available");
      return [];
    }
  }).catch((error) => {
    console.error(error);
  });
}

async function writeFriendData(auth, friend_data) {
  return await get(child(ref(db), `/friends/${auth.currentUser.uid}`)).then(async (snapshot) => {
    if (snapshot.exists()) {
      let data_array = snapshot.val();
      let friend_exists = false;
      data_array.forEach(friend => {
        if (friend.uid === friend_data.uid) {
          friend_exists = true;
          return;
        }
      })
      if (friend_exists) return console.log("friend exists");

      data_array.push(friend_data);
      await set(ref(db, `/friends/${auth.currentUser.uid}/`), data_array);
    } else {
      await set(ref(db, `/friends/${auth.currentUser.uid}/`), [friend_data]);
    }
  }).catch((error) => {
    console.error(error);
  });
}

async function readFriendData(auth) {
  return await get(child(ref(db), `/friends/${auth.currentUser?.uid}`)).then((snapshot) => {
    if (snapshot.exists()) {
      return snapshot.val();
    } else {
      console.log("No data available");
      return [];
    }
  }).catch((error) => {
    console.error(error);
  });
}


export { writeUserData, readUserData, writeFriendData, readFriendData }

// pending #rooms logic
// const uid = auth.currentUser.uid;
// const friend_uid = friend_auth.currentUser.uid;
// const id = (uid > friend_uid) ? `${uid}${friend_uid}` : `${friend_uid}${uid}`;