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
        <header className="h-12 p-4 w-screen flex justify-center items-center bg-gray-300 sticky top-0  z-10">
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

// Potentially change logout to be an icon to go to a settings page where you can change stuff like your display name, profile pic etc
// Then also have the logout button on that page instead. For testing, leaving as is is definitely better, but eventually, that'd be nice
// Above would also fix the competition and logout buttons displaying after logging out, probably. Actually, it'd probably just make the logout into the profile pic instead, but closer?
