import React from "react";
import {
  NavLink,
  Outlet,
  useOutletContext,
  useParams,
  useSearchParams,
} from "react-router-dom";
import { keepCompetitionUpdated } from "../util-js/competitions-api";
import CompInfo from "./CompInfo";
import CompRules from "./CompRules";
import CompRounds from "./CompRounds";

export default function CompDetails() {
  const { myInfo } = useOutletContext();
  const [searchParams, setSearchParams] = useSearchParams();
  const [currCompetition, setCompetition] = React.useState(null);
  const { id } = useParams();
  const [width, setWidth] = React.useState(window.innerWidth);

  const round = searchParams.get("round");

  React.useEffect(() => {
    function updateWidth() {
      setWidth(window.innerWidth);
    }
    window.addEventListener("resize", updateWidth);
    return () => window.removeEventListener("resize", updateWidth);
  }, []);

  React.useEffect(() => {
    return keepCompetitionUpdated(id, setCompetition);
  }, []);

  if (!currCompetition) {
    return <h1 className="m-2 text-xl">Loading...</h1>;
  }

  if (currCompetition.message) {
    throw currCompetition;
  }

  const isParticipant = !myInfo
    ? false
    : currCompetition.players.find((x) => x == myInfo.userid)
    ? true
    : false;

  const activeStyles = {
    textDecoration: "underline",
    fontWeight: "500",
  };

  return (
    <div className="bg-gray-1 flex w-full flex-grow flex-col dark:bg-gray-950">
      <h1 className="bg-white py-1 text-center text-2xl font-bold dark:bg-black sm:py-2 sm:text-3xl lg:text-4xl">
        {currCompetition.name}
      </h1>
      {width < 1024 ? (
        <div className="mx-auto flex w-full max-w-2xl flex-grow">
          <div className="flex w-full flex-grow flex-col ">
            <div className="flex w-full justify-around border-b-2 border-b-gray-300 dark:border-gray-700">
              <NavLink
                to={`./${round ? `?round=${round}` : ""}`}
                className="w-20 text-center sm:text-xl"
                style={({ isActive }) => (isActive ? activeStyles : null)}
                end
              >
                Info
              </NavLink>
              <NavLink
                to={`rules${round ? `?round=${round}` : ""}`}
                className="w-20 text-center sm:text-xl"
                style={({ isActive }) => (isActive ? activeStyles : null)}
              >
                Rules
              </NavLink>
              <NavLink
                to={`rounds${round ? `?round=${round}` : ""}`}
                className="w-20 text-center sm:text-xl"
                style={({ isActive }) => (isActive ? activeStyles : null)}
              >
                Rounds
              </NavLink>
            </div>
            <div className="mx-auto flex w-full max-w-md flex-grow px-2 pt-2">
              <Outlet context={{ currCompetition, isParticipant }} />
            </div>
          </div>
        </div>
      ) : (
        <div className="flex w-full flex-grow flex-col">
          <div className="mx-auto flex w-full justify-around border-b-2 px-2 pt-2  dark:border-gray-700">
            <h1 className="w-1/3 text-center text-3xl">Rules</h1>
            <h1 className="w-1/3 text-center text-3xl">Info</h1>
            <h1 className="w-1/3 text-center text-3xl">Rounds</h1>
          </div>
          <div className="flex flex-grow text-2xl">
            <div className="mx-auto flex w-1/3 flex-grow border-r-2 px-2 pt-2  dark:border-gray-700">
              <CompRules
                currCompetition={currCompetition}
                isParticipant={isParticipant}
              />
            </div>
            <div className="mx-auto flex w-1/3 flex-grow px-2 pt-2">
              <CompInfo
                currCompetition={currCompetition}
                isParticipant={isParticipant}
              />
            </div>
            <div className="mx-auto flex w-1/3 flex-grow border-l-2 px-2 pt-2  dark:border-gray-700">
              <CompRounds
                currCompetition={currCompetition}
                isParticipant={isParticipant}
              />
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
