import React from "react";
import { Outlet, useOutletContext, useNavigate, useLoaderData } from "react-router-dom";
import { addRound, deleteRound } from "../util-js/api"
import { requireAuth } from "../util-js/requireAuth";

export async function loader({ params, request }) {
    await requireAuth(request)
    return params.roundid || 1
}

export default function CompRounds() {
    const { currCompetition } = useOutletContext()
    const navigate = useNavigate()

    const [selectedRound, setSelectedRound] = React.useState(useLoaderData());
    // console.log(currCompetition)
    const roundOptions = []
    for (let i = 0; i < currCompetition.rounds.length; i++) {
        roundOptions.push(
            <option key={i + 1}>Round {i + 1}</option>
        )
    }

    React.useEffect(() => {
        selectedRound == 1 ? navigate(".") : navigate(`./${selectedRound}`)
    }, [selectedRound])

    function setRound(event) {
        const { value } = event.target
        let index = value.charAt(value.length - 1)
        setSelectedRound(index)
    }


    async function newRound() {
        await addRound(currCompetition.id)
        setSelectedRound(currCompetition.rounds.length + 1)
    }

    async function delRound() {
        await deleteRound({
            id: currCompetition.id,
            round: currCompetition.rounds[selectedRound - 1]
        })
        setSelectedRound(old => old - 1)
    }

    return (
        <div>
            <div>
                <select
                    value={`Round ${selectedRound}`}
                    onChange={setRound}
                >
                    {roundOptions}
                </select>
                {currCompetition.rounds.length > 1 && <button onClick={delRound}>Delete Round</button>}
                {currCompetition.rounds[selectedRound - 1].nestedRounds.length > 0 && <button onClick={newRound}>Add Round</button>}
            </div>
            <Outlet context={{ currCompetition }} />
        </div>

    )
}