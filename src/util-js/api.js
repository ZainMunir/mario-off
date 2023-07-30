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
  authDomain: "mario-off.web.app",
  projectId: "mario-off",
  storageBucket: "mario-off.appspot.com",
  messagingSenderId: "940790753598",
  appId: "1:940790753598:web:f1a676270a7d4256c9a46f",
};

const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);
export const competitionsCollection = collection(db, "competitions");
export const userInfoCollection = collection(db, "userInfo");

const auth = getAuth();

var loggedInStatus = false;
var initialised = false;
onAuthStateChanged(auth, async (user) => {
  loggedInStatus = user && true;
  initialised = true;
  window.dispatchEvent(new Event("authStateChanged"));
});

export function isLoggedIn() {
  return new Promise((resolve) => {
    if (initialised) {
      resolve(loggedInStatus);
    } else {
      window.addEventListener("authStateChanged", () => {
        resolve(loggedInStatus);
      });
    }
  });
}

export async function addNewUser(user) {
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

export async function addNewEmailUser(uid) {
  const newInfo = {
    username: "",
    profilePic: "",
    userid: uid,
    friends: [],
  };
  const docRef = await addDoc(userInfoCollection, newInfo);
  await updateDoc(docRef, {
    username: docRef.id,
  });
}

export function keepMyInfoUpdated(userId, setMyInfo) {
  const q = query(userInfoCollection, where("userid", "==", userId));
  const unsub = onSnapshot(q, (snapshot) => {
    const data = snapshot.docs.map((doc) => ({
      ...doc.data(),
    }))[0];
    setMyInfo(data);
  });
  return unsub;
}

export async function getPersonInfo(userId) {
  const q = query(userInfoCollection, where("userid", "==", userId));
  const querySnapshot = await getDocs(q);
  const dataArr = querySnapshot.docs.map((doc) => ({
    ...doc.data(),
  }));
  return dataArr[0];
}

export async function updateProfile(request) {
  try {
    if (!request.username) throw "Username needs to filled";
    if (
      request.username == request.myInfo.username &&
      request.profilePic == request.myInfo.profilePic
    )
      throw "Nothing's changed";
    const docRef = doc(db, "userInfo", request.username);
    const querySnapshot = await getDoc(docRef);
    const data = querySnapshot.data();
    if (data && data.userid != request.myInfo.userid) throw "Username taken";
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
    await setDoc(doc(db, "userInfo", newProfile.username), newProfile);
  } else {
    const docRef = doc(db, "userInfo", request.myInfo.username);
    await updateDoc(docRef, newProfile);
  }
  return null;
}
