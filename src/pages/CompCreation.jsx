import React from "react";
import { Form, useActionData, redirect, useNavigation } from "react-router-dom";
import { requireAuth } from "../util-js/requireAuth";
import { addCompetition, myInfo } from "../util-js/api";
import CompThumbnail from "../components/CompThumbnail";

export async function action({ request }) {
    const formData = await request.formData()
    const name = formData.get("name")
    const image = formData.get("image")
    const player = formData.get("player2")
    try {
        const id = await addCompetition({
            name: name,
            image: image,
            player: player,
        })
        return redirect(`../competitions/${id}`)
    } catch (err) {
        return err.message
    }
}

export default function CompCreation() {
    const errorMessage = useActionData()
    const navigation = useNavigation()

    const [data, setData] = React.useState({
        name: "",
        image: "",
        player1: myInfo.username,
        player2: "",
    })

    function handleChange(event) {
        const { name, value } = event.target
        setData(prevData => ({
            ...prevData,
            [name]: value
        }))
    }

    return (
        <div className="flex flex-col items-center">
            {errorMessage && <h3 className="font-bold text-center text-lg text-red-600">{errorMessage}</h3>}
            <h3 className="font-bold text-center text-lg">Preview</h3>
            <CompThumbnail
                status="ongoing"
                image={data.image}
                name={data.name}
                players={[data.player1, data.player2]}
                currentScore={[0, 0]}
            />
            <Form
                method="post"
                className="flex flex-col items-center w-full p-5 "
                replace
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
                <input
                    type="text"
                    name="player2"
                    placeholder="Other player"
                    value={data.player2}
                    onChange={handleChange}
                    className="border-2 rounded p-1 m-2 w-5/6 text-center"
                />
                <button
                    disabled={navigation.state === "submitting"}
                    className={`${navigation.state === "submitting" ? "bg-gray-200" : "bg-blue-500"} text-white drop-shadow-xl rounded py-1 px-2 m-2 w-1/2`}
                >
                    {navigation.state === "submitting"
                        ? "Creating..."
                        : "Create"
                    }
                </button>
            </Form>
        </div>
    )
}