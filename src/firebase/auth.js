import { signInWithPopup, signOut, GoogleAuthProvider, createUserWithEmailAndPassword, signInWithEmailAndPassword } from "firebase/auth";
import { writeUserData } from "./IO";

const signIn = async (auth, type, email = undefined, password = undefined) => {
    if (type === "GOOGLE") {
        const provider = new GoogleAuthProvider(auth);
        return await signInWithPopup(auth, provider)
            .then((result) => {
                // This gives you a Google Access Token. You can use it to access the Google API.
                const credential = GoogleAuthProvider.credentialFromResult(result);
                const token = credential.accessToken;
                // The signed-in user info.
                const user = result.user;
                // ...
                console.log("Google tokken:", token);
                return user;
            }).catch((error) => {
                // Handle Errors here.
                const errorCode = error.code;
                const errorMessage = error.message;
                // The email of the user's account used.
                const email = error?.customData?.email;
                // The AuthCredential type that was used.
                const credential = GoogleAuthProvider.credentialFromError(error);
                // ...
                console.log("ERROR 1", errorCode, errorMessage, email, credential);
            });
    } else if (type === "EMAIL/PASSWORD") {
        return await signInWithEmailAndPassword(auth, email, password)
            .then((userCredential) => {
                // Signed in 
                const user = userCredential.user;
                // ...
                return user;
            })
            .catch((error) => {
                const errorCode = error.code;
                const errorMessage = error.message;
                console.log("ERROR 2", errorCode, errorMessage);
            });
    }
}

const signUp = async (auth, email, password) => {
    return await createUserWithEmailAndPassword(auth, email, password)
        .then((userCredential) => {
            // Signed in 
            const user = userCredential.user;
            // ...
            return user;
        })
        .catch((error) => {
            const errorCode = error.code;
            const errorMessage = error.message;
            // ..
            console.log("ERROR 3", errorCode, errorMessage);
        });
}

const logOut = async (auth) => {
    return await signOut(auth).then(() => {
        // Sign-out successful.
        auth.signOut();
        console.log(auth)    
    }).catch((error) => {
        // An error happened.
        console.log("ERROR 4", error);
    });
}
export { signIn, logOut, signUp }


// pending

// import { getAuth, onAuthStateChanged } from "firebase/auth";

// const auth = getAuth();
// onAuthStateChanged(auth, (user) => {
//   if (user) {
//     // User is signed in, see docs for a list of available properties
//     // https://firebase.google.com/docs/reference/js/firebase.User
//     const uid = user.uid;
//     // ...
//   } else {
//     // User is signed out
//     // ...
//   }
// });