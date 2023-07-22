import React from "react";
import { useOutletContext } from "react-router-dom";
import {
  addFriend,
  getFriends,
  acceptFriend,
  rejectFriend,
} from "../util-js/friends-api";
import { MdAccountCircle } from "react-icons/md";

export default function Friends() {
  const { myInfo } = useOutletContext();
  const friends = myInfo.friends;
  const sentRequests = friends.filter((x) => !x.accepted && x.sender);
  const receivedRequests = friends.filter((x) => !x.accepted && !x.sender);
  const actualFriends = friends.filter((x) => x.accepted);
  const [friendsInfo, setFriendsInfo] = React.useState([]);

  const [username, setUsername] = React.useState("");

  React.useEffect(() => {
    async function friends() {
      setFriendsInfo(await getFriends(myInfo));
    }
    friends();
  }, [myInfo]);

  const sentElements =
    friendsInfo && friendsInfo.length != 0
      ? sentRequests.map((friend) => {
          const currentFriend = friendsInfo.find(
            (x) => x.userid == friend.userid
          );
          return (
            <div key={friend.userid}>
              {currentFriend && currentFriend.username}
            </div>
          );
        })
      : [];

  async function accFriend(currFriend) {
    await acceptFriend(currFriend, myInfo);
  }

  async function rejFriend(currFriend) {
    await rejectFriend(currFriend, myInfo);
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
                onClick={() => rejFriend(currentFriend)}
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
            <div key={friend.userid} className="flex items-center">
              {currentFriend.profilePic ? (
                <img
                  src={currentFriend.profilePic}
                  className="w-5 bg-gray-200 rounded-full"
                />
              ) : (
                <MdAccountCircle size={20} />
              )}
              <p className="ml-2">{currentFriend && currentFriend.username}</p>
            </div>
          );
        })
      : [];

  async function submit() {
    if (!username) {
      return;
    }
    try {
      await addFriend(username, myInfo);
      return null;
    } catch (err) {
      return err.message;
    }
  }
  return (
    <div className="mx-2 flex flex-col h-full">
      {/* {errorMessage && (
        <h3 className="font-bold text-center text-lg text-red-600">
          {errorMessage}
        </h3>
      )} */}
      <div className="flex flex-row justify-between mt-2">
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
          onClick={submit}
        >
          Send
        </button>
      </div>
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
