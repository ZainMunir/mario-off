import React from "react";
import { useOutletContext, useNavigate, useNavigation, useRevalidator } from "react-router-dom";
import { addRound, deleteRound, addToRound } from "../util-js/api"


export default function CompRounds() {
    const { currCompetition } = useOutletContext()
    // console.log("currComp", currCompetition.rounds)

    const navigate = useNavigate()
    const navigation = useNavigation()
    const revalidator = useRevalidator()

    const [selectedRound, setSelectedRound] = React.useState(1);
    const currRound = currCompetition.rounds[selectedRound - 1]

    React.useEffect(() => {
        revalidator.revalidate()
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
                {currRound.nestedRounds[i].name} --- {currRound.nestedRounds[i].winner}
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
        revalidator.revalidate()
    }

    async function delRound() {
        await deleteRound({
            id: currCompetition.id,
            round: currCompetition.rounds[selectedRound - 1]
        })
        setSelectedRound(old => old - 1 > 1 ? old - 1 : 1)
    }

    const [data, setData] = React.useState({
        name: "",
        winner: "draw"
    })

    function handleChange(event) {
        const { name, value } = event.target
        setData(prevData => ({
            ...prevData,
            [name]: value
        }))
    }

    function addSubRound() {
        let rounds = [...currCompetition.rounds];
        rounds[currCompetition.rounds.indexOf(currRound)].nestedRounds = [...currRound.nestedRounds, data]
        addToRound({
            id: currCompetition.id,
            rounds: rounds
        })
        revalidator.revalidate()
    }

    function delSubRound() {
        removeFromRound({
            id: currCompetition.id,
        })
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
            <div className="flex flex-col justify-center mt-auto ">
                <div className="flex flex-row w-full my-2">
                    <input
                        type="text"
                        name="name"
                        placeholder="Sub-round name"
                        className="border-2 rounded p-1 w-7/12"
                        value={data.name}
                        onChange={handleChange}
                    />
                    <select
                        name="winner"
                        className="border-2 rounded ml-auto p-1 w-1/3"
                        value={data.winner}
                        onChange={handleChange}
                    >
                        <option>draw</option>
                        <option>{currCompetition.players[0]}</option>
                        <option>{currCompetition.players[1]}</option>
                    </select>
                </div>
                <button
                    className={`${navigation.state === "submitting" ? "bg-gray-300" : "bg-teal-500"} rounded-full drop-shadow-md text-white mb-2 place-content-center flex text-md p-1 w-32 mx-auto`}
                    onClick={addSubRound}
                >
                    {navigation.state === "submitting"
                        ? "Adding..."
                        : "Add Sub-round"
                    }
                </button>
            </div>
        </div>
    )
}
