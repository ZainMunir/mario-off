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
    setDoc
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
        winner: "",
        rounds: []
    }
    const compRef = await addDoc(competitionsCollection, newComp)
    return compRef.id
}

export async function deleteCompetition(id) {
    const docRef = doc(db, "competitions", id)
    await deleteDoc(docRef)
}

export async function updateCompetition(request) {
    console.log(request)
    const docRef = doc(db, "competitions", request.id)
    await setDoc(
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