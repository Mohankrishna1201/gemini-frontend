


import { initializeApp } from "firebase/app";
import { createContext, useContext, useState, useEffect } from "react";
import { getAuth, createUserWithEmailAndPassword, signInWithEmailAndPassword, signInWithPopup, GoogleAuthProvider, onAuthStateChanged, } from 'firebase/auth'
import { FacebookAuthProvider, signOut } from "firebase/auth";
import { getFirestore, collection, addDoc, doc, setDoc, getDocs, query, where, updateDoc, deleteDoc } from "firebase/firestore";
import { getStorage, ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { getMessaging, getToken } from "firebase/messaging";
import { serverTimestamp } from "firebase/firestore";
import { sendPasswordResetEmail } from "firebase/auth";
const FirebaseContext = createContext(null);

const firebaseConfig = {
    apiKey: "AIzaSyDp8NO5qjLsMTMcv4mn2tHZdsj1myu5FDU",
    authDomain: "ai-companion-f6ba8.firebaseapp.com",
    projectId: "ai-companion-f6ba8",
    storageBucket: "ai-companion-f6ba8.appspot.com",
    messagingSenderId: "1083503670679",
    appId: "1:1083503670679:web:37ea6082621d55f999c0d2",
    measurementId: "G-5Z1FYYVSHN"
};


const Googleprovider = new GoogleAuthProvider();
const Facebookprovider = new FacebookAuthProvider();

export const useFirebase = () => {
    return useContext(FirebaseContext);
};

const firebaseApp = initializeApp(firebaseConfig);
const firestore = getFirestore(firebaseApp);
const storage = getStorage(firebaseApp);
const messaging = getMessaging(firebaseApp);
export const FirebaseProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const firebaseAuth = getAuth(firebaseApp)
    useEffect(() => {
        onAuthStateChanged(firebaseAuth, (user) => {
            if (user) setUser(user);
            else setUser(null);
            // console.log(user);
        })
    }, []);
    const currentUser = user;
    const UserLogout = async () => {
        await signOut(firebaseAuth);
        setUser(null);
    };
    const UserSignUpwithEmailandPassword = (email, password) => {
        return createUserWithEmailAndPassword(firebaseAuth, email, password);
    };

    const UserLoginwithEmailandPassword = (email, password) => {
        return signInWithEmailAndPassword(firebaseAuth, email, password);
    };

    const UserLoginGoogle = () => {
        return signInWithPopup(firebaseAuth, Googleprovider);

    }
    const sendPasswordReset = (email) => {
        return sendPasswordResetEmail(firebaseAuth, email);
    };
    const UserLoginFacebook = () => {
        return signInWithPopup(firebaseAuth, Facebookprovider);

    }
    const isLoggedIn = user ? true : false;


    let userNotificationStatus = null;
    // Import necessary Firestore methods

    const getAllUsers = async () => {
        try {
            const usersCollection = collection(firestore, 'users'); // Correct usage
            const snapshot = await getDocs(usersCollection);
            return snapshot.docs.map((doc) => doc.data());
        } catch (error) {
            console.error("Error fetching users: ", error);
            return [];
        }
    };


    const getUserToken = async () => {
        const permission = await Notification.requestPermission();
        console.log(permission);

        if (permission === 'granted') {
            const token = await getToken(messaging, {
                vapidKey: "BAoso2-qdps0oE91AW2mgtii0-Xr0OCtFPqqOSBTsMw2MZrPQwcjPZ1JJ_ZCDZR3KKy-w-u-n9BaIkr-6UF8VFk"
            });
            console.log(token);

            if (token) {
                return token;
            }
        } else {
            userNotificationStatus = 'denied'; // Set variable value if permission is not granted
        }
    };

    const handleToken = async () => {
        if (!currentUser) {
            console.error('Current user is null. Please register to get a token.');
            return;
        }

        // Try to get the notification token, but don't block the chat connection if it fails
        const token = await getUserToken();
        if (token) {
            const userTokenDocRef = doc(firestore, `tokens/${currentUser.uid}`);
            try {
                await setDoc(userTokenDocRef, {
                    userToken: token,
                    userID: currentUser.uid,
                }, { merge: true });
                console.log('Token successfully saved for the user.', token);
            } catch (error) {
                console.error('Error saving token:', error);
            }
        } else {
            console.warn('Skipping token save as notifications are not granted.');
        }
    };

    const DataOfUserTokens = [];

    const getSavedToken = async () => {
        try {
            const userTokens = await getDocs(collection(firestore, `tokens`));
            const BigParent = userTokens.docs;

            for (let snapshot of BigParent) {
                // Extract data from QueryDocumentSnapshot objects
                const token = snapshot.data();

                // Check if the token already exists in DataOfUserTokens
                const exists = DataOfUserTokens.some(
                    item => item.savedToken === token.userToken && item.savedUserID === token.userID
                );

                if (!exists) {
                    DataOfUserTokens.push({
                        savedToken: token.userToken,
                        savedUserID: token.userID
                    });
                }
            }

            console.log('here!');
            // console.log(DataOfUserTokens);
        } catch (error) {
            console.error("Error getting tokens: ", error);
        }
    };



    const getUser = () => {

        return getDocs(collection(firestore, 'users'));
    }

    const getImageUrl = (path) => {
        return getDownloadURL(ref(storage, path));
    }



    const getUserDetails = async () => {
        if (!currentUser) {
            console.error('Current user is null.');
            return null;
        }
        const token = await getUserToken();
        console.log('check here', token, currentUser.email)
        return {
            name: currentUser.displayName
                ? currentUser.displayName
                : currentUser.email.substring(0, 8), // Use first 8 characters of email if displayName is not available
            userID: currentUser.uid,
            userToken: token,
            userEmail: currentUser.email,
            userImg: currentUser.photoURL
                ? currentUser.photoURL
                : "https://cdn.dribbble.com/userupload/16878194/file/original-3aaaac02f0527ee30cb5f47dd44394d1.png?resize=752x752", // Provide a default image if photoURL is not available
        };

    };

    // Import serverTimestamp




    const handleQuiz = async (quizMarks, length) => {
        if (!currentUser) {
            console.error('Current user is null.');
            return;
        }

        // Create a document reference for the current user
        const userDocRef = doc(firestore, 'quizMarks', currentUser.uid);

        // Reference a sub-collection under the current user's document
        const quizzesCollectionRef = collection(userDocRef, 'quizzes');

        // Add a new document with an auto-generated ID for each quiz attempt
        await addDoc(quizzesCollectionRef, {
            score: quizMarks,
            total: length,
            timestamp: serverTimestamp() // Store server timestamp to differentiate quiz submissions
        });
    };
    const displayUserQuizMarks = async () => {
        // if (!currentUser) {
        //     console.error('Current user is null.');
        //     return;
        // }

        // Reference the current user's quizzes sub-collection
        const userQuizzesCollectionRef = collection(firestore, 'quizMarks', userId, 'quizzes');

        try {
            // Fetch all quizzes for the current user
            const querySnapshot = await getDocs(userQuizzesCollectionRef);
            const quizzesScores = querySnapshot.docs.map(doc => doc.data());

            // Log or display the quizzes as needed
            console.log("User's quizzes:", quizzesScores);
            return quizzesScores; // You can return this if you need to display it in the UI
        } catch (error) {
            console.error("Error fetching user quizzes:", error);
        }
    };

    const userId = localStorage.getItem("userID");
    console.log(userId);


    // Function to handle storing quizzes specific to a user
    const handleQuizzes = async (quizzes) => {
        if (!currentUser) {
            console.error('Current user is null.');
            return;
        }

        if (!Array.isArray(quizzes) || quizzes.length === 0) {
            console.error('Invalid quizzes data or empty array:', quizzes);
            return;
        }

        // Create a reference to the current user's quizzes sub-collection
        const userQuizzesCollectionRef = collection(firestore, 'quizzess', currentUser.uid, 'userQuizzes');

        for (const quiz of quizzes) {
            // Ensure that each quiz object has the correct structure
            if (quiz && quiz.question && quiz.correctAnswer) {
                const quizData = {
                    question: quiz.question,
                    correctAnswer: quiz.correctAnswer,
                    createdBy: userId,  // Store the user's ID who created the quiz
                    createdAt: serverTimestamp() // Store Firestore server timestamp
                };

                try {
                    // Add the quiz to the user's sub-collection
                    await addDoc(userQuizzesCollectionRef, quizData);
                    console.log("Quiz question added successfully:", quizData);
                } catch (error) {
                    console.error("Error adding quiz question:", error);
                }
            } else {
                console.error("Quiz object missing required properties:", quiz);
            }
        }
    };

    // Function to retrieve and display quizzes for the current user
    const displayUserQuizzes = async () => {
        // if (!currentUser) {
        //     console.error('Current user is null.');
        //     return;
        // }

        // Reference the current user's quizzes sub-collection
        const userQuizzesCollectionRef = collection(firestore, 'quizzess', userId, 'userQuizzes');

        try {
            // Fetch all quizzes for the current user
            const querySnapshot = await getDocs(userQuizzesCollectionRef);
            const quizzesScores = querySnapshot.docs.map(doc => doc.data());

            // Log or display the quizzes as needed
            console.log("User's quizzes:", quizzesScores);
            return quizzesScores; // You can return this if you need to display it in the UI
        } catch (error) {
            console.error("Error fetching user quizzes:", error);
        }
    };


    return (
        <FirebaseContext.Provider value={{ UserSignUpwithEmailandPassword, UserLoginwithEmailandPassword, UserLoginGoogle, UserLoginFacebook, isLoggedIn, UserLogout, currentUser, getUser, getImageUrl, getUserToken, messaging, handleToken, getSavedToken, getUserDetails, sendPasswordReset, userNotificationStatus, getAllUsers, addDoc, handleQuiz, handleQuizzes, displayUserQuizzes, displayUserQuizMarks }}>
            {children}
        </FirebaseContext.Provider>
    );
};