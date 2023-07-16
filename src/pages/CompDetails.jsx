import React from "react";
import { requireAuth } from "../util-js/requireAuth.cjs";
import { getCompetition } from "../util-js/api";
import { useLoaderData } from "react-router-dom";

export async function loader({ params, request }) {
    await requireAuth(request)
    return getCompetition(params.id);
}

export default function CompDetails() {
    const currCompetition = useLoaderData()
    console.log(currCompetition)
    return (
        <h1>Comp Details go here</h1>
    )
}