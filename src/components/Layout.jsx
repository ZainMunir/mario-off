import React from "react";
import { Outlet } from "react-router-dom";
import { useAuthState } from "react-firebase-hooks/auth";
import { getAuth } from "@firebase/auth";
import { keepMyInfoUpdated } from "../util-js/api";
import Header from "./Header";
import Footer from "./Footer";
import "./Layout.css";

export default function Layout() {
  const [myInfo, setMyInfo] = React.useState(null);
  const [user, loading, error] = useAuthState(getAuth());

  React.useEffect(() => {
    if (user) {
      return keepMyInfoUpdated(user.uid, setMyInfo);
    } else {
      setMyInfo(null);
    }
  }, [user]);

  return (
    <div className="flex h-screen w-screen flex-col items-center justify-center">
      <Header isLoggedIn={user && true} myInfo={myInfo} />
      <main className="no-scrollbar relative w-80 flex-grow overflow-y-auto border-x-2 border-gray-300">
        {loading || (user && !myInfo) ? (
          <h1 className="m-2 text-xl">Loading...</h1>
        ) : (
          <Outlet context={{ myInfo }} />
        )}
      </main>
      <Footer />
    </div>
  );
}
