import React from "react";
import { NavLink } from "react-router-dom";
import Mushroom from "../assets/favicon.webp"
import EmptyProfile from "../assets/profile-pic.png"
import { myInfo } from "../util-js/api";


export default function Header({ isLoggedIn }) {
    const activeStyles = {
        textDecoration: "underline",
        fontWeight: "500"
    }

    return (
        <header className="h-12 p-4 w-screen flex justify-center items-center bg-gray-400 sticky top-0  z-10">
            <div className="w-80 flex justify-between ">
                <NavLink
                    to="/"
                    className="flex items-center mr-auto border-2 border-transparent"
                    style={({ isActive }) => isActive ? { border: "2px solid black" } : null}
                    end
                >
                    <img src={Mushroom} className="w-10" />
                </NavLink>
                {isLoggedIn &&
                    <>
                        <NavLink
                            to="friends"
                            className="flex items-center mr-2"
                            style={({ isActive }) => isActive ? activeStyles : null}
                            end
                        >
                            Friends
                        </NavLink>
                        <NavLink
                            to="competitions"
                            className="flex items-center"
                            style={({ isActive }) => isActive ? activeStyles : null}
                            end
                        >
                            Competitions
                        </NavLink>
                    </>}
                <NavLink
                    to={isLoggedIn ? "profile " : "login"}
                    className="flex items-center ml-2 rounded-full"
                    style={({ isActive }) => isActive ? activeStyles : null}
                >
                    <img src={(myInfo && myInfo.profilePic) || EmptyProfile} className="w-8 bg-gray-200 rounded-full" />
                </NavLink>
            </div>
        </header>
    )
}

// Potentially change logout to be an icon to go to a settings page where you can change stuff like your display name, profile pic etc
// Then also have the logout button on that page instead. For testing, leaving as is is definitely better, but eventually, that'd be nice
// Above would also fix the competition and logout buttons displaying after logging out, probably. Actually, it'd probably just make the logout into the profile pic instead, but closer?
