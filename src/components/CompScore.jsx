import React from "react";

export default function CompScore(props) {
    return (
        <p className="capitalize">{props.players[0]} {props.currentScore[0]} - {props.currentScore[1]} {props.players[1]}</p>
    )
}