import {
  query,
  where,
  getDocs,
  getDoc,
  doc,
  updateDoc,
  arrayUnion,
} from "firebase/firestore";
import { db, userInfoCollection, getPersonInfo } from "./api";

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
