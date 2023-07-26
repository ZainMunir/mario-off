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
    <header className="sticky top-0 z-10 flex h-12 w-screen items-center justify-center bg-gray-400 p-4 dark:bg-gray-800 dark:text-white">
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
                    className="h-8 w-8 rounded-full border-2 border-black bg-gray-200 object-cover dark:border-white"
                  />
                )) || <MdAccountCircle size={32} />
              : (myInfo && myInfo.profilePic && (
                  <ReactImageFallback
                    src={myInfo.profilePic}
                    fallbackImage={NotFound}
                    alt={myInfo.username}
                    className="h-8 w-8 rounded-full border-2 bg-gray-200 object-cover dark:border-black"
                  />
                )) || <MdOutlineAccountCircle size={32} />
          }
        </NavLink>
      </div>
    </header>
  );
}
