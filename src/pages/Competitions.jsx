import React from "react";
import { useLoaderData, Link } from "react-router-dom"
import { requireAuth } from "../util-js/requireAuth.cjs";
import { getCompetitions } from "../util-js/api";

export async function loader({ request }) {
    await requireAuth(request)
    return await getCompetitions(localStorage.getItem("userID"))
}

export default function Competitions() {
    const competitions = useLoaderData()

    let competitionsElements = competitions.sort((b, a) => a.updatedDate - b.updatedDate).map(competition => {
        const color = competition.status == "complete" ? "bg-green-400" : competition.status == "ongoing" ? "bg-orange-400" : "bg-red-500"
        return (
            <Link to={competition.id} key={competition.id}>
                <div className="flex flex-col items-center font text-lg w-full h-60 drop-shadow-md bg-slate-300 rounded-lg">
                    <p className={`w-full max-h-8 rounded-lg text-center capitalize ${color}`}>{competition.status}</p>
                    <div className="flex-grow flex flex-wrap place-content-center m-1">
                        <img src={competition.image} alt={competition.name} className="max-h-44 w-auto h-fit" />
                    </div>
                    <p className="capitalize">{competition.players[0]} {competition.currentScore[0]} - {competition.currentScore[1]} {competition.players[1]}</p>
                </div>
            </Link>
        )
    })
    return (
        <div className="flex flex-col h-full overflow-y-auto no-scrollbar">
            <div className="grid grid-cols-2 w-full gap-5 scroll-auto" >
                {competitionsElements}
            </div>
            <div className={`flex pt-1 ${competitionsElements ? "justify-end mt-auto absolute bottom-4 right-4" : "place-content-center"}`}>
                <Link to="../competition-creation">
                    <button className={`rounded-full bg-teal-500 drop-shadow-md text-white mb-2 place-content-center flex ${competitionsElements ? "text-3xl w-10 h-10" : "text-lg p-2"}`}>{competitionsElements ? "+" : "Create Competition"}</button>
                </Link >
            </div>
        </div >
    )
}