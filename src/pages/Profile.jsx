import React from "react";
import { googleSignOut, myInfo, updateProfile } from "../util-js/api"
import { Form, useActionData, useNavigate, useNavigation, useRevalidator } from "react-router-dom";

export async function action({ request }) {
    const formData = await request.formData()
    const username = formData.get("username")
    const profilePic = formData.get("profilePic")
    try {
        return await updateProfile({
            username: username,
            profilePic: profilePic
        })
    } catch (err) {
        return err.message
    }
}

export default function Profile() {
    const revalidator = useRevalidator()
    const navigate = useNavigate();
    const errorMessage = useActionData()
    const navigation = useNavigation()

    function logout() {
        googleSignOut()
        revalidator.revalidate()
        navigate("/")
    }

    const [data, setData] = React.useState({
        username: myInfo.username,
        profilePic: myInfo.profilePic,
    })

    function handleChange(event) {
        const { name, value } = event.target
        setData(prevData => ({
            ...prevData,
            [name]: value
        }))
    }

    return (
        <div className="flex flex-col items-center h-full">
            {errorMessage && <h3 className="font-bold text-center text-lg text-red-600">{errorMessage}</h3>}
            <h3 className="font-bold text-center text-lg">Profile</h3>
            <div className="h-32">
                <img src={data.profilePic} className="w-32 rounded-full" />
            </div>
            <Form
                method="post"
                className="flex flex-col items-center w-full p-5 "
                replace
            >
                <label htmlFor="username">Username</label>
                <input
                    type="text"
                    name="username"
                    placeholder="Username"
                    value={data.username}
                    onChange={handleChange}
                    className="border-2 rounded p-1 m-2 w-5/6 text-center"
                />
                <label htmlFor="profilpic">Profile Pic</label>
                <input
                    type="url"
                    name="profilePic"
                    placeholder="Profile Picture"
                    value={data.profilePic}
                    onChange={handleChange}
                    className="border-2 rounded p-1 m-2 w-5/6 text-center"
                />
                <button
                    disabled={navigation.state === "submitting"}
                    className={`${navigation.state === "submitting" ? "bg-gray-200" : "bg-blue-500"} text-white drop-shadow-xl rounded py-1 px-2 m-2 w-1/2`}
                >
                    {navigation.state === "submitting"
                        ? "Updating..."
                        : "Update Profile"
                    }
                </button>
            </Form>
            <button
                className="mt-auto mb-2 p-1 px-3 text-lg mx-auto bg-red-500 rounded-full drop-shadow-md text-white cursor-pointer"
                onClick={logout}
            >
                Sign out
            </button>
        </div>
    )
}