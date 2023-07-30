import React from "react";
import { useNavigate, useOutletContext } from "react-router-dom";
import { addCompetition } from "../util-js/competitions-api";
import { getActualFriends } from "../util-js/friends-api";
import CompThumbnail from "../components/CompPieces/CompThumbnail";

export default function CompCreation(props) {
  const { myInfo } = useOutletContext();
  const navigate = useNavigate();
  const [errorMessage, setErrorMessage] = React.useState(null);
  const [friendsInfo, setFriendsInfo] = React.useState([]);

  React.useEffect(() => {
    return getActualFriends(myInfo, setFriendsInfo);
  }, [myInfo]);

  const [data, setData] = React.useState({
    name: "",
    image: "",
    player2: "Select your Opponent",
    player2Id: "",
  });

  function handleChange(event) {
    const { name, value } = event.target;
    setData((prevData) => {
      if (name == "player2") {
        return {
          ...prevData,
          [name]: value,
          player2Id: event.target[event.target.selectedIndex].id,
        };
      }
      return {
        ...prevData,
        [name]: value,
      };
    });
  }

  const friendOptions = friendsInfo
    ? friendsInfo.map((friend) => {
        return (
          <option key={friend.userid} id={friend.userid}>
            {friend.username}
          </option>
        );
      })
    : [];

  async function submit(event) {
    event.preventDefault();
    if (data.name == "" || data.player2Id == "") {
      setErrorMessage("Name and Opponent Needed");
      return;
    }
    try {
      const id = await addCompetition(
        {
          name: data.name,
          image: data.image,
          player: data.player2Id,
        },
        myInfo
      );
      return navigate(`../competitions/${id}/`, {
        replace: props.keepHistory ? false : true,
      });
    } catch (err) {
      setErrorMessage(err.message);
    }
  }

  return (
    <div className="mx-auto flex max-w-xl flex-grow flex-col items-center border-x-2 dark:border-gray-700">
      {friendOptions.length == [] && (
        <h1 className="mx-auto my-1 text-3xl font-bold">
          Please add some friends first!
        </h1>
      )}
      {errorMessage && (
        <h3 className="text-center text-lg font-bold text-red-600">
          {errorMessage}
        </h3>
      )}

      <h3 className="text-center text-xl font-bold">Preview</h3>
      <div className="w-1/3 max-w-xs">
        <CompThumbnail
          status="ongoing"
          image={data.image}
          name={data.name}
          players={[myInfo.userid, data.player2Id]}
          currentScore={[0, 0]}
        />
      </div>
      <form type="post" className="flex w-full flex-col items-center p-5 ">
        <input
          type="text"
          name="name"
          placeholder="Competition Name"
          value={data.name}
          onChange={handleChange}
          className="m-2 w-5/6 max-w-lg rounded border-2 p-1 text-center dark:border-gray-600 dark:bg-gray-700"
        />
        <input
          type="url"
          name="image"
          placeholder="Thumbnail picture"
          value={data.image}
          onChange={handleChange}
          className="m-2 w-5/6  max-w-lg rounded border-2 p-1 text-center dark:border-gray-600 dark:bg-gray-700"
        />
        <select
          name="player2"
          placeholder="Other player"
          value={data.player2}
          onChange={handleChange}
          className="m-2 w-5/6 max-w-lg rounded border-2 p-1 text-center dark:border-gray-600 dark:bg-gray-700"
          required
        >
          <option disabled>Select your Opponent</option>
          {friendOptions}
        </select>
        <button
          className="m-2 w-1/2 max-w-xs rounded bg-teal-500 px-2 py-1 text-white drop-shadow-xl dark:bg-teal-800"
          onClick={(event) => submit(event)}
        >
          Create
        </button>
      </form>
    </div>
  );
}
