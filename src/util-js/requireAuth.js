import { redirect } from "react-router-dom"
import { isLoggedIn } from "./api"

export async function requireAuth(request) {
    const pathname = new URL(request.url).pathname
    const loggedIn = await isLoggedIn()
    console.log(loggedIn)
    if (!loggedIn) {
        throw redirect(
            `/login?message=You must log in first.&redirectTo=${pathname}`
        )
    }
    return null
}

