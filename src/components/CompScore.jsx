import React from "react";
import { getPersonInfo } from "../util-js/api";
import { MdAccountCircle } from "react-icons/md";
import ReactImageFallback from "react-image-fallback";
import NotFound from "../assets/image-not-found.png";

export default function CompScore(props) {
  const [playerDeets, setPlayerDeets] = React.useState([]);
  React.useEffect(() => {
    async function fetchPlayers() {
      setPlayerDeets([
        await getPersonInfo(props.players[0]),
        await getPersonInfo(props.players[1]),
      ]);
    }
    fetchPlayers();
  }, [props]);
  if (!playerDeets[1]) {
    playerDeets[1] = { profilePic: "", username: "" };
  }
  if (!playerDeets[0]) {
    playerDeets[0] = { profilePic: "", username: "" };
  }
  return (
    <div className="flex flex-row w-full place-content-center">
      <abbr className="self-center mr-2" title={playerDeets[0].username}>
        {playerDeets[0].profilePic ? (
          <ReactImageFallback
            src={playerDeets[0].profilePic}
            fallbackImage={NotFound}
            alt={playerDeets[0].username}
            className="w-5 h-5 object-cover bg-gray-200 rounded-full"
          />
        ) : (
          <MdAccountCircle size={20} />
        )}
      </abbr>
      {props.currentScore[0]} - {props.currentScore[1]}
      <abbr className="self-center ml-2" title={playerDeets[1].username}>
        {playerDeets[1].profilePic ? (
          <ReactImageFallback
            src={playerDeets[1].profilePic}
            fallbackImage={NotFound}
            alt={playerDeets[1].username}
            className="w-5 bg-gray-200 rounded-full"
          />
        ) : (
          <MdAccountCircle size={20} />
        )}
      </abbr>
    </div>
  );
}
