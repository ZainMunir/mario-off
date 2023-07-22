import React from "react";
import {
  redirect,
  useLoaderData,
  useNavigate,
  useOutletContext,
} from "react-router-dom";
import { useSignInWithGoogle } from "react-firebase-hooks/auth";
import { getAuth } from "@firebase/auth";

export function loader({ request }) {
  return new URL(request.url).searchParams;
}

export default function Login() {
  const searchParams = useLoaderData();
  const { myInfo } = useOutletContext();
  const navigate = useNavigate();
  const [signInWithGoogle, user, loading, error] = useSignInWithGoogle(
    getAuth()
  );
  React.useEffect(() => {
    if (myInfo) {
      const pathname = searchParams.get("redirectTo") || "/competitions";
      return navigate(pathname);
    }
  }, [myInfo]);

  return (
    <div className="p-2">
      <h1 className="font-bold text-center text-2xl">
        Sign in to your account
      </h1>
      {searchParams.get("message") && (
        <h3 className="font-bold text-center text-xl text-red-600">
          {searchParams.get("message")}
        </h3>
      )}
      <div className="flex flex-col items-center m-5">
        <button
          disabled={loading}
          className={`${
            loading ? "bg-gray-200" : "bg-blue-500"
          } text-white drop-shadow-xl rounded py-1 px-2 m-2 w-2/3`}
          onClick={() => signInWithGoogle()}
        >
          {loading ? "Logging in..." : "Sign in with Google"}
        </button>
      </div>
    </div>
  );
}
