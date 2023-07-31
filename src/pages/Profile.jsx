import React from "react";
import { useNavigate, useOutletContext } from "react-router-dom";
import { useSignOut } from "react-firebase-hooks/auth";
import { getAuth } from "@firebase/auth";
import ReactImageFallback from "react-image-fallback";
import { updateProfile } from "../util-js/api";
import { MdAccountCircle } from "react-icons/md";
import ErrorMessage from "../components/ErrorMessage";
import NotFound from "../assets/image-not-found.png";
import DeleteAccount from "../components/DeleteAccount";

export default function Profile() {
  const { myInfo, setDarkMode } = useOutletContext();
  const navigate = useNavigate();
  const [signOut, loading, error] = useSignOut(getAuth());
  const [errorMessage, setErrorMessage] = React.useState(null);

  const [data, setData] = React.useState({
    username: myInfo && myInfo.username,
    profilePic: myInfo && myInfo.profilePic,
  });

  if (!myInfo) {
    return navigate("/", { replace: true });
  }

  function handleChange(event) {
    const { name, value } = event.target;
    setData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  }

  async function submit(event) {
    event.preventDefault();
    const message = await updateProfile({
      myInfo: myInfo,
      username: data.username,
      profilePic: data.profilePic,
    });
    setErrorMessage(message);
  }

  const darkValue = localStorage.getItem("theme") || "system";

  function handleDarkMode(event) {
    const { value } = event.target;
    if (value === "system") {
      localStorage.removeItem("theme");
      setDarkMode(window.matchMedia("(prefers-color-scheme: dark)").matches);
    } else if (value === "dark") {
      localStorage.setItem("theme", "dark");
      setDarkMode(true);
    } else if (value === "light") {
      localStorage.setItem("theme", "light");
      setDarkMode(false);
    }
  }

  return (
    <div className="mx-auto flex max-w-xl flex-grow flex-col items-center border-x-2 dark:border-gray-700">
      <ErrorMessage message={errorMessage} />
      <h3 className="mb-2 text-center text-2xl font-bold sm:text-5xl">
        Profile
      </h3>
      <div className="aspect-square w-1/3 max-w-xs">
        {data.profilePic ? (
          <ReactImageFallback
            src={data.profilePic}
            fallbackImage={NotFound}
            className="aspect-square w-full rounded-full border-2 bg-gray-100 object-cover"
          />
        ) : (
          <div className="flex h-full w-full place-content-center place-items-center">
            <MdAccountCircle size={128} />
          </div>
        )}
      </div>
      <form
        type="post"
        className="flex w-full flex-col items-center p-5 sm:text-2xl"
      >
        <label htmlFor="username">Username</label>
        <input
          type="text"
          name="username"
          placeholder="Username"
          value={data.username}
          onChange={handleChange}
          className="m-2 w-5/6 max-w-md rounded border-2 p-1 text-center dark:border-gray-600 dark:bg-gray-700"
        />
        <label htmlFor="profilpic">Profile Pic</label>
        <input
          type="url"
          name="profilePic"
          placeholder="Profile Picture"
          value={data.profilePic}
          onChange={handleChange}
          className="m-2 w-5/6 max-w-md rounded border-2 p-1 text-center dark:border-gray-600 dark:bg-gray-700"
        />
        <button
          className="m-2 w-1/2 max-w-xs rounded bg-blue-500 px-2 py-1 text-white drop-shadow-xl dark:bg-blue-900"
          onClick={(event) => submit(event)}
        >
          Update Profile
        </button>
      </form>
      <select
        name="status"
        className="mb-2 w-28 rounded-xl bg-gray-100 p-1 dark:bg-gray-700"
        defaultValue={darkValue}
        onChange={handleDarkMode}
      >
        <option value="system">System</option>
        <option value="light">Light</option>
        <option value="dark">Dark</option>
      </select>
      <div className="mb-2 mt-auto flex w-full justify-center gap-10">
        <button
          className="rounded-full bg-teal-500 px-3 py-1 text-lg text-white drop-shadow-md dark:bg-teal-800 sm:py-2 sm:text-2xl"
          onClick={async () => await signOut()}
          disabled={loading}
        >
          Sign out
        </button>
        <DeleteAccount setErrorMessage={setErrorMessage} myInfo={myInfo} />
      </div>
    </div>
  );
}
