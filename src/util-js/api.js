import { initializeApp } from "firebase/app";
import {
  getFirestore,
  collection,
  query,
  where,
  getDocs,
  getDoc,
  doc,
  addDoc,
  serverTimestamp,
  deleteDoc,
  updateDoc,
  arrayUnion,
  arrayRemove,
  setDoc,
  onSnapshot,
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
const db = getFirestore(app);
const competitionsCollection = collection(db, "competitions");
const userInfoCollection = collection(db, "userInfo");

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

export async function addFriend(username, myInfo) {
  if (username == myInfo.username) {
    throw {
      message: "That's you!",
    };
  }
  try {
    const docRef = doc(db, "userInfo", username);
    const querySnapshot = await getDoc(docRef);
    const data = querySnapshot.data();
    if (!data) {
      throw {
        message: "No user with that exact name",
      };
    }
    if (myInfo.friends.find((x) => x.userid == data.userid) != undefined) {
      throw {
        message: "Invite already sent / Friends already",
      };
    }
    await updateDoc(docRef, {
      friends: arrayUnion({
        sender: false,
        accepted: false,
        userid: myInfo.userid,
      }),
    });

    await updateDoc(doc(db, "userInfo", myInfo.username), {
      friends: arrayUnion({
        sender: true,
        accepted: false,
        userid: data.userid,
      }),
    });
  } catch (err) {
    throw err;
  }
}

export async function getActualFriends(myInfo) {
  const friendIDs = myInfo.friends
    .filter((friend) => friend.accepted)
    .map((x) => x.userid);
  if (!friendIDs.length) return;
  const q = await query(userInfoCollection, where("userid", "in", friendIDs));
  const querySnapshot = await getDocs(q);
  const dataArr = querySnapshot.docs.map((doc) => ({
    ...doc.data(),
    id: doc.id,
  }));
  return dataArr || [];
}

export async function getFriends(myInfo) {
  const friendIDs = myInfo.friends.map((x) => x.userid);
  if (!friendIDs.length) return;
  const q = await query(userInfoCollection, where("userid", "in", friendIDs));
  const querySnapshot = await getDocs(q);
  const dataArr = querySnapshot.docs.map((doc) => ({
    ...doc.data(),
    id: doc.id,
  }));
  return dataArr || [];
}

export async function acceptFriend(request, myInfo) {
  let myFriends = myInfo.friends.map((x) => {
    if (x.userid == request.userid) {
      return {
        ...x,
        accepted: true,
      };
    }
    return x;
  });
  let theirFriends = request.friends.map((x) => {
    if (x.userid == myInfo.userid) {
      return {
        ...x,
        accepted: true,
      };
    }
    return x;
  });
  try {
    await updateDoc(doc(db, "userInfo", myInfo.username), {
      friends: myFriends,
    });
    await updateDoc(doc(db, "userInfo", request.username), {
      friends: theirFriends,
    });
    myInfo = await getPersonInfo(myInfo.userid);
  } catch (err) {
    throw err;
  }
  return null;
}

export async function rejectFriend(request, myInfo) {
  let myFriends = myInfo.friends.filter((x) => x.userid != request.userid);
  let theirFriends = request.friends.filter((x) => x.userid != myInfo.userid);
  try {
    await updateDoc(doc(db, "userInfo", myInfo.username), {
      friends: myFriends,
    });
    await updateDoc(doc(db, "userInfo", request.username), {
      friends: theirFriends,
    });
    myInfo = await getPersonInfo(myInfo.userid);
  } catch (err) {
    throw err;
  }
  return null;
}

const emptyRound = {
  valid: false,
  winner: "",
  nestedRounds: [],
};

export async function keepCompetitionsUpdated(myInfo, setCompetitions) {
  const q = await query(
    competitionsCollection,
    where("players", "array-contains", myInfo.userid)
  );
  const unsub = await onSnapshot(q, (snapshot) => {
    const dataArr = snapshot.docs.map((doc) => ({
      ...doc.data(),
      id: doc.id,
    }));
    setCompetitions(dataArr);
  });
}

export async function getCompetition(compid) {
  const docRef = doc(db, "competitions", compid);
  const querySnapshot = await getDoc(docRef);
  if (querySnapshot.data()) {
    return {
      ...querySnapshot.data(),
      id: querySnapshot.id,
    };
  }
  throw {
    message: "Competition not found",
    statusText: "Error",
    status: 404,
  };
}

export async function addCompetition(request, myInfo) {
  const newComp = {
    name: request.name,
    image: request.image,
    players: [myInfo.userid, request.player],
    creationDate: serverTimestamp(),
    updatedDate: serverTimestamp(),
    description: "",
    rules: [],
    status: "ongoing",
    currentScore: [0, 0],
    winner: "draw",
    rounds: [emptyRound],
  };
  const compRef = await addDoc(competitionsCollection, newComp);
  return compRef.id;
}

export async function deleteCompetition(id) {
  const docRef = doc(db, "competitions", id);
  await deleteDoc(docRef);
}

export async function updateCompetition(request) {
  const docRef = doc(db, "competitions", request.id);
  await updateDoc(
    docRef,
    {
      name: request.name,
      image: request.image,
      status: request.status,
      description: request.description,
      updatedDate: serverTimestamp(),
    },
    { merge: true }
  );
}

export async function addRule(request) {
  const docRef = doc(db, "competitions", request.id);
  await updateDoc(docRef, {
    rules: arrayUnion(request.rule),
    updatedDate: serverTimestamp(),
  });
}

export async function deleteRule(request) {
  const docRef = doc(db, "competitions", request.id);
  await updateDoc(docRef, {
    rules: arrayRemove(request.rule),
    updatedDate: serverTimestamp(),
  });
}

export async function addRound(id) {
  const docRef = doc(db, "competitions", id);
  await updateDoc(docRef, {
    rounds: arrayUnion(emptyRound),
    updatedDate: serverTimestamp(),
  });
}

export async function deleteRound(request) {
  const docRef = doc(db, "competitions", request.id);
  await updateDoc(docRef, {
    rounds: arrayRemove(request.round),
    updatedDate: serverTimestamp(),
  });
}

export async function updateRounds(request) {
  const docRef = doc(db, "competitions", request.id);
  const { rounds, score } = calcScore(request.rounds, request.players);
  const winner =
    score[0] > score[1]
      ? request.players[0]
      : score[1] > score[0]
      ? request.players[1]
      : "draw";
  await updateDoc(docRef, {
    rounds: rounds,
    currentScore: score,
    winner: winner,
    updatedDate: serverTimestamp(),
  });
}

function calcScore(rounds, players) {
  let overallScore = [0, 0];
  const newRounds = [...rounds];
  for (let j = 0; j < newRounds.length; j++) {
    let score = [0, 0];
    newRounds[j].nestedRounds;
    for (let i = 0; i < newRounds[j].nestedRounds.length; i++) {
      if (newRounds[j].nestedRounds[i].player == players[0])
        score[0] += parseInt(newRounds[j].nestedRounds[i].points);
      else if (newRounds[j].nestedRounds[i].player == players[1])
        score[1] += parseInt(newRounds[j].nestedRounds[i].points);
      else {
        score[0] += parseInt(newRounds[j].nestedRounds[i].points);
        score[1] += parseInt(newRounds[j].nestedRounds[i].points);
      }
    }
    if (score[0] > score[1]) {
      newRounds[j].winner = players[0];
      if (!newRounds[j].valid) break;
      overallScore[0]++;
    } else if (score[0] < score[1]) {
      newRounds[j].winner = players[1];
      if (!newRounds[j].valid) break;
      overallScore[1]++;
    } else {
      newRounds[j].winner = "draw";
      if (!newRounds[j].valid) break;
      overallScore[0]++;
      overallScore[1]++;
    }
  }
  return { rounds: newRounds, score: overallScore };
}
