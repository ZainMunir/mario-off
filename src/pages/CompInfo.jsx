import React from "react";
import { useOutletContext } from "react-router-dom";

export default function CompInfo() {
    const { currCompetition } = useOutletContext()
    return (
        <h1>Comp Info</h1>
    )
}