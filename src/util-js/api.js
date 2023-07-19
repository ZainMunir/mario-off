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
    arrayRemove
} from "firebase/firestore"

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
const competitionsCollection = collection(db, "competitions")


const emptyRound = {
    valid: false,
    winner: "",
    nestedRounds: []
}

export async function loginUser(creds) {
    const valid = {
        email: "1@mario.com",
        password: "p123"
    }

    if (creds.email != valid.email || creds.password != valid.password) {
        throw {
            message: "Wrong email or password",
            statusText: "Error",
            status: 401
        }
    }
    return {
        userId: "zain"
    }
}

export async function getCompetitions(userid) {
    const q = await query(competitionsCollection, where('players', 'array-contains', userid))
    const querySnapshot = await getDocs(q);
    const dataArr = querySnapshot.docs.map(doc => ({
        ...doc.data(),
        id: doc.id
    }))
    return dataArr;
}

export async function getCompetition(compid) {
    const docRef = doc(db, "competitions", compid)
    const querySnapshot = await getDoc(docRef)
    if (querySnapshot.data()) {
        return {
            ...querySnapshot.data(),
            id: querySnapshot.id
        }
    }
    throw {
        message: "Competition not found",
        statusText: "Error",
        status: 404
    }
}

export async function addCompetition(request) {
    const newComp = {
        ...request,
        creationDate: serverTimestamp(),
        updatedDate: serverTimestamp(),
        description: "",
        rules: [],
        status: "ongoing",
        currentScore: [0, 0],
        winner: "draw",
        rounds: [emptyRound]
    }
    const compRef = await addDoc(competitionsCollection, newComp)
    return compRef.id
}

export async function deleteCompetition(id) {
    const docRef = doc(db, "competitions", id)
    await deleteDoc(docRef)
}

export async function updateCompetition(request) {
    const docRef = doc(db, "competitions", request.id)
    await updateDoc(
        docRef,
        {
            name: request.name,
            image: request.image,
            status: request.status,
            description: request.description,
            updatedDate: serverTimestamp()
        },
        { merge: true }
    )
}

export async function addRule(request) {
    const docRef = doc(db, "competitions", request.id)
    await updateDoc(
        docRef,
        {
            rules: arrayUnion(request.rule),
            updatedDate: serverTimestamp()
        }
    )
}

export async function deleteRule(request) {
    const docRef = doc(db, "competitions", request.id)
    await updateDoc(
        docRef,
        {
            rules: arrayRemove(request.rule),
            updatedDate: serverTimestamp()
        }
    )
}

export async function addRound(id) {
    const docRef = doc(db, "competitions", id)
    await updateDoc(
        docRef,
        {
            rounds: arrayUnion(emptyRound),
            updatedDate: serverTimestamp()
        }
    )
}

export async function deleteRound(request) {
    const docRef = doc(db, "competitions", request.id)
    await updateDoc(
        docRef,
        {
            rounds: arrayRemove(request.round),
            updatedDate: serverTimestamp()
        }
    )
}

export async function updateRounds(request) {
    const docRef = doc(db, "competitions", request.id)
    const { rounds, score } = calcScore(request.rounds, request.players)
    const winner = score[0] > score[1] ?
        request.players[0] : score[1] > score[0] ? request.players[1] : "draw"
    await updateDoc(
        docRef,
        {
            rounds: rounds,
            currentScore: score,
            winner: winner,
            updatedDate: serverTimestamp()
        }
    )
}

function calcScore(rounds, players) {
    let overallScore = [0, 0]
    const newRounds = [...rounds]
    for (let j = 0; j < newRounds.length; j++) {
        let score = [0, 0]
        newRounds[j].nestedRounds
        for (let i = 0; i < newRounds[j].nestedRounds.length; i++) {
            if (newRounds[j].nestedRounds[i].player == players[0]) score[0] += parseInt(newRounds[j].nestedRounds[i].points)
            else if (newRounds[j].nestedRounds[i].player == players[1]) score[1] += parseInt(newRounds[j].nestedRounds[i].points)
            else {
                score[0] += parseInt(newRounds[j].nestedRounds[i].points)
                score[1] += parseInt(newRounds[j].nestedRounds[i].points)
            }
        }
        if (score[0] > score[1]) {
            newRounds[j].winner = players[0]
            if (!newRounds[j].valid) break
            overallScore[0]++
        }
        else if (score[0] < score[1]) {
            newRounds[j].winner = players[1]
            if (!newRounds[j].valid) break
            overallScore[1]++
        } else {
            newRounds[j].winner = "draw"
            if (!newRounds[j].valid) break
            overallScore[0]++
            overallScore[1]++
        }
    }
    return { rounds: newRounds, score: overallScore }
}