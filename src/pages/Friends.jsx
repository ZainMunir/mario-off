import React from "react";
import { useOutletContext } from "react-router-dom";
import ReactImageFallback from "react-image-fallback";
import {
  addFriend,
  getFriends,
  acceptFriend,
  deleteFriend,
} from "../util-js/friends-api";
import { MdAccountCircle } from "react-icons/md";
import { FaTrashAlt } from "react-icons/fa";
import ErrorMessage from "../components/ErrorMessage";
import NotFound from "../assets/image-not-found.png";

export default function Friends() {
  const { myInfo } = useOutletContext();
  const [friendsInfo, setFriendsInfo] = React.useState([]);
  const [username, setUsername] = React.useState("");
  const [errorMessage, setErrorMessage] = React.useState(null);

  const friends = myInfo.friends;
  const sentRequests = friends.filter((x) => !x.accepted && x.sender);
  const receivedRequests = friends.filter((x) => !x.accepted && !x.sender);
  const actualFriends = friends.filter((x) => x.accepted);

  React.useEffect(() => {
    return getFriends(myInfo, setFriendsInfo);
  }, [myInfo]);

  async function accFriend(currFriend) {
    await acceptFriend(currFriend, myInfo);
  }

  async function delFriend(currFriend) {
    await deleteFriend(currFriend, myInfo);
  }

  const receivedElements =
    friendsInfo && friendsInfo.length != 0
      ? receivedRequests.map((friend) => {
          const currentFriend = friendsInfo.find(
            (x) => x.userid == friend.userid
          );
          return (
            <div key={friend.userid} className="flex">
              <p className="mr-auto">
                {currentFriend && currentFriend.username}
              </p>
              <button
                onClick={() => delFriend(currentFriend)}
                className="mr-2 text-red-600"
              >
                x
              </button>
              <button
                onClick={() => accFriend(currentFriend)}
                className="text-green-600"
              >
                ✓
              </button>
            </div>
          );
        })
      : [];

  const actualFriendsElements =
    friendsInfo && friendsInfo.length != 0
      ? actualFriends.map((friend) => {
          const currentFriend = friendsInfo.find(
            (x) => x.userid == friend.userid
          );
          const myInfoOnThem = myInfo.friends.find(
            (x) => x.userid == currentFriend.userid
          );
          return (
            <div
              key={friend.userid}
              className="group relative flex items-center"
            >
              {currentFriend.profilePic ? (
                <ReactImageFallback
                  src={currentFriend.profilePic}
                  fallbackImage={NotFound}
                  alt={currentFriend.username}
                  className="aspect-square w-9 rounded-full bg-gray-200 object-cover"
                />
              ) : (
                <MdAccountCircle size={36} />
              )}
              <p className="ml-2">
                {currentFriend && currentFriend.username}
                {currentFriend?.username == "RwBo" &&
                  " (Feel free to delete me!)"}
              </p>
              <p className="ml-auto mr-8">
                {myInfoOnThem.score[1]} - {myInfoOnThem.score[0]}{" "}
              </p>
              <button
                className="absolute right-0 top-1 opacity-0 transition-opacity duration-100 group-hover:opacity-100"
                onClick={() => delFriend(currentFriend)}
              >
                <FaTrashAlt />
              </button>
            </div>
          );
        })
      : [];

  const sentElements =
    friendsInfo && friendsInfo.length != 0
      ? sentRequests.map((friend) => {
          const currentFriend = friendsInfo.find(
            (x) => x.userid == friend.userid
          );
          return (
            <div key={friend.userid} className="group relative">
              <p>{currentFriend && currentFriend.username}</p>
              <button
                className="absolute right-0 top-1 opacity-0 transition-opacity duration-100 group-hover:opacity-100"
                onClick={() => delFriend(currentFriend)}
              >
                <FaTrashAlt />
              </button>
            </div>
          );
        })
      : [];

  async function submit(event) {
    event.preventDefault();
    if (username == "Friend" || username == "draw") {
      setErrorMessage("Forbidden friends 🐰🥚");
      return;
    }
    const message = await addFriend(username, myInfo);
    setErrorMessage(message);
  }

  return (
    <div className="mx-auto flex w-full max-w-xl flex-grow flex-col border-x-2 p-2 dark:border-gray-700 sm:text-3xl">
      <ErrorMessage message={errorMessage} />
      <form type="post" className="mt-2 flex flex-row justify-between">
        <input
          type="text"
          name="username"
          placeholder="Add friend (username)"
          className="w-3/5 rounded border-2 px-1 dark:border-gray-600 dark:bg-gray-700"
          value={username}
          onChange={(event) => setUsername(event.target.value)}
        />
        <button
          className="text-md flex w-24 place-content-center rounded-full bg-teal-500 px-1 text-white drop-shadow-md dark:bg-teal-800 sm:w-32 sm:py-1"
          onClick={(event) => submit(event)}
        >
          Send
        </button>
      </form>
      <div className="flex flex-grow flex-col">
        {receivedElements.length > 0 && (
          <>
            <h1 className="mt-2 font-bold">Friend Requests</h1>
            <div>{receivedElements}</div>
          </>
        )}
        {actualFriendsElements.length > 0 && (
          <>
            <h1 className="mt-2 font-bold">Friends</h1>
            <div>{actualFriendsElements}</div>
          </>
        )}
        {sentElements.length > 0 && (
          <>
            <h1 className="mt-auto font-bold">Sent Requests</h1>
            <div>{sentElements}</div>
          </>
        )}
      </div>
    </div>
  );
}
