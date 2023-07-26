import React from "react";
import {
  Link,
  useLoaderData,
  useNavigate,
  useOutletContext,
} from "react-router-dom";
import { useSignInWithGoogle } from "react-firebase-hooks/auth";
import { getAdditionalUserInfo, getAuth } from "firebase/auth";
import { addNewUser } from "../util-js/api";
import EmainSignin from "../components/EmailSignin";

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
      return navigate(pathname, { replace: true });
    }
  }, [myInfo]);

  async function signIn() {
    signInWithGoogle().then(async (result) => {
      const details = getAdditionalUserInfo(result);
      if (details.isNewUser) {
        await addNewUser(result.user);
      }
    });
  }

  return (
    <div className="mx-auto flex max-w-xl flex-grow flex-col items-center p-2">
      <h1 className="text-center text-2xl font-bold sm:text-4xl">
        Sign in to your account
      </h1>
      {searchParams.get("message") && (
        <h3 className="text-center text-xl font-bold text-red-600">
          {searchParams.get("message")}
        </h3>
      )}
      {error && (
        <h4 className="text-md text-center font-bold text-red-600">
          {error.message}
        </h4>
      )}
      <EmainSignin />
      <h4>
        Don't have an account yet?{" "}
        <Link to="/signup" className="underline">
          Sign up!
        </Link>
      </h4>
      <h4 className="mt-2 text-sm">
        Or you can sign in with one of the following:
      </h4>
      <div className="m-5 flex w-full flex-col items-center sm:text-xl">
        <button
          disabled={loading}
          className={`${
            loading ? "bg-gray-700" : "bg-blue-600 dark:bg-blue-900"
          } m-2 w-2/3 max-w-xs rounded px-2 py-1 text-white drop-shadow-xl `}
          onClick={signIn}
        >
          {loading ? "Logging in..." : "Sign in with Google"}
        </button>
      </div>
    </div>
  );
}
