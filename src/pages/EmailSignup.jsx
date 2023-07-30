import React from "react";
import { useNavigate, useOutletContext } from "react-router-dom";
import { getAuth } from "firebase/auth";
import { useCreateUserWithEmailAndPassword } from "react-firebase-hooks/auth";
import { addNewEmailUser } from "../util-js/api";
import ErrorMessage from "../components/ErrorMessage";

export default function EmailSignup() {
  const [createUserWithEmailAndPassword, user, loading, error] =
    useCreateUserWithEmailAndPassword(getAuth());
  const [errorMessage, setErrorMessage] = React.useState(null);
  const { myInfo } = useOutletContext();
  const navigate = useNavigate();

  React.useEffect(() => {
    if (myInfo) {
      return navigate("/profile", { replace: true });
    }
  }, [myInfo]);

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
      setErrorMessage("Please enter both fields");
      return;
    }
    await createUserWithEmailAndPassword(data.email, data.password).then(
      async (result) => {
        if (!result) return;
        await addNewEmailUser(result.user.uid);
      }
    );
  }

  return (
    <div className="mx-auto flex max-w-xl flex-grow flex-col items-center p-2">
      <h1 className="text-center text-2xl font-bold sm:text-4xl">
        Sign up with email
      </h1>
      <ErrorMessage message={errorMessage} />
      <form
        type="post"
        className="mx-auto flex w-full flex-col items-center p-5"
      >
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
          {loading ? "Signing up..." : "Sign up!"}
        </button>
      </form>
    </div>
  );
}
