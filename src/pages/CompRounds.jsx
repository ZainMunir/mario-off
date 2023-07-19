import React from "react";
import { useOutletContext, useNavigation, useRevalidator } from "react-router-dom";
import { addRound, deleteRound, updateRounds } from "../util-js/api"
import Trash from "../assets/trash.png"
import CompScore from "../components/CompScore";


export default function CompRounds() {
    const { currCompetition } = useOutletContext()

    const navigation = useNavigation()
    const revalidator = useRevalidator()

    const [selectedRound, setSelectedRound] = React.useState(1);
    const currRound = currCompetition.rounds[selectedRound - 1]
    React.useEffect(() => {
        revalidator.revalidate()
    }, [selectedRound])

    const [data, setData] = React.useState({
        name: "",
        player: "draw",
        points: 1,
    })
    function handleChange(event) {
        const { name, value } = event.target
        setData(prevData => ({
            ...prevData,
            [name]: value
        }))
    }

    const roundOptions = []
    for (let i = 0; i < currCompetition.rounds.length; i++) {
        roundOptions.push(
            <option key={i + 1}>Round {i + 1}</option>
        )
    }
    let score = [0, 0]
    const roundDetails = []
    for (let i = 0; i < currRound.nestedRounds.length; i++) {
        roundDetails.push(
            <div
                key={`${selectedRound - 1}-${i + 1}`}
                className="group relative flex flex-row justify-between"
            >
                <div className="mr-auto w-32 text-left">
                    {currRound.nestedRounds[i].name}
                </div>
                <div>{currRound.nestedRounds[i].points}</div>
                <div className="ml-auto w-32 text-right">
                    {currRound.nestedRounds[i].player}
                </div>
                {currCompetition.status === "ongoing" &&
                    <button
                        className="left-36 top-1 absolute opacity-0 group-hover:opacity-100"
                        onClick={() => delSubRound(i)}
                    >
                        <img src={Trash} className="w-3" />
                    </button>
                }
            </div>
        )
        if (currRound.nestedRounds[i].player == currCompetition.players[0]) score[0] += parseInt(currRound.nestedRounds[i].points)
        else if (currRound.nestedRounds[i].player == currCompetition.players[1]) score[1] += parseInt(currRound.nestedRounds[i].points)
        else {
            score[0] += parseInt(currRound.nestedRounds[i].points)
            score[1] += parseInt(currRound.nestedRounds[i].points)
        }
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
        revalidator.revalidate()
    }

    async function addSubRound() {
        let rounds = [...currCompetition.rounds];
        rounds[currCompetition.rounds.indexOf(currRound)].nestedRounds = [...currRound.nestedRounds, data]
        await updateRounds({
            id: currCompetition.id,
            players: currCompetition.players,
            rounds: rounds
        })
        revalidator.revalidate()
    }

    async function delSubRound(subIndex) {
        let rounds = [...currCompetition.rounds];
        rounds[currCompetition.rounds.indexOf(currRound)]
            .nestedRounds.splice(subIndex, 1)
        await updateRounds({
            id: currCompetition.id,
            players: currCompetition.players,
            rounds: rounds
        })
        revalidator.revalidate()
    }

    return (
        <div className="flex flex-col h-full text-center">
            <div className="flex flex-row justify-between">
                {currCompetition.status === "ongoing" &&

                    <button
                        onClick={delRound}
                        className="mr-auto text-sm px-1 w-24 bg-red-500 rounded-full drop-shadow-md text-white disabled:grayscale"
                        disabled={currCompetition.rounds.length == 1}
                    >
                        Delete Round
                    </button>}
                <select
                    value={`Round ${selectedRound}`}
                    onChange={setRound}
                    className="mx-auto rounded-md px-1 bg-black text-white"
                >
                    {roundOptions}
                </select>
                {currCompetition.status === "ongoing" &&
                    <button
                        onClick={newRound}
                        className="bg-teal-500 rounded-full drop-shadow-md text-white place-content-center flex text-sm px-1 w-24 ml-auto disabled:grayscale"
                        disabled={currRound.nestedRounds.length == 0}
                    >
                        Add Round
                    </button>}
            </div>
            <CompScore players={currCompetition.players} currentScore={score} />
            <div className="mt-5">
                {roundDetails}
            </div>
            {currCompetition.status === "ongoing" &&
                <div className="flex flex-col justify-center mt-auto ">
                    <div className="flex flex-row w-full my-2">
                        <input
                            type="text"
                            name="name"
                            placeholder="Sub-round name"
                            className="border-2 rounded p-1 w-1/2"
                            value={data.name}
                            onChange={handleChange}
                        />
                        <input
                            type="number"
                            name="points"
                            className="border-2 rounded p-1 w-1/6"
                            value={data.points}
                            onChange={handleChange}
                        />
                        <select
                            name="player"
                            className="border-2 rounded ml-auto p-1 w-1/3"
                            value={data.player}
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
                </div>}
        </div>
    )
}
