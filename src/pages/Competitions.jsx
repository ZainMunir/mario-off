import React from "react";
import { Link, useSearchParams, useOutletContext } from "react-router-dom";
import { requireAuth } from "../util-js/requireAuth";
import { keepCompetitionsUpdated } from "../util-js/competitions-api";
import { getActualFriends } from "../util-js/friends-api";
import CompThumbnail from "../components/CompThumbnail";

export async function loader({ request }) {
  await requireAuth(request);
  return null;
}

export default function Competitions() {
  const [competitions, setCompetitions] = React.useState([]);
  const [searchParams, setSearchParams] = useSearchParams();
  const statusFilter = searchParams.get("status");
  const friendFilter = searchParams.get("friend");
  const { myInfo } = useOutletContext();
  const [friendsInfo, setFriendsInfo] = React.useState([]);

  React.useEffect(() => {
    return getActualFriends(myInfo, setFriendsInfo);
  }, [myInfo]);

  function clearFilter() {
    setSearchParams((prevParams) => {
      prevParams.delete("status");
      prevParams.delete("friend");
      return prevParams;
    });
  }

  React.useEffect(() => {
    return keepCompetitionsUpdated(myInfo, setCompetitions);
  }, []);

  function handleFilterChange(event) {
    const { name, value } = event.target;
    setSearchParams((prevParams) => {
      if (value === "") {
        prevParams.delete(name);
      } else {
        prevParams.set(name, value);
      }
      return prevParams;
    });
  }

  function handleFriendFilterChange(event) {
    const { name, value } = event.target;
    setSearchParams((prevParams) => {
      if (value === "") {
        prevParams.delete(name);
      } else {
        prevParams.set(name, event.target[event.target.selectedIndex].id);
      }
      return prevParams;
    });
  }

  function convertUidToUsername(uid) {
    if (!uid) return null;
    return friendsInfo.find((x) => x.userid == uid).username;
  }

  const friendOptions = friendsInfo
    ? friendsInfo.map((friend) => {
        return (
          <option
            key={friend.userid}
            id={friend.userid}
            className="bg-black text-white"
          >
            {friend.username}
          </option>
        );
      })
    : [];

  let displayedCompetitions = statusFilter
    ? competitions.filter(
        (competitions) => competitions.status === statusFilter
      )
    : competitions;
  displayedCompetitions = friendFilter
    ? displayedCompetitions.filter((competition) =>
        competition.players.includes(friendFilter)
      )
    : displayedCompetitions;

  let competitionsElements = displayedCompetitions
    .sort((b, a) => a.updatedDate - b.updatedDate)
    .map((competition) => {
      return (
        <Link to={competition.id} key={competition.id} className="w-full">
          <CompThumbnail
            status={competition.status}
            image={competition.image}
            name={competition.name}
            players={competition.players}
            currentScore={competition.currentScore}
          />
        </Link>
      );
    });
  if (competitionsElements.length == 0 && !statusFilter && !friendFilter)
    competitionsElements = null;

  const selectColor =
    statusFilter == "complete"
      ? "bg-green-400"
      : statusFilter == "ongoing"
      ? "bg-orange-400"
      : statusFilter == "abandoned"
      ? "bg-red-500"
      : "bg-gray-100";

  return (
    <div className="no-scrollbar flex h-full flex-col overflow-y-auto p-1">
      {competitionsElements && (
        <div className="mb-2 flex flex-row gap-2 text-sm">
          <select
            name="status"
            className={`w-28 rounded-xl p-1 ${selectColor}`}
            value={statusFilter || "Status"}
            onChange={handleFilterChange}
          >
            <option value="" className="bg-gray-100">
              Status
            </option>
            <option value="abandoned" className="bg-red-500  ">
              Abandoned
            </option>
            <option value="ongoing" className="bg-orange-400">
              Ongoing
            </option>
            <option value="complete" className="bg-green-400">
              Complete
            </option>
          </select>

          <select
            name="friend"
            className={`w-24 rounded-xl p-1 ${
              friendFilter ? "bg-black text-white" : "bg-gray-100 "
            }`}
            value={convertUidToUsername(friendFilter) || "Friend"}
            onChange={handleFriendFilterChange}
          >
            <option value="" className="bg-gray-100 text-black">
              Friend
            </option>
            {friendOptions}
          </select>

          {(statusFilter || friendFilter) && (
            <button onClick={clearFilter} className="">
              Clear filters
            </button>
          )}
        </div>
      )}
      <div className="grid min-h-min w-full grid-cols-2 place-items-center gap-5 scroll-auto sm:grid-cols-3 md:grid-cols-4">
        {competitionsElements}
      </div>
      <div
        className={`flex pt-1 ${
          competitionsElements
            ? "absolute bottom-4 right-4 mt-auto justify-end"
            : "place-content-center"
        }`}
      >
        <Link to="../competition-creation" className="flex items-center">
          <button
            className={`mb-2 flex place-content-center rounded-full bg-teal-500 text-white drop-shadow-md ${
              competitionsElements ? "h-10 w-10 text-3xl" : "p-2 text-lg"
            }`}
          >
            {competitionsElements ? "+" : "Create Competition"}
          </button>
        </Link>
      </div>
    </div>
  );
}
