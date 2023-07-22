import React from "react";
import {
  useActionData,
  useLoaderData,
  useNavigation,
  Form,
  redirect,
} from "react-router-dom";
import { googleSignIn } from "../util-js/api";

export function loader({ request }) {
  return new URL(request.url).searchParams;
}

export async function action({ request }) {
  const pathname =
    new URL(request.url).searchParams.get("redirectTo") || "/competitions";

  try {
    const data = await googleSignIn();
    return redirect(pathname);
  } catch (err) {
    return err.message;
  }
}

export default function Login() {
  const errorMessage = useActionData();
  const message = useLoaderData();
  const navigation = useNavigation();

  return (
    <div className="p-2">
      <h1 className="font-bold text-center text-2xl">
        Sign in to your account
      </h1>
      {message && (
        <h3 className="font-bold text-center text-xl text-red-600">
          {message.get("message")}
        </h3>
      )}
      {errorMessage && (
        <h3 className="font-bold text-center text-lg text-red-600">
          {errorMessage}
        </h3>
      )}

      <Form method="post" className="flex flex-col items-center m-5" replace>
        <button
          disabled={navigation.state === "submitting"}
          className={`${
            navigation.state === "submitting" ? "bg-gray-200" : "bg-blue-500"
          } text-white drop-shadow-xl rounded py-1 px-2 m-2 w-2/3`}
        >
          {navigation.state === "submitting"
            ? "Logging in..."
            : "Sign in with Google"}
        </button>
      </Form>
    </div>
  );
}
