import React from "react";
import { useLoaderData, Link } from "react-router-dom"
import { requireAuth } from "../util-js/requireAuth.cjs";
import { getCompetitions } from "../util-js/api";
import CompThumbnail from "../components/CompThumbnail";

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
                <CompThumbnail
                    status={competition.status}
                    image={competition.image}
                    name={competition.name}
                    players={competition.players}
                    currentScore={competition.currentScore}
                />
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