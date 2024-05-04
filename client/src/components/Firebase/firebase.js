// Import the functions needed from the Firebase SDKs
import {initializeApp} from 'firebase/app';
import {
  getAuth,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  sendPasswordResetEmail,
  updatePassword,
} from 'firebase/auth';

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: 'AIzaSyCAtGY4C4HiB2fBgylDBM74TCx3sBHrIlI',
  authDomain: 'msci-342-800d6.firebaseapp.com',
  projectId: 'msci-342-800d6',
  storageBucket: 'msci-342-800d6.appspot.com',
  messagingSenderId: '520456439444',
  appId: '1:520456439444:web:006bb5f309861fe7639681',
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

class Firebase {
  constructor() {
    this.auth = getAuth(app);
  }

  // *** Auth API ***
  doCreateUserWithEmailAndPassword = (email, password) =>
    createUserWithEmailAndPassword(this.auth, email, password);

  doSignInWithEmailAndPassword = (email, password) =>
    signInWithEmailAndPassword(this.auth, email, password);

  doSignOut = () => signOut(this.auth);

  doPasswordReset = email => sendPasswordResetEmail(this.auth, email);

  doPasswordUpdate = password =>
    updatePassword(this.auth.currentUser, password);

  // Function to get ID Token of the currently signed-in user
  doGetIdToken = () => {
    return new Promise((resolve, reject) => {
      const user = this.auth.currentUser;
      if (user) {
        user
          .getIdToken()
          .then(token => {
            resolve(token);
          })
          .catch(error => {
            reject(error);
          });
      } else {
        reject(new Error('No user is signed in.'));
      }
    });
  };
}

export default Firebase;
