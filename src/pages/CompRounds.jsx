import React from "react";
import { useOutletContext } from "react-router-dom";

export default function CompRounds() {
    const { currCompetition } = useOutletContext()
    return (
        <h1>Comp Rounds</h1>
    )
}