import React from "react";
import { Link, redirect, useNavigate } from "react-router-dom";
import Image from "../assets/favicon.webp"


export default function Header({ isLoggedIn }) {
    let navigate = useNavigate();
    function logout() {
        localStorage.removeItem("loggedIn")
        return navigate("/mario-off")
    }

    return (
        <header className="h-16 w-screen flex justify-center items-center bg-gray-300">
            <div className="w-80 flex justify-between">
                <Link to="/mario-off" className="flex items-center mr-auto">
                    <img src={Image} className="w-10" />
                </Link>
                {isLoggedIn && <Link to="competitions" className="flex items-center">
                    <p>Competitions</p>
                </Link>}
                {isLoggedIn ?
                    <button onClick={logout} className="flex items-center ml-2">Logout</button> :
                    <Link to="login" className="flex items-center ml-2">
                        <p>Login</p>
                    </Link>}
            </div>
        </header>
    )
}