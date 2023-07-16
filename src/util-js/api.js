import { initializeApp } from "firebase/app";
import { getFirestore, collection, query, where, getDocs, getDoc, doc } from "firebase/firestore"

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
    return {
        ...querySnapshot.data(),
        id: querySnapshot.id
    }
}