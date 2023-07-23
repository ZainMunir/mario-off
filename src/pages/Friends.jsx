import React from "react";
import { useOutletContext } from "react-router-dom";
import {
  addFriend,
  getFriends,
  acceptFriend,
  deleteFriend,
} from "../util-js/friends-api";
import { MdAccountCircle } from "react-icons/md";
import { FaTrashAlt } from "react-icons/fa";

export default function Friends() {
  const { myInfo } = useOutletContext();
  const friends = myInfo.friends;
  const sentRequests = friends.filter((x) => !x.accepted && x.sender);
  const receivedRequests = friends.filter((x) => !x.accepted && !x.sender);
  const actualFriends = friends.filter((x) => x.accepted);
  const [friendsInfo, setFriendsInfo] = React.useState([]);

  const [username, setUsername] = React.useState("");
  const [errorMessage, setErrorMessage] = React.useState(null);
  React.useEffect(() => {
    async function friends() {
      await getFriends(myInfo, setFriendsInfo);
    }
    friends();
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
                className="text-red-600 mr-2"
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
          return (
            <div
              key={friend.userid}
              className="flex items-center group relative"
            >
              {currentFriend.profilePic ? (
                <img
                  src={currentFriend.profilePic}
                  className="w-5 h-5 object-cover bg-gray-200 rounded-full"
                />
              ) : (
                <MdAccountCircle size={20} />
              )}
              <p className="ml-2">{currentFriend && currentFriend.username}</p>
              <button
                className="right-0 top-1 absolute opacity-0 group-hover:opacity-100 transition-opacity duration-100"
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
            <div key={friend.userid} className="relative group">
              <p>{currentFriend && currentFriend.username}</p>
              <button
                className="right-0 top-1 absolute opacity-0 group-hover:opacity-100 transition-opacity duration-100"
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
    <div className="mx-2 flex flex-col h-full">
      {errorMessage && (
        <h3 className="font-bold text-center text-lg text-red-600">
          {errorMessage}
        </h3>
      )}
      <form type="post" className="flex flex-row justify-between mt-2">
        <input
          type="text"
          name="username"
          placeholder="Add friend (username)"
          className="border-2 rounded px-1 w-3/5"
          value={username}
          onChange={(event) => setUsername(event.target.value)}
        />
        <button
          className="bg-teal-500 rounded-full drop-shadow-md text-white place-content-center flex text-md px-1 w-24"
          onClick={(event) => submit(event)}
        >
          Send
        </button>
      </form>
      <div className="flex flex-col flex-grow">
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
