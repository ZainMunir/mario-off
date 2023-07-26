import { getAdditionalUserInfo, getAuth } from "firebase/auth";
import React from "react";
import { useSignInWithGoogle } from "react-firebase-hooks/auth";
import { FcGoogle } from "react-icons/fc";
import { addNewUser } from "../util-js/api";

export default function GoogleSignIn(props) {
  const [signInWithGoogle, user, loading, error] = useSignInWithGoogle(
    getAuth()
  );

  React.useEffect(() => {
    console.log("Google");
    if (error && error.message != props.setErrorMessage) {
      console.log("GoogleIf");
      props.setErrorMessage(error.message);
    }
  }, [error]);

  async function signIn() {
    signInWithGoogle().then(async (result) => {
      if (!result) return;
      const details = getAdditionalUserInfo(result);
      if (details.isNewUser) {
        await addNewUser(result.user);
      }
    });
  }

  return (
    <div className="m-5 flex w-full flex-col items-center sm:text-xl">
      <button
        disabled={loading}
        className={`${
          loading ? "bg-gray-700" : "bg-blue-600 dark:bg-blue-900"
        } m-2 flex w-2/3 max-w-xs items-center justify-between rounded px-2 py-1 text-white drop-shadow-xl`}
        onClick={signIn}
      >
        <FcGoogle size={20} />
        {loading ? "Signing in..." : "Google Sign in"}
      </button>
    </div>
  );
}
