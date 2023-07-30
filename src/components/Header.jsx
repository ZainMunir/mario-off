import React from "react";
import { NavLink } from "react-router-dom";
import ReactImageFallback from "react-image-fallback";
import { AiFillHome, AiOutlineHome } from "react-icons/ai";
import { MdAccountCircle, MdOutlineAccountCircle } from "react-icons/md";
import NotFound from "../assets/image-not-found.png";

export default function Header({ isLoggedIn, myInfo }) {
  const activeStyles = {
    textDecoration: "underline",
    fontWeight: "500",
  };
  return (
    <header className="sticky top-0 z-20 flex h-12 w-full items-center justify-center bg-gray-400 p-4 dark:bg-gray-800 dark:text-white">
      <div className="flex w-full max-w-full justify-between">
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
            myInfo && myInfo.profilePic ? (
              <ReactImageFallback
                src={myInfo.profilePic}
                fallbackImage={NotFound}
                alt={myInfo.username}
                className={`h-8 w-8 rounded-full border-2 bg-gray-200 object-cover ${
                  isActive
                    ? "border-black dark:border-white"
                    : "dark:border-black"
                }`}
              />
            ) : isActive ? (
              <MdAccountCircle size={32} />
            ) : (
              <MdOutlineAccountCircle size={32} />
            )
          }
        </NavLink>
      </div>
    </header>
  );
}
