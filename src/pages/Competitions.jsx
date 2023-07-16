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

    const competitionsElements = competitions.map(competition => {
        const color = competition.status == "complete" ? "bg-green-400" : competition.status == "ongoing" ? "bg-orange-400" : "bg-red-500"
        return (
            <Link to={competition.id} key={competition.id}>
                <div className="flex flex-col items-center font text-lg  w-full h-60 drop-shadow-md bg-slate-300 rounded-lg">
                    <p className={`w-full flex-grow rounded-lg text-center red capitalize ${color}`}>{competition.status}</p>
                    <img src={competition.image} className="h-44 m-1" />
                    <p className="capitalize">{competition.players[0]} {competition.currentScore[0]} - {competition.currentScore[1]} {competition.players[1]}</p>
                </div>
            </Link>
        )
    })

    return (

        <div className="grid grid-cols-2 w-full justify-evenly gap-5 scroll-auto" >
            {competitionsElements}
        </div>
    )
}