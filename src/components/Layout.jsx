import React from "react"
import { Outlet, useLoaderData } from "react-router-dom"
import Header from "./Header"
import Footer from "./Footer"
import "./Layout.css"

export async function loader() {
    return localStorage.getItem("loggedIn")
}

export default function Layout() {
    const isLoggedIn = useLoaderData()

    return (
        <div className="w-screen h-screen flex flex-col justify-center items-center ">
            <Header isLoggedIn={isLoggedIn} />
            <main className="flex-grow w-80 my-5 mx-2 overflow-y-auto no-scrollbar ">
                <Outlet />
            </main>
            <Footer />
        </div>
    )
}