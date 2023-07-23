import {
  query,
  where,
  getDocs,
  getDoc,
  doc,
  updateDoc,
  arrayUnion,
  onSnapshot,
} from "firebase/firestore";
import { db, userInfoCollection, getPersonInfo } from "./api";

export async function addFriend(username, myInfo) {
  try {
    if (!username) {
      throw "Please enter something";
    }
    if (username == myInfo.username) {
      throw "That's you!";
    }
    const docRef = doc(db, "userInfo", username);
    const querySnapshot = await getDoc(docRef);
    const data = querySnapshot.data();
    if (!data) {
      throw "No user with that exact name";
    }
    if (myInfo.friends.find((x) => x.userid == data.userid) != undefined) {
      throw "Invite already sent / Friends already";
    }
    await updateDoc(docRef, {
      friends: arrayUnion({
        sender: false,
        accepted: false,
        userid: myInfo.userid,
        score: [0, 0],
      }),
    });

    await updateDoc(doc(db, "userInfo", myInfo.username), {
      friends: arrayUnion({
        sender: true,
        accepted: false,
        userid: data.userid,
        score: [0, 0],
      }),
    });
    return null;
  } catch (err) {
    return err;
  }
}

export async function getActualFriends(myInfo, setFriendsInfo) {
  const friendIDs = myInfo.friends
    .filter((friend) => friend.accepted)
    .map((x) => x.userid);
  if (!friendIDs.length) return;
  const q = await query(userInfoCollection, where("userid", "in", friendIDs));
  const unsub = await onSnapshot(q, (snapshot) => {
    const dataArr = snapshot.docs.map((doc) => ({
      ...doc.data(),
    }));
    setFriendsInfo(dataArr);
  });
}

export async function getFriends(myInfo, setFriendsInfo) {
  const friendIDs = myInfo.friends.map((x) => x.userid);
  if (!friendIDs.length) return;
  const q = await query(userInfoCollection, where("userid", "in", friendIDs));
  const unsub = await onSnapshot(q, (snapshot) => {
    const dataArr = snapshot.docs.map((doc) => ({
      ...doc.data(),
    }));
    setFriendsInfo(dataArr);
  });
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
    await updateDoc(doc(db, "userInfo", request.username), {
      friends: theirFriends,
    });
    await updateDoc(doc(db, "userInfo", myInfo.username), {
      friends: myFriends,
    });
  } catch (err) {
    throw err;
  }
  return null;
}

export async function deleteFriend(request, myInfo) {
  let myFriends = myInfo.friends.filter((x) => x.userid != request.userid);
  let theirFriends = request.friends.filter((x) => x.userid != myInfo.userid);
  try {
    await updateDoc(doc(db, "userInfo", request.username), {
      friends: theirFriends,
    });
    await updateDoc(doc(db, "userInfo", myInfo.username), {
      friends: myFriends,
    });
  } catch (err) {
    throw err;
  }
  return null;
}
