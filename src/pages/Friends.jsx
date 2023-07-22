import React from "react";
import { Form, useActionData, useNavigate, useNavigation, useRevalidator } from "react-router-dom";
import { myInfo, addFriend, getFriends, acceptFriend, rejectFriend } from "../util-js/api"
import EmptyProfile from "../assets/profile-pic.png"

export async function action({ request }) {
    const formData = await request.formData()
    const username = formData.get("username")
    if (!username) {
        return "Please enter something"
    }
    try {
        await addFriend(username)
        return null
    } catch (err) {
        return err.message
    }
}

export default function Friends() {
    const errorMessage = useActionData()
    const navigation = useNavigation()
    const navigate = useNavigate()

    const friends = myInfo.friends
    const sentRequests = friends.filter(x => !x.accepted && x.sender)
    const receivedRequests = friends.filter(x => !x.accepted && !x.sender)
    const actualFriends = friends.filter(x => x.accepted)
    const [friendsInfo, setFriendsInfo] = React.useState([])

    React.useEffect(() => {
        async function friends() {
            setFriendsInfo(await getFriends())
        }
        friends()
    }, [myInfo])

    const sentElements = friendsInfo.length ? sentRequests.map(friend => {
        const currentFriend = friendsInfo.find(x => x.userid == friend.userid)
        return (
            <div key={friend.userid}>
                {currentFriend && currentFriend.username}
            </div>
        )
    }) : []

    async function accFriend(currFriend) {
        await acceptFriend(currFriend)
        navigate(".")
    }

    async function rejFriend(currFriend) {
        await rejectFriend(currFriend)
        navigate(".")
    }

    const receivedElements = friendsInfo.length ? receivedRequests.map(friend => {
        const currentFriend = friendsInfo.find(x => x.userid == friend.userid)
        return (
            <div
                key={friend.userid}
                className="flex"
            >
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
        )
    }) : []

    const actualFriendsElements = friendsInfo.length ? actualFriends.map(friend => {
        const currentFriend = friendsInfo.find(x => x.userid == friend.userid)
        return (
            <div key={friend.userid} className="flex">
                <img
                    src={currentFriend.profilePic || EmptyProfile}
                    className="w-5 self-center bg-gray-200 rounded-full mr-2" />
                {currentFriend && currentFriend.username}
            </div>
        )
    }) : []


    return (
        <div className="mx-2 flex flex-col h-full">
            {errorMessage && <h3 className="font-bold text-center text-lg text-red-600">{errorMessage}</h3>}
            <Form
                method="post"
                className="flex flex-row justify-between mt-2">
                <input
                    type="text"
                    name="username"
                    placeholder="Add friend (username)"
                    className="border-2 rounded px-1 w-3/5"
                />
                <button
                    className={`${navigation.state === "submitting" ? "bg-gray-300" : "bg-teal-500"} rounded-full drop-shadow-md text-white place-content-center flex text-md px-1 w-24`}
                >
                    {navigation.state === "submitting"
                        ? "Sending..."
                        : "Send"
                    }
                </button>
            </Form>
            <div className="flex flex-col flex-grow">
                {receivedElements.length > 0 &&
                    <>
                        <h1 className="mt-2 font-bold">Friend Requests</h1>
                        <div>
                            {receivedElements}
                        </div>
                    </>}
                {actualFriendsElements.length > 0 &&
                    <>
                        <h1 className="mt-2 font-bold">Friends</h1>
                        <div>
                            {actualFriendsElements}
                        </div>
                    </>}
                {sentElements.length > 0 &&
                    <>
                        <h1 className="mt-auto font-bold">Sent Requests</h1>
                        <div    >
                            {sentElements}
                        </div>
                    </>}
            </div>
        </div>
    )
}