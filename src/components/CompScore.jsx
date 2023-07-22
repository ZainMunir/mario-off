import React from "react";
import { getPersonInfo } from "../util-js/api";
import EmptyProfile from "../assets/profile-pic.png"

export default function CompScore(props) {
    const [playerDeets, setPlayerDeets] = React.useState([])
    React.useEffect(() => {
        async function fetchPlayers() {
            setPlayerDeets(
                [await getPersonInfo(props.players[0]),
                await getPersonInfo(props.players[1])]
            )
        }
        fetchPlayers();
    }, [props])
    if (!playerDeets[1]) {
        playerDeets[1] = { profilePic: "", username: "" }
    }
    return (
        <div className="flex flex-row w-full place-content-center">
            {playerDeets[0] &&
                <abbr className="self-center" title={playerDeets[0].username}>
                    <img
                        src={playerDeets[0].profilePic || EmptyProfile}
                        alt={playerDeets[0].username}
                        className="w-5 self-center bg-gray-200 rounded-full mr-2" />
                </abbr>}
            {props.currentScore[0]} - {props.currentScore[1]}
            {playerDeets[0] &&
                <abbr className="self-center" title={playerDeets[1].username}>
                    <img
                        src={playerDeets[1].profilePic || EmptyProfile}
                        alt={playerDeets[1].username}
                        className="w-5 self-center bg-gray-200 rounded-full  ml-2" />
                </abbr>}
        </div>
    )
}