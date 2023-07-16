import React from "react";
import {
    useActionData,
    useLoaderData,
    useNavigation,
    Form,
    redirect
} from "react-router-dom"
import { loginUser } from "../util-js/api"



export function loader({ request }) {
    return new URL(request.url).searchParams.get("message")
}

export async function action({ request }) {
    const formData = await request.formData()
    const email = formData.get("email")
    const password = formData.get("password")
    const pathname = new URL(request.url)
        .searchParams.get("redirectTo") || "/mario-off/competitions"

    try {
        const data = await loginUser({ email, password })
        localStorage.setItem("loggedIn", true)
        localStorage.setItem("userID", data.userId)
        return redirect(pathname)
    } catch (err) {
        return err.message
    }
}

export default function Login() {
    const errorMessage = useActionData()
    const message = useLoaderData()
    const navigation = useNavigation()
    return (
        <div>
            <h1 className="font-bold text-center text-2xl">Sign in to your account</h1>
            {message && <h3 className="font-bold text-center text-xl text-red-600">{message}</h3>}
            {errorMessage && <h3 className="font-bold text-center text-lg text-red-600">{errorMessage}</h3>}

            <Form
                method="post"
                className="flex flex-col items-center m-5"
                replace
            >
                <input
                    name="email"
                    type="email"
                    placeholder="Email address"
                    className="border-2 rounded p-1 m-2"
                />
                <input
                    name="password"
                    type="password"
                    placeholder="Password"
                    className="border-2 rounded p-1 m-2"
                />
                <button
                    disabled={navigation.state === "submitting"}
                    className={`${navigation.state === "submitting" ? "bg-gray-200" : "bg-blue-500"} text-white drop-shadow-xl rounded py-1 px-2 m-2 w-1/2`}
                >
                    {navigation.state === "submitting"
                        ? "Logging in..."
                        : "Log in"
                    }
                </button>
            </Form>        </div>
    )
}