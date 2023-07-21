import React from "react";
import { Form, useActionData, redirect, useNavigation, useNavigate } from "react-router-dom";
import { addCompetition, getFriends, myInfo } from "../util-js/api";
import CompThumbnail from "../components/CompThumbnail";

export default function CompCreation() {
    const navigation = useNavigation()
    const navigate = useNavigate()

    const [friendsInfo, setFriendsInfo] = React.useState([])

    React.useEffect(() => {
        async function friends() {
            setFriendsInfo(await getFriends())
        }
        friends()
    }, [myInfo])

    const [data, setData] = React.useState({
        name: "",
        image: "",
        player2: "",
        player2Id: "",
    })
    console.log(data)
    function handleChange(event) {
        const { name, value } = event.target
        setData(prevData => {
            if (name == "player2") {
                return {
                    ...prevData,
                    [name]: value,
                    player2Id: event.target[event.target.selectedIndex].id
                }
            }
            return {
                ...prevData,
                [name]: value
            }
        })

    }

    const friendOptions = friendsInfo.map(friend => {
        return (
            <option key={friend.userid} id={friend.userid}>{friend.username}</option>
        )
    })

    async function submit() {
        if (data.name == "" || data.player2Id == "") return
        try {
            const id = await addCompetition({
                name: data.name,
                image: data.image,
                player: data.player2Id,
            })
            return navigate(`../competitions/${id}`)
        } catch (err) {
            return err.message
        }
    }

    return (
        <div className="flex flex-col items-center">
            <h3 className="font-bold text-center text-lg">Preview</h3>
            <CompThumbnail
                status="ongoing"
                image={data.image}
                name={data.name}
                players={[myInfo.userid, data.player2Id]}
                currentScore={[0, 0]}
            />
            <div
                className="flex flex-col items-center w-full p-5 "
            >
                <input
                    type="text"
                    name="name"
                    placeholder="Competition Name"
                    value={data.name}
                    onChange={handleChange}
                    className="border-2 rounded p-1 m-2 w-5/6 text-center"
                />
                <input
                    type="url"
                    name="image"
                    placeholder="Thumbnail picture"
                    value={data.image}
                    onChange={handleChange}
                    className="border-2 rounded p-1 m-2 w-5/6 text-center"
                />
                <select
                    name="player2"
                    placeholder="Other player"
                    value={data.player2}
                    onChange={handleChange}
                    className="border-2 rounded p-1 m-2 w-5/6 text-center"
                    required
                >
                    <option value="" disabled selected>Select your option</option>
                    {friendOptions}
                </select>
                <button
                    disabled={navigation.state === "submitting"}
                    className={`${navigation.state === "submitting" ? "bg-gray-200" : "bg-blue-500"} text-white drop-shadow-xl rounded py-1 px-2 m-2 w-1/2`}
                    onClick={submit}
                >
                    {navigation.state === "submitting"
                        ? "Creating..."
                        : "Create"
                    }
                </button>
            </div>
        </div>
    )
}