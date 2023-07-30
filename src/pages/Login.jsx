import React from "react";
import {
  Link,
  useLoaderData,
  useNavigate,
  useOutletContext,
} from "react-router-dom";
import EmainSignin from "../components/AccountPieces/EmailSignin";
import GoogleSignIn from "../components/AccountPieces/GoogleSignIn";
import ErrorMessage from "../components/ErrorMessage";

export function loader({ request }) {
  return new URL(request.url).searchParams;
}

export default function Login() {
  const { myInfo } = useOutletContext();
  const searchParams = useLoaderData();
  const navigate = useNavigate();
  const [errorMessage, setErrorMessage] = React.useState(null);

  React.useEffect(() => {
    if (myInfo) {
      const pathname = searchParams.get("redirectTo") || "/competitions";
      return navigate(pathname, { replace: true });
    }
  }, [myInfo]);

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
      <ErrorMessage message={errorMessage} />
      <EmainSignin
        setErrorMessage={setErrorMessage}
        errorMessage={errorMessage}
      />
      <h4>
        Don't have an account yet?{" "}
        <Link to="/signup" className="underline">
          Sign up!
        </Link>
      </h4>
      <h4 className="mt-2 text-sm">
        Or you can sign in with one of the following:
      </h4>
      <GoogleSignIn
        setErrorMessage={setErrorMessage}
        errorMessage={errorMessage}
      />
    </div>
  );
}
