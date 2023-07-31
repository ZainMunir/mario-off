import { getAuth } from "firebase/auth";
import React from "react";
import { useDeleteUser } from "react-firebase-hooks/auth";
import ReactModal from "react-modal";
import { deleteAccount } from "../util-js/api";
import { useNavigate } from "react-router-dom";

export default function DeleteAccount(props) {
  const [deleteUser, loading, error] = useDeleteUser(getAuth());
  const [isModalOpen, setIsModalOpen] = React.useState(false);
  const navigate = useNavigate();

  React.useEffect(() => {
    if (error && error.message != props.setErrorMessage) {
      props.setErrorMessage(error.message);
    }
  }, [error]);

  async function delAccount() {
    await deleteAccount(props.myInfo);
    await deleteUser();
    return navigate("/", { replace: true });
  }

  return (
    <>
      <ReactModal
        isOpen={isModalOpen}
        contentLabel="DeleteModal"
        overlayClassName="bg-opacity-50 bg-black w-screen h-screen fixed top-0 left-0 z-20"
        className="absolute left-1/2 top-1/2  flex h-80 w-72 -translate-x-1/2 -translate-y-1/2 flex-col place-content-center justify-between rounded-xl bg-gray-200 p-4 text-center drop-shadow-xl "
        appElement={document.getElementById("root")}
      >
        <p>
          Are you sure you want to delete your account? <br /> This action is
          irreversible and you will lose access to all your competitions as well
          as your username. Your profile picture will be also be removed.
          <br /> If your account is marked as deleted, we may free up the
          associated username in the future.
        </p>
        <div className="flex flex-row ">
          <div
            className="text-md mx-auto mt-auto w-24 cursor-pointer rounded-full bg-green-400 text-white drop-shadow-md "
            onClick={() => setIsModalOpen(false)}
          >
            Cancel
          </div>
          <div
            className="text-md mx-auto mt-auto w-24 cursor-pointer rounded-full bg-red-500 text-white  drop-shadow-md "
            onClick={delAccount}
          >
            Delete
          </div>
        </div>
      </ReactModal>
      <div
        className="rounded-full bg-red-500 px-3 py-1 text-lg text-white drop-shadow-md dark:bg-red-900 sm:py-2 sm:text-2xl"
        onClick={() => setIsModalOpen(true)}
      >
        Delete Account
      </div>
    </>
  );
}
