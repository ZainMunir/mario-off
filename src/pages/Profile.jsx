import React from "react";
import { googleSignOut } from "../util-js/api"
import { useNavigate, useRevalidator } from "react-router-dom";

export default function Profile() {
    const revalidator = useRevalidator()
    const navigate = useNavigate();

    function logout() {
        googleSignOut()
        revalidator.revalidate()
        navigate("/")
    }

    return (
        <div>
            <button onClick={logout}>Sign out</button>
        </div>
    )
}