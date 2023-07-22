import React from "react";
import { NavLink, Outlet, useLoaderData } from "react-router-dom";
import { requireAuth } from "../util-js/requireAuth";
import { getCompetition } from "../util-js/competitions-api";

export async function loader({ params, request }) {
  await requireAuth(request);
  return await getCompetition(params.id);
}

export default function CompDetails() {
  const currCompetition = useLoaderData();

  const activeStyles = {
    textDecoration: "underline",
    fontWeight: "500",
  };

  return (
    <div className="flex flex-col w-full h-full">
      <h1 className="font-bold text-xl text-center">{currCompetition.name}</h1>
      <div className="flex flex-col bg-gray-100 flex-grow">
        <div className="w-full flex justify-around border-b-2 border-b-gray-300">
          <NavLink
            to="."
            className="w-20 text-center"
            style={({ isActive }) => (isActive ? activeStyles : null)}
            end
          >
            Info
          </NavLink>
          <NavLink
            to="rules"
            className="w-20 text-center"
            style={({ isActive }) => (isActive ? activeStyles : null)}
          >
            Rules
          </NavLink>
          <NavLink
            to="rounds"
            className="w-20 text-center"
            style={({ isActive }) => (isActive ? activeStyles : null)}
          >
            Rounds
          </NavLink>
        </div>
        <div className="flex-grow px-2 pt-2">
          <Outlet context={{ currCompetition }} />
        </div>
      </div>
    </div>
  );
}
