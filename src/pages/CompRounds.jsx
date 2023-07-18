import React from "react";
import { Form, useOutletContext, useNavigate, useLoaderData, useNavigation } from "react-router-dom";
import { addRound, deleteRound } from "../util-js/api"
import { requireAuth } from "../util-js/requireAuth";

export async function loader({ params, request }) {
    await requireAuth(request)
    return params.roundid || 1
}

export async function action({ request }) {
    return null
}

export default function CompRounds() {
    const { currCompetition } = useOutletContext()
    // console.log(currCompetition)

    const navigate = useNavigate()
    const navigation = useNavigation()

    const [selectedRound, setSelectedRound] = React.useState(useLoaderData());
    const currRound = currCompetition.rounds[selectedRound - 1]

    React.useEffect(() => {
        navigate(".")
    }, [selectedRound])

    const roundOptions = []
    for (let i = 0; i < currCompetition.rounds.length; i++) {
        roundOptions.push(
            <option key={i + 1}>Round {i + 1}</option>
        )
    }

    const roundDetails = []
    for (let i = 0; i < currRound.nestedRounds.length; i++) {
        roundDetails.push(
            <div key={`${selectedRound - 1}-${i + 1}`}>
                {currRound.nestedRounds[i].winner}
            </div>
        )
    }

    function setRound(event) {
        const { value } = event.target
        let index = value.charAt(value.length - 1)
        setSelectedRound(index)
    }

    async function newRound() {
        await addRound(currCompetition.id)
        navigate(".")
    }

    async function delRound() {
        await deleteRound({
            id: currCompetition.id,
            round: currCompetition.rounds[selectedRound - 1]
        })
        navigate(".")
        setSelectedRound(1)
    }

    return (
        <div className="flex flex-col h-full">
            <div className="flex flex-row justify-between">
                <button
                    onClick={delRound}
                    className="mr-auto text-sm px-1 w-24 bg-red-500 rounded-full drop-shadow-md text-white disabled:grayscale"
                    disabled={currCompetition.rounds.length == 1}
                >
                    Delete Round
                </button>
                <select
                    value={`Round ${selectedRound}`}
                    onChange={setRound}
                    className=""
                >
                    {roundOptions}
                </select>
                {currCompetition.rounds[selectedRound - 1].nestedRounds.length > 0 &&
                    <button
                        onClick={newRound}
                        className="bg-teal-500 rounded-full drop-shadow-md text-white place-content-center flex text-sm px-1 w-24 ml-auto"
                    >
                        Add Round
                    </button>}
            </div>
            <div>
                {roundDetails}
            </div>
            <Form
                method="post"
                className="flex flex-col justify-center mt-auto "
            >
                <div className="flex flex-row w-full my-2">
                    <input
                        type="text"
                        name="name"
                        placeholder="Sub-round name"
                        className="border-2 rounded p-1 w-7/12"
                    />
                    <select className="border-2 rounded ml-auto p-1 w-1/3">
                        <option>Draw</option>
                        <option>{currCompetition.players[0]}</option>
                        <option>{currCompetition.players[1]}</option>
                    </select>
                </div>
                <button
                    className={`${navigation.state === "submitting" ? "bg-gray-300" : "bg-teal-500"} rounded-full drop-shadow-md text-white mb-2 place-content-center flex text-md p-1 w-32 mx-auto`}
                >
                    {navigation.state === "submitting"
                        ? "Adding..."
                        : "Add Sub-round"
                    }
                </button>
            </Form>
        </div>
    )
}
