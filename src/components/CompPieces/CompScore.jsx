import React from "react";
import ReactImageFallback from "react-image-fallback";
import { getPersonInfo } from "../../util-js/api";
import { MdAccountCircle } from "react-icons/md";
import NotFound from "../../assets/image-not-found.png";

const defaultPlayer = { profilePic: "", username: "" };

export default function CompScore(props) {
  const [playerDeets, setPlayerDeets] = React.useState([
    defaultPlayer,
    defaultPlayer,
  ]);

  React.useEffect(() => {
    async function fetchPlayers() {
      const data = await Promise.all([
        getPersonInfo(props.players[0]),
        getPersonInfo(props.players[1]),
      ]);
      setPlayerDeets([data[0] || defaultPlayer, data[1] || defaultPlayer]);
    }
    fetchPlayers();
  }, [props]);

  return (
    <div className="mb-1 flex max-h-10 w-full flex-row place-content-center">
      <abbr className="mr-2 self-center" title={playerDeets[0].username}>
        {playerDeets[0].profilePic ? (
          <ReactImageFallback
            src={playerDeets[0].profilePic}
            fallbackImage={NotFound}
            alt={playerDeets[0].username}
            className="aspect-square h-8 rounded-full bg-gray-200 object-cover"
          />
        ) : (
          <MdAccountCircle size={32} />
        )}
      </abbr>
      <p className="self-center text-lg sm:text-2xl">
        {props.currentScore[0]}-{props.currentScore[1]}
      </p>
      <abbr className="ml-2 self-center" title={playerDeets[1].username}>
        {playerDeets[1].profilePic ? (
          <ReactImageFallback
            src={playerDeets[1].profilePic}
            fallbackImage={NotFound}
            alt={playerDeets[1].username}
            className="aspect-square h-8 rounded-full bg-gray-200 object-cover"
          />
        ) : (
          <MdAccountCircle size={32} />
        )}
      </abbr>
    </div>
  );
}
