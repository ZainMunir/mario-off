import React from "react";
import { useLoaderData } from "react-router-dom"
import { requireAuth } from "../util-js/requireAuth.cjs";

export async function loader({ request }) {
    await requireAuth(request)
    return null
}

export default function Competitions() {
    return (
        <h1>Competitions page here</h1>
    )
}