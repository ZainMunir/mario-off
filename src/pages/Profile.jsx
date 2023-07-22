import React from "react";
import { updateProfile } from "../util-js/api";
import { useNavigation, useOutletContext } from "react-router-dom";
import { useSignOut } from "react-firebase-hooks/auth";
import { getAuth } from "@firebase/auth";

export default function Profile() {
  const navigation = useNavigation();
  const { myInfo } = useOutletContext();
  const [signOut, loading, error] = useSignOut(getAuth());

  const [data, setData] = React.useState({
    username: myInfo.username,
    profilePic: myInfo.profilePic,
  });

  function handleChange(event) {
    const { name, value } = event.target;
    setData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  }

  async function submit() {
    try {
      await updateProfile({
        myInfo: myInfo,
        username: data.username,
        profilePic: data.profilePic,
      });
    } catch (err) {
      return err.message;
    }
  }

  return (
    <div className="flex flex-col items-center h-full">
      {/* {errorMessage && (
        <h3 className="font-bold text-center text-lg text-red-600">
          {errorMessage}
        </h3>
      )} */}
      <h3 className="font-bold text-center text-lg">Profile</h3>
      <div className="h-32">
        <img src={data.profilePic} className="w-32 rounded-full" />
      </div>
      <div className="flex flex-col items-center w-full p-5 ">
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
          className={`${
            navigation.state === "submitting" ? "bg-gray-200" : "bg-blue-500"
          } text-white drop-shadow-xl rounded py-1 px-2 m-2 w-1/2`}
          onClick={submit}
        >
          {navigation.state === "submitting" ? "Updating..." : "Update Profile"}
        </button>
      </div>
      <button
        className="mt-auto mb-2 p-1 px-3 text-lg mx-auto bg-red-500 rounded-full drop-shadow-md text-white cursor-pointer"
        onClick={async () => await signOut()}
      >
        Sign out
      </button>
    </div>
  );
}
