import React from "react";
import { NavLink } from "react-router-dom";
import { AiFillHome, AiOutlineHome } from "react-icons/ai";
import { MdAccountCircle, MdOutlineAccountCircle } from "react-icons/md";

export default function Header({ isLoggedIn, myInfo }) {
  const activeStyles = {
    textDecoration: "underline",
    fontWeight: "500",
  };
  return (
    <header className="h-12 p-4 w-screen flex justify-center items-center bg-gray-400 sticky top-0  z-10">
      <div className="w-80 flex justify-between ">
        <NavLink to="/" className="flex items-center mr-auto" end>
          {({ isActive }) =>
            isActive ? <AiFillHome size={30} /> : <AiOutlineHome size={30} />
          }
        </NavLink>
        {isLoggedIn && (
          <>
            <NavLink
              to="friends"
              className="flex items-center mr-2"
              style={({ isActive }) => (isActive ? activeStyles : null)}
              end
            >
              Friends
            </NavLink>
            <NavLink
              to="competitions"
              className="flex items-center w-24"
              style={({ isActive }) => (isActive ? activeStyles : null)}
              end
            >
              Competitions
            </NavLink>
          </>
        )}
        <NavLink
          to={isLoggedIn ? "profile " : "login"}
          className="flex items-center ml-2"
        >
          {({ isActive }) =>
            isActive
              ? (myInfo && myInfo.profilePic && (
                  <img
                    src={myInfo.profilePic}
                    className="w-8 bg-gray-200 rounded-full border-2 border-black"
                  />
                )) || <MdAccountCircle size={32} />
              : (myInfo && myInfo.profilePic && (
                  <img
                    src={myInfo.profilePic}
                    className="w-8 bg-gray-200 rounded-full border-2"
                  />
                )) || <MdOutlineAccountCircle size={32} />
          }
        </NavLink>
      </div>
    </header>
  );
}

// Potentially change logout to be an icon to go to a settings page where you can change stuff like your display name, profile pic etc
// Then also have the logout button on that page instead. For testing, leaving as is is definitely better, but eventually, that'd be nice
// Above would also fix the competition and logout buttons displaying after logging out, probably. Actually, it'd probably just make the logout into the profile pic instead, but closer?
