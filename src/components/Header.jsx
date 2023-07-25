import React from "react";
import { NavLink } from "react-router-dom";
import { AiFillHome, AiOutlineHome } from "react-icons/ai";
import { MdAccountCircle, MdOutlineAccountCircle } from "react-icons/md";
import ReactImageFallback from "react-image-fallback";
import NotFound from "../assets/image-not-found.png";

export default function Header({ isLoggedIn, myInfo }) {
  const activeStyles = {
    textDecoration: "underline",
    fontWeight: "500",
  };
  return (
    <header className="sticky top-0 z-10 flex h-12 w-screen items-center justify-center bg-gray-400 p-4">
      <div className="max-w-screen flex w-full justify-between">
        <NavLink to="/" className="mr-auto flex items-center" end>
          {({ isActive }) =>
            isActive ? <AiFillHome size={30} /> : <AiOutlineHome size={30} />
          }
        </NavLink>
        {isLoggedIn && (
          <>
            <NavLink
              to="friends"
              className="mr-2 flex items-center"
              style={({ isActive }) => (isActive ? activeStyles : null)}
              end
            >
              Friends
            </NavLink>
            <NavLink
              to="competitions"
              className="flex w-24 items-center"
              style={({ isActive }) => (isActive ? activeStyles : null)}
              end
            >
              Competitions
            </NavLink>
          </>
        )}
        <NavLink
          to={isLoggedIn ? "profile " : "login"}
          className="ml-2 flex items-center"
        >
          {({ isActive }) =>
            isActive
              ? (myInfo && myInfo.profilePic && (
                  <ReactImageFallback
                    src={myInfo.profilePic}
                    fallbackImage={NotFound}
                    alt={myInfo.username}
                    className="h-8 w-8 rounded-full border-2 border-black bg-gray-200 object-cover"
                  />
                )) || <MdAccountCircle size={32} />
              : (myInfo && myInfo.profilePic && (
                  <ReactImageFallback
                    src={myInfo.profilePic}
                    fallbackImage={NotFound}
                    alt={myInfo.username}
                    className="h-8 w-8 rounded-full border-2 bg-gray-200 object-cover"
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
