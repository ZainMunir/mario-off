import React from "react";
import { useOutletContext } from "react-router-dom";

export default function CompRules() {
    const { currCompetition } = useOutletContext()
    return (
        <h1>Comp Rules</h1>
    )
}