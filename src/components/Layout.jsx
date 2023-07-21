import React from "react"
import { Outlet, useLoaderData } from "react-router-dom"
import Header from "./Header"
import Footer from "./Footer"
import "./Layout.css"
import { isLoggedIn } from "../util-js/api"

export async function loader() {
    return isLoggedIn()
}

export default function Layout() {
    const isLoggedIn = useLoaderData()
    return (
        <div className="w-screen h-screen flex flex-col justify-center items-center">
            <Header isLoggedIn={isLoggedIn} />
            <main className="flex-grow w-80 overflow-y-auto no-scrollbar relative border-x-2 border-gray-300">
                <Outlet />
            </main>
            <Footer />
        </div>
    )
}