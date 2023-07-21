import React from "react";
import { getPersonInfo } from "../util-js/api";

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
    }, [])

    return (
        <p>{playerDeets[0] && playerDeets[0].username} {props.currentScore[0]} - {props.currentScore[1]} {playerDeets[1] && playerDeets[1].username}</p>
    )
}