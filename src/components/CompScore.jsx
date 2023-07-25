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
    <div className="flex w-full flex-row place-content-center">
      <abbr className="mr-2 self-center" title={playerDeets[0].username}>
        {playerDeets[0].profilePic ? (
          <ReactImageFallback
            src={playerDeets[0].profilePic}
            fallbackImage={NotFound}
            alt={playerDeets[0].username}
            className="h-5 w-5 rounded-full bg-gray-200 object-cover"
          />
        ) : (
          <MdAccountCircle size={20} />
        )}
      </abbr>
      {props.currentScore[0]} - {props.currentScore[1]}
      <abbr className="ml-2 self-center" title={playerDeets[1].username}>
        {playerDeets[1].profilePic ? (
          <ReactImageFallback
            src={playerDeets[1].profilePic}
            fallbackImage={NotFound}
            alt={playerDeets[1].username}
            className="w-5 rounded-full bg-gray-200"
          />
        ) : (
          <MdAccountCircle size={20} />
        )}
      </abbr>
    </div>
  );
}
