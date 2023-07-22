import React from "react";
import { Outlet, useLoaderData } from "react-router-dom";
import Header from "./Header";
import Footer from "./Footer";
import "./Layout.css";
import { getPersonInfo, keepMyInfoUpdated } from "../util-js/api";
import { getAuth } from "@firebase/auth";
import { useAuthState } from "react-firebase-hooks/auth";

export default function Layout() {
  const isLoggedIn = useLoaderData();
  const [myInfo, setMyInfo] = React.useState(null);
  const [user, loading, error] = useAuthState(getAuth());

  React.useEffect(() => {
    async function getInfo() {
      if (user) {
        await keepMyInfoUpdated(user.uid, setMyInfo);
      } else {
        setMyInfo(null);
      }
    }
    getInfo();
  }, [user]);

  if (loading || (user && !myInfo)) {
    return <h1>Loading...</h1>;
  }

  return (
    <div className="w-screen h-screen flex flex-col justify-center items-center">
      <Header isLoggedIn={user && true} myInfo={myInfo} />
      <main className="flex-grow w-80 overflow-y-auto no-scrollbar relative border-x-2 border-gray-300">
        <Outlet context={{ myInfo }} />
      </main>
      <Footer />
    </div>
  );
}
