import React from "react";
import { useLoaderData, useOutletContext } from "react-router-dom";
import { requireAuth } from "../util-js/requireAuth";

export async function loader({ params, request }) {
    await requireAuth(request)
    return params.roundid || 1
}

export default function CompRound() {
    const selectedRoundIndex = useLoaderData()
    const { currCompetition } = useOutletContext()
    // console.log(currCompetition)
    return (
        <div>
            <h1>{currCompetition.rounds[selectedRoundIndex - 1].winner}</h1>
            <h1>{currCompetition.rounds[selectedRoundIndex - 1].nestedRounds[0].winner}</h1>
        </div>
    )
}