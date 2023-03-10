import { signInWithPopup, signOut, GoogleAuthProvider, createUserWithEmailAndPassword, signInWithEmailAndPassword } from "firebase/auth";
import { writeUserData } from "./IO";
import { deleteUser } from "firebase/auth";

// FOR LOGIN:
const signIn = async (auth, type, email = undefined, password = undefined) => {
    if (type === "GOOGLE_LOGIN" || type === "GOOGLE_SIGNUP") {

        // FOR GOOGLE LOGIN/REGISTRATION
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
                writeUserData(user.auth);
                return ["success", user];
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
                return ["failed", errorMessage];
            });
    } else if (type === "EMAIL/PASSWORD") {

        // FOR EMAIL/PASSWORD LOGIN:
        return await signInWithEmailAndPassword(auth, email, password)
            .then((userCredential) => {
                // Signed in 
                const user = userCredential.user;
                // ...
                writeUserData(user.auth);
                return ["success", user];
            })
            .catch((error) => {
                const errorCode = error.code;
                const errorMessage = error.message;
                console.log("ERROR 2", errorCode, errorMessage);
                return ["failed", errorMessage];
            });
    }
}

const signUp = async (auth, email, password, name) => {

    // FOR EMAIL/PASWORD REGISTRATION
    return await createUserWithEmailAndPassword(auth, email, password)
        .then((userCredential) => {
            // Signed in 
            let user = userCredential.user;
            // ...
            writeUserData(user.auth);
            return ["success", user];
        })
        .catch((error) => {
            const errorCode = error.code;
            const errorMessage = error.message;
            // ..
            console.log("ERROR 3", errorCode, errorMessage);
            return ["failed", errorMessage];
        });
}

// FOR LOGOUT
const logOut = async (auth) => {
    return await signOut(auth).then(() => {
        // Sign-out successful.
        auth.signOut();
    }).catch((error) => {
        // An error happened.
        console.log("ERROR 4", error);
        return error;
    });
}

const deleteAccount = async (auth) => {
    return await deleteUser(auth.currentUser).then(() => {
        // User deleted.
    }).catch((error) => {
        // An error ocurred
        console.log("ERROR 5", error);
        return error;
    });
}

export { signIn, logOut, signUp, deleteAccount }