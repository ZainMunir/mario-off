import React from "react";
import { getAuth } from "firebase/auth";
import { useSignInWithEmailAndPassword } from "react-firebase-hooks/auth";
import PasswordReset from "./PasswordReset";

export default function EmainSignin(props) {
  const [signInWithEmailAndPassword, user, loading, error] =
    useSignInWithEmailAndPassword(getAuth());

  React.useEffect(() => {
    if (error && error.message != props.setErrorMessage) {
      props.setErrorMessage(error.message);
    }
  }, [error]);

  const [data, setData] = React.useState({
    email: "",
    password: "",
  });

  function handleChange(event) {
    const { name, value } = event.target;
    setData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  }

  async function submit(event) {
    event.preventDefault();
    if (!data.email || !data.password) {
      props.setErrorMessage("Please enter both fields");
      return;
    }
    await signInWithEmailAndPassword(data.email, data.password);
  }

  return (
    <form type="post" className="mx-auto flex w-full flex-col items-center p-5">
      <input
        type="email"
        name="email"
        placeholder="Email"
        value={data.email}
        onChange={handleChange}
        className="m-2 w-5/6 max-w-xs rounded border-2 p-1  dark:border-gray-600 dark:bg-gray-700"
      />
      <input
        type="password"
        name="password"
        placeholder="Password"
        value={data.password}
        onChange={handleChange}
        className="m-2 w-5/6  max-w-xs rounded border-2 p-1  dark:border-gray-600 dark:bg-gray-700"
      />
      <PasswordReset
        setErrorMessage={props.setErrorMessage}
        email={data.email}
      />
      <button
        disabled={loading}
        className={`${
          loading ? "bg-gray-700" : "bg-blue-600 dark:bg-blue-900"
        } m-2 w-28 rounded px-2 py-1 text-white drop-shadow-xl `}
        onClick={submit}
      >
        {loading ? "Signing in..." : "Sign in"}
      </button>
    </form>
  );
}
