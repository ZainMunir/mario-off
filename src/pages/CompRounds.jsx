import React from "react";
import {
  useOutletContext,
  useNavigation,
  useSearchParams,
} from "react-router-dom";
import { getPersonInfo } from "../util-js/api";
import { addRound, updateRounds } from "../util-js/competitions-api";
import CompScore from "../components/CompPieces/CompScore";
import { FaTrashAlt } from "react-icons/fa";

export default function CompRounds(props) {
  let { currCompetition, isParticipant } = useOutletContext();
  const navigation = useNavigation();
  const [searchParams, setSearchParams] = useSearchParams();
  const selectedRound = searchParams.get("round") || 1;

  if (!currCompetition) {
    currCompetition = props.currCompetition;
    isParticipant = props.isParticipant;
  }

  const [playerDeets, setPlayerDeets] = React.useState([
    {
      profilePic: "",
      username: "A",
      userid: currCompetition.players[0],
    },
    { profilePic: "", username: "B", userid: currCompetition.players[1] },
  ]);

  const [data, setData] = React.useState({
    name: "",
    player: "draw",
    points: 1,
  });

  React.useEffect(() => {
    async function fetchPlayers() {
      const data = await Promise.all([
        getPersonInfo(currCompetition.players[0]),
        getPersonInfo(currCompetition.players[1]),
      ]);
      setPlayerDeets(data);
    }
    fetchPlayers();
  }, []);

  function handleChange(event) {
    const { name, value } = event.target;
    setData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  }

  if (selectedRound > currCompetition.rounds.length) {
    return (
      <div>
        <h1>Round not found</h1>
        <button
          className="flex place-content-center rounded-full bg-teal-500 p-1 px-2 text-xs text-white drop-shadow-md"
          onClick={() =>
            setSearchParams((prevParams) => {
              prevParams.delete("round");
              return prevParams;
            })
          }
        >
          Back to safety
        </button>
      </div>
    );
  }

  const currRound = currCompetition.rounds[selectedRound - 1];

  const roundOptions = [];
  for (let i = 0; i < currCompetition.rounds.length; i++) {
    roundOptions.push(<option key={i + 1}>Round {i + 1}</option>);
  }

  function convertUidToUsername(uid) {
    if (!playerDeets.length) return;
    return uid == playerDeets[0].userid
      ? playerDeets[0].username
      : uid == playerDeets[1].userid
      ? playerDeets[1].username
      : "draw";
  }

  function convertUsernameToUid(username) {
    return username == playerDeets[0].username
      ? playerDeets[0].userid
      : username == playerDeets[1].username
      ? playerDeets[1].userid
      : "draw";
  }

  let score = [0, 0];
  const roundDetails = [];
  for (let i = 0; i < currRound.nestedRounds.length; i++) {
    roundDetails.push(
      <div
        key={`${selectedRound - 1}-${i + 1}`}
        className="group  flex flex-row justify-between"
      >
        <div className="mr-auto w-5/12 text-left">
          {currRound.nestedRounds[i].name}
        </div>
        <div className="relative">
          <div
            className={`transition-opacity duration-100 ${
              isParticipant ? "group-hover:opacity-0" : ""
            }`}
          >
            {currRound.nestedRounds[i].points}
          </div>
          {currCompetition.status === "ongoing" && isParticipant && (
            <div className="absolute inset-0 flex h-full w-full justify-center">
              <button
                className="self-center opacity-0 transition-opacity duration-100 group-hover:opacity-100"
                onClick={() => delSubRound(i)}
              >
                <FaTrashAlt size={16} />
              </button>
            </div>
          )}
        </div>
        <div className="ml-auto w-5/12 text-right">
          {convertUidToUsername(currRound.nestedRounds[i].player)}
        </div>
      </div>
    );
    if (currRound.nestedRounds[i].player == currCompetition.players[0])
      score[0] += parseInt(currRound.nestedRounds[i].points);
    else if (currRound.nestedRounds[i].player == currCompetition.players[1])
      score[1] += parseInt(currRound.nestedRounds[i].points);
    else {
      score[0] += parseInt(currRound.nestedRounds[i].points);
      score[1] += parseInt(currRound.nestedRounds[i].points);
    }
  }

  function setRound(event) {
    const { value } = event.target;
    let index = value.charAt(value.length - 1);
    setSearchParams((prevParams) => {
      if (index == 1) {
        prevParams.delete("round");
      } else {
        prevParams.set("round", index);
      }
      return prevParams;
    });
  }

  function newRound() {
    return addRound(currCompetition.id);
  }

  async function deleteRound() {
    let rounds = [...currCompetition.rounds];
    rounds.splice(selectedRound - 1, 1);
    await updateRounds({
      id: currCompetition.id,
      players: currCompetition.players,
      rounds: rounds,
    });
    setSearchParams((prevParams) => {
      if (selectedRound > 2) {
        prevParams.set("round", selectedRound - 1);
      } else if (selectedRound == 2) {
        prevParams.delete("round");
      }
      return prevParams;
    });
  }

  async function addSubRound(event) {
    event.preventDefault();
    let rounds = [...currCompetition.rounds];
    let fixedData = { ...data };
    fixedData.player = convertUsernameToUid(fixedData.player);
    rounds[selectedRound - 1].nestedRounds = [
      ...currRound.nestedRounds,
      fixedData,
    ];
    await updateRounds({
      id: currCompetition.id,
      players: currCompetition.players,
      rounds: rounds,
    });
  }

  async function delSubRound(subIndex) {
    let rounds = [...currCompetition.rounds];
    rounds[selectedRound - 1].nestedRounds.splice(subIndex, 1);
    await updateRounds({
      id: currCompetition.id,
      players: currCompetition.players,
      rounds: rounds,
    });
  }

  async function changeValidity(event) {
    const { checked } = event.target;
    let rounds = [...currCompetition.rounds];
    rounds[selectedRound - 1].valid = checked;
    await updateRounds({
      id: currCompetition.id,
      players: currCompetition.players,
      rounds: rounds,
    });
  }

  return (
    <div className="flex flex-grow flex-col text-center">
      <div className="mb-1 flex flex-row justify-around">
        {currCompetition.status === "ongoing" && isParticipant && (
          <button
            onClick={deleteRound}
            className="mr-auto w-28 rounded-full bg-red-500 px-1 text-sm text-white drop-shadow-md disabled:grayscale dark:bg-red-800"
            disabled={currCompetition.rounds.length == 1}
          >
            Delete Round
          </button>
        )}
        <div className="mx-2 flex w-28 flex-row justify-around ">
          <select
            value={`Round ${selectedRound}`}
            onChange={setRound}
            className="h-full rounded-md bg-black text-sm text-white dark:bg-zinc-800"
          >
            {roundOptions}
          </select>
          <input
            type="checkbox"
            name="valid"
            checked={currRound.valid}
            onChange={changeValidity}
            disabled={currCompetition.status !== "ongoing" || !isParticipant}
          />
        </div>
        {currCompetition.status === "ongoing" && isParticipant && (
          <button
            onClick={newRound}
            className="ml-auto flex w-28 place-content-center rounded-full bg-teal-500 px-1 text-sm text-white drop-shadow-md disabled:grayscale dark:bg-teal-800"
            disabled={currRound.nestedRounds.length == 0}
          >
            Add Round
          </button>
        )}
      </div>
      <CompScore players={currCompetition.players} currentScore={score} />
      <div className="mt-5 flex-grow overflow-y-auto">{roundDetails}</div>
      {currCompetition.status === "ongoing" && isParticipant && (
        <form type="post" className="h-22 mt-auto flex flex-col justify-center">
          <div className="my-2 flex w-full flex-row">
            <input
              type="text"
              name="name"
              placeholder="Sub-round name"
              className="w-1/2 rounded border-2 p-1 dark:border-gray-600 dark:bg-gray-700"
              value={data.name}
              onChange={handleChange}
            />
            <input
              type="number"
              name="points"
              className="w-1/6 rounded border-2 p-1 dark:border-gray-600 dark:bg-gray-700"
              value={data.points}
              onChange={handleChange}
            />
            <select
              name="player"
              className="ml-auto w-1/3 rounded border-2 p-1 dark:border-gray-600 dark:bg-gray-700"
              value={data.player}
              onChange={handleChange}
            >
              <option>draw</option>
              <option>{playerDeets[0].username}</option>
              <option>{playerDeets[1].username}</option>
            </select>
          </div>
          <button
            className={`${
              navigation.state === "submitting"
                ? "bg-gray-300 dark:bg-gray-700"
                : "bg-teal-500 dark:bg-teal-800"
            } text-md mx-auto mb-2 flex w-32 place-content-center rounded-full p-1 text-white drop-shadow-md lg:w-48`}
            onClick={(event) => addSubRound(event)}
          >
            {navigation.state === "submitting" ? "Adding..." : "Add Sub-round"}
          </button>
        </form>
      )}
    </div>
  );
}
