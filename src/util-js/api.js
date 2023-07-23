import { initializeApp } from "firebase/app";
import {
  getFirestore,
  collection,
  query,
  where,
  getDocs,
  getDoc,
  doc,
  deleteDoc,
  setDoc,
  onSnapshot,
  addDoc,
  updateDoc,
} from "firebase/firestore";
import { getAuth, onAuthStateChanged } from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyBmBIk0-qSvkGSUSAs46Uxsw4mRtbrxinI",
  authDomain: "mario-off.firebaseapp.com",
  projectId: "mario-off",
  storageBucket: "mario-off.appspot.com",
  messagingSenderId: "940790753598",
  appId: "1:940790753598:web:f1a676270a7d4256c9a46f",
};

const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);
export const competitionsCollection = collection(db, "competitions");
export const userInfoCollection = collection(db, "userInfo");

export const auth = getAuth();

var loggedInStatus = false;

onAuthStateChanged(auth, async (user) => {
  if (user) {
    loggedInStatus = true;
  } else {
    loggedInStatus = false;
  }
});

export async function isLoggedIn() {
  return loggedInStatus;
}

export async function addNewUser(user) {
  console.log(user);
  const newInfo = {
    username: "",
    profilePic: user.photoURL,
    userid: user.uid,
    friends: [],
  };
  const docRef = await addDoc(userInfoCollection, newInfo);
  await updateDoc(docRef, {
    username: docRef.id,
  });
}

export async function keepMyInfoUpdated(userId, setMyInfo) {
  const q = query(userInfoCollection, where("userid", "==", userId));
  const unsub = await onSnapshot(q, (snapshot) => {
    const data = snapshot.docs.map((doc) => ({
      ...doc.data(),
    }))[0];
    setMyInfo(data);
  });
}

export async function getPersonInfo(userId) {
  const q = await query(userInfoCollection, where("userid", "==", userId));
  const querySnapshot = await getDocs(q);
  const dataArr = querySnapshot.docs.map((doc) => ({
    ...doc.data(),
  }));
  return dataArr[0];
}

export async function updateProfile(request) {
  try {
    const docRef = doc(db, "userInfo", request.username);
    const querySnapshot = await getDoc(docRef);
    const data = querySnapshot.data();
    if (data) {
      if (data.userid != request.myInfo.userid) {
        return "Username taken";
      }
    }
  } catch (err) {
    return err;
  }
  const newProfile = {
    ...request.myInfo,
    username: request.username,
    profilePic: request.profilePic,
  };
  if (request.myInfo.username != newProfile.username) {
    const docRef = doc(db, "userInfo", request.myInfo.username);
    await deleteDoc(docRef);
  }
  await setDoc(doc(db, "userInfo", newProfile.username), newProfile);
  return null;
}
