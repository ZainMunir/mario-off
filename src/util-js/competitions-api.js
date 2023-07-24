import {
  query,
  where,
  getDoc,
  doc,
  addDoc,
  serverTimestamp,
  deleteDoc,
  updateDoc,
  arrayUnion,
  arrayRemove,
  onSnapshot,
  getDocs,
  or,
  and,
} from "firebase/firestore";
import { competitionsCollection, db, getPersonInfo } from "./api";
import { data } from "autoprefixer";
import { FaZhihu } from "react-icons/fa";

const emptyRound = {
  valid: false,
  winner: "draw",
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
  await updateDoc(docRef, {
    name: request.name,
    image: request.image,
    status: request.status,
    description: request.description,
    updatedDate: serverTimestamp(),
  });
  await calcFriendScore(docRef);
}

async function calcFriendScore(docRef) {
  const result = await getDoc(docRef);
  const players = result.data().players;
  const q = query(
    competitionsCollection,
    or(
      and(where("players", "==", players), where("status", "==", "complete")),
      and(
        where("players", "==", [players[1], players[0]]),
        where("status", "==", "complete")
      )
    )
  );
  const querySnapshot = await getDocs(q);
  const dataArr = querySnapshot.docs.map((doc) => ({
    ...doc.data(),
  }));
  const wins = [0, 0];

  for (let i = 0; i < dataArr.length; i++) {
    if (dataArr[i].winner == players[0]) {
      wins[0]++;
    } else if (dataArr[i].winner == players[1]) {
      wins[1]++;
    } else {
      wins[0]++;
      wins[1]++;
    }
  }
  const info0 = await getPersonInfo(players[0]);
  const info1 = await getPersonInfo(players[1]);

  let unnecessary = false;

  let friends0 = info0.friends.map((x) => {
    if (x.userid == info1.userid) {
      if (x.score[0] == wins[0] && x.score[1] == wins[1]) unnecessary = true;
      return {
        ...x,
        score: wins,
      };
    }
    return x;
  });

  if (unnecessary) {
    return null;
  }

  let friends1 = info1.friends.map((x) => {
    if (x.userid == info0.userid) {
      return {
        ...x,
        score: [wins[1], wins[0]],
      };
    }
    return x;
  });

  try {
    await updateDoc(doc(db, "userInfo", info0.username), {
      friends: friends0,
    });
    await updateDoc(doc(db, "userInfo", info1.username), {
      friends: friends1,
    });
  } catch (err) {
    throw err;
  }

  return null;
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
      if (!newRounds[j].valid) continue;
      overallScore[0]++;
    } else if (score[0] < score[1]) {
      newRounds[j].winner = players[1];
      if (!newRounds[j].valid) continue;
      overallScore[1]++;
    } else {
      newRounds[j].winner = "draw";
      if (!newRounds[j].valid) continue;
      overallScore[0]++;
      overallScore[1]++;
    }
  }
  return { rounds: newRounds, score: overallScore };
}
