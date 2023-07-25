import React from "react";
import { NavLink, Outlet, useParams, useSearchParams } from "react-router-dom";
import { requireAuth } from "../util-js/requireAuth";
import { keepCompetitionUpdated } from "../util-js/competitions-api";

export async function loader({ request }) {
  await requireAuth(request);
  return null;
}

export default function CompDetails() {
  const [searchParams, setSearchParams] = useSearchParams();
  const [currCompetition, setCompetition] = React.useState(null);

  const { id } = useParams();

  React.useEffect(() => {
    return keepCompetitionUpdated(id, setCompetition);
  }, []);

  if (!currCompetition) {
    return <h1 className="m-2 text-xl">Loading...</h1>;
  }

  if (currCompetition.message) {
    throw currCompetition;
  }

  const round = searchParams.get("round");
  const activeStyles = {
    textDecoration: "underline",
    fontWeight: "500",
  };

  return (
    <div className="flex h-full w-full flex-col">
      <h1 className="text-center text-xl font-bold">{currCompetition.name}</h1>
      <div className="flex flex-grow flex-col bg-gray-100">
        <div className="flex w-full justify-around border-b-2 border-b-gray-300">
          <NavLink
            to={`./${round ? `?round=${round}` : ""}`}
            className="w-20 text-center"
            style={({ isActive }) => (isActive ? activeStyles : null)}
            end
          >
            Info
          </NavLink>
          <NavLink
            to={`rules${round ? `?round=${round}` : ""}`}
            className="w-20 text-center"
            style={({ isActive }) => (isActive ? activeStyles : null)}
          >
            Rules
          </NavLink>
          <NavLink
            to={`rounds${round ? `?round=${round}` : ""}`}
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
