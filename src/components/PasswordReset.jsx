import { getAuth } from "firebase/auth";
import React from "react";
import { useSendPasswordResetEmail } from "react-firebase-hooks/auth";

export default function PasswordReset(props) {
  const [sendPasswordResetEmail, sending, error] = useSendPasswordResetEmail(
    getAuth()
  );

  const [success, setSuccess] = React.useState(false);

  React.useEffect(() => {
    if (error && error.message != props.setErrorMessage) {
      props.setErrorMessage(error.message);
    }
  }, [error]);

  async function resetEmail(event) {
    event.preventDefault();
    if (!props.email) {
      props.setErrorMessage("Please enter your email");
      return;
    }
    setSuccess(await sendPasswordResetEmail(props.email));
  }

  return (
    <>
      {!success ? (
        <h4 className="text-sm">
          Forgot your password?{" "}
          <span className="cursor-pointer underline" onClick={resetEmail}>
            Send Email
          </span>
        </h4>
      ) : (
        <h4>Sent! Check your email</h4>
      )}
    </>
  );
}
