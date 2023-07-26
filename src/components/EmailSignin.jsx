import { getAuth } from "firebase/auth";
import React from "react";
import { useSignInWithEmailAndPassword } from "react-firebase-hooks/auth";

export default function EmainSignin(props) {
  const [signInWithEmailAndPassword, user, loading, error] =
    useSignInWithEmailAndPassword(getAuth());

  const [data, setData] = React.useState({
    email: "",
    password: "",
  });

  React.useEffect(() => {
    console.log("Signin");
    if (error && error.message != props.setErrorMessage) {
      console.log("SigninIf");
      props.setErrorMessage(error.message);
    }
  }, [error]);

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
