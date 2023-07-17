import React from "react";
import { NavLink, useNavigate } from "react-router-dom";
import Image from "../assets/favicon.webp"


export default function Header({ isLoggedIn }) {
    let navigate = useNavigate();
    function logout() {
        localStorage.removeItem("loggedIn")
        return navigate("/")
    }

    const activeStyles = {
        textDecoration: "underline",
        fontWeight: "500"
    }
    return (
        <header className="h-12 p-4 w-screen flex justify-center items-center bg-gray-400 sticky top-0  z-10">
            <div className="w-80 flex justify-between">
                <NavLink
                    to="/"
                    className="flex items-center mr-auto border-2 border-transparent"
                    style={({ isActive }) => isActive ? { border: "2px solid black" } : null}
                    end
                >
                    <img src={Image} className="w-10" />
                </NavLink>
                {isLoggedIn &&
                    <NavLink
                        to="competitions"
                        className="flex items-center"
                        style={({ isActive }) => isActive ? activeStyles : null}
                        end
                    >
                        Competitions
                    </NavLink>}
                {isLoggedIn ?
                    <button onClick={logout} className="flex items-center ml-2">Logout</button> :
                    <NavLink
                        to="login"
                        className="flex items-center ml-2"
                        style={({ isActive }) => isActive ? activeStyles : null}
                    >
                        Login
                    </NavLink>}
            </div>
        </header>
    )
}

// Potentially change logout to be an icon to go to a settings page where you can change stuff like your display name, profile pic etc
// Then also have the logout button on that page instead. For testing, leaving as is is definitely better, but eventually, that'd be nice
// Above would also fix the competition and logout buttons displaying after logging out, probably. Actually, it'd probably just make the logout into the profile pic instead, but closer?
