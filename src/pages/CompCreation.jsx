import React from "react";
import { requireAuth } from "../util-js/requireAuth.cjs";

export async function loader({ request }) {
    await requireAuth(request)
    return null
}

export default function CompCreation() {
    return (
        <h1>Comp creation goes here</h1>
    )
}