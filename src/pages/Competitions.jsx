import React from "react";
import { useLoaderData, Link, useSearchParams } from "react-router-dom"
import { requireAuth } from "../util-js/requireAuth";
import { getCompetitions } from "../util-js/api";
import CompThumbnail from "../components/CompThumbnail";

export async function loader({ request }) {
    await requireAuth(request)
    return await getCompetitions()
}

export default function Competitions() {
    const competitions = useLoaderData()
    const [searchParams, setSearchParams] = useSearchParams()
    const statusFilter = searchParams.get("status")

    function clearFilter() {
        setSearchParams(prevParams => {
            prevParams.delete("status")
            return prevParams
        })
    }

    function handleFilterChange(event) {
        const { name, value } = event.target
        setSearchParams(prevParams => {
            if (value === "") {
                prevParams.delete(name)
            } else {
                prevParams.set(name, value)
            }
            return prevParams
        })
    }

    const displayedCompetitions = statusFilter
        ? competitions.filter(competitions => competitions.status === statusFilter)
        : competitions

    let competitionsElements = displayedCompetitions.sort((b, a) => a.updatedDate - b.updatedDate).map(competition => {
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
    if (competitionsElements.length == 0 && !statusFilter) competitionsElements = null

    const selectColor = statusFilter == "complete" ? "bg-green-400" : statusFilter == "ongoing" ? "bg-orange-400" : statusFilter == "abandoned" ? "bg-red-500" : "bg-gray-100"

    return (
        <div className="flex flex-col h-full overflow-y-auto no-scrollbar p-1">
            {competitionsElements &&
                <div className="mb-2 flex flex-row gap-2 text-sm justify-between">
                    <select
                        name="status"
                        className={`w-26 rounded-xl p-1 ${selectColor}`}
                        value={statusFilter || "Status"}
                        onChange={handleFilterChange}
                    >
                        <option value="" className="bg-gray-100" >Status</option>
                        <option value="abandoned" className="bg-red-500  ">Abandoned</option>
                        <option value="ongoing" className="bg-orange-400">Ongoing</option>
                        <option value="complete" className="bg-green-400">Complete</option>
                    </select>

                    {statusFilter &&
                        <button
                            onClick={clearFilter}
                            className=""
                        >Clear filters</button>
                    }
                </div>
            }
            <div className="grid grid-cols-2 w-full gap-5 scroll-auto" >
                {competitionsElements}
            </div>
            <div className={`flex pt-1 ${competitionsElements ? "justify-end mt-auto absolute bottom-4 right-4" : "place-content-center"}`}>
                <Link to="../competition-creation" className="flex items-center">
                    <button className={`rounded-full bg-teal-500 drop-shadow-md text-white mb-2 place-content-center flex ${competitionsElements ? "text-3xl w-10 h-10" : "text-lg p-2"}`}>{competitionsElements ? "+" : "Create Competition"}</button>
                </Link >
            </div>
        </div >
    )
}