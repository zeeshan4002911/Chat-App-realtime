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

async function deleteUserData(auth) {
  return await set(ref(db, 'users/' + auth.currentUser?.uid), null);
}

async function writeFriendData(currentUser, friend_data) {
  return await get(child(ref(db), `/friends/${currentUser.uid}`)).then(async (snapshot) => {
    if (snapshot.exists()) {
      let data_array = snapshot.val();
      let friend_exists = false;
      data_array.forEach(friend => {
        if (friend.uid === friend_data.uid) {
          friend_exists = true;
          return;
        }
      })
      if (friend_exists) return ("exists");

      data_array.push(friend_data);
      await set(ref(db, `/friends/${currentUser.uid}/`), data_array);
    } else {
      await set(ref(db, `/friends/${currentUser.uid}/`), [friend_data]);
    }
    return "success";
  }).catch((error) => {
    console.error(error);
    return error;
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

async function writeMessageData(user_uid, friend_uid, new_mesage) {
  const room_id = (user_uid > friend_uid) ? `${user_uid}&${friend_uid}` : `${friend_uid}&${user_uid}`;
  return await get(child(ref(db), `rooms/${room_id}`)).then(async (snapshot) => {
    if (snapshot.exists()) {
      let message_array = snapshot.val();
      message_array.push(new_mesage);
      await set(ref(db, `rooms/${room_id}/`), message_array);
    } else {
      await set(ref(db, `rooms/${room_id}/`), [new_mesage]);
    }
    return "success";
  }).catch((error) => {
    console.error(error);
    return error;
  });
}

export { writeUserData, readUserData, deleteUserData, writeFriendData, readFriendData, writeMessageData };