import React from "react";
import ReactModal from "react-modal";
import { useOutletContext, useNavigate } from "react-router-dom";
import ReactImageFallback from "react-image-fallback";
import {
  deleteCompetition,
  updateCompetition,
} from "../util-js/competitions-api";
import CompScore from "../components/CompPieces/CompScore";
import ErrorMessage from "../components/ErrorMessage";
import { LuSwords } from "react-icons/lu";
import NotFound from "../assets/image-not-found.png";

export default function CompInfo(props) {
  let { currCompetition, isParticipant } = useOutletContext();
  const navigate = useNavigate();
  const [errorMessage, setErrorMessage] = React.useState(null);
  const [isModalOpen, setIsModalOpen] = React.useState(false);

  if (!currCompetition) {
    currCompetition = props.currCompetition;
    isParticipant = props.isParticipant;
  }

  const [data, setData] = React.useState({
    name: currCompetition.name,
    image: currCompetition.image,
    description: currCompetition.description,
    status: currCompetition.status,
    public: currCompetition.public,
  });

  React.useEffect(() => {
    setData({
      name: currCompetition.name,
      image: currCompetition.image,
      description: currCompetition.description,
      status: currCompetition.status,
      public: currCompetition.public,
    });
  }, [currCompetition]);

  function formatDate(date) {
    var d = new Date(date),
      month = "" + (d.getMonth() + 1),
      day = "" + d.getDate(),
      year = d.getFullYear();

    if (month.length < 2) month = "0" + month;
    if (day.length < 2) day = "0" + day;

    return [year, month, day].join("-");
  }
  const creationDate = formatDate(currCompetition.creationDate.toDate());
  const updatedDate = formatDate(currCompetition.updatedDate.toDate());

  async function deleteComp() {
    await deleteCompetition(currCompetition.id);
    navigate("../competitions", { replace: true });
  }

  function handleChange(event) {
    const { name, value } = event.target;
    setData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  }

  async function submit(event) {
    event.preventDefault();
    if (!data.name) {
      setErrorMessage("Competitions should have names");
      return;
    }
    try {
      await updateCompetition({
        id: currCompetition.id,
        name: data.name,
        image: data.image,
        status: data.status,
        description: data.description,
        public: data.public == "true" || data.public == true,
      });
      setErrorMessage(null);
    } catch (err) {
      setErrorMessage(err.message);
    }
  }

  const selectColor =
    data.status == "complete"
      ? "bg-green-400 dark:bg-green-700 "
      : data.status == "ongoing"
      ? "bg-orange-400 dark:bg-orange-600"
      : "bg-red-500 dark:bg-red-700";

  return (
    <form method="post" className="flex h-full flex-grow flex-col">
      <ErrorMessage message={errorMessage} />
      <ReactModal
        isOpen={isModalOpen}
        contentLabel="DeleteModal"
        overlayClassName="bg-opacity-50 bg-black w-screen h-screen fixed top-0 left-0 z-20"
        className="absolute left-1/2 top-1/2  flex h-40 w-72 -translate-x-1/2 -translate-y-1/2 flex-col place-content-center justify-between rounded-xl bg-gray-200 p-4 text-center drop-shadow-xl "
        appElement={document.getElementById("root")}
      >
        <p>
          Are you sure you want to delete this competition? <br /> This action
          is irreversible
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
            onClick={deleteComp}
          >
            Delete
          </div>
        </div>
      </ReactModal>
      <div
        className={`mb-2 flex w-full ${
          isParticipant ? " flex-row " : "flex-col items-center "
        }`}
      >
        <div
          className={`flex w-1/2 flex-wrap place-content-center ${
            isParticipant ? "h-52" : "max-h-96"
          }`}
        >
          {data.image ? (
            <ReactImageFallback
              src={data.image}
              fallbackImage={NotFound}
              alt={data.name}
              className={`object-fit rounded  ${
                isParticipant ? "max-h-48" : "max-h-96"
              }`}
            />
          ) : (
            <LuSwords size={80} />
          )}
        </div>
        <div className="flex w-1/2 flex-col p-2 text-center align-middle text-sm">
          <div>Started: {creationDate}</div>
          <div className="mb-2">Updated: {updatedDate}</div>
          <CompScore
            players={currCompetition.players}
            currentScore={currCompetition.currentScore}
          />
          <select
            name="status"
            className={`mx-auto mt-2 w-28 rounded-xl p-1 ${selectColor}`}
            value={data.status}
            onChange={handleChange}
            disabled={!isParticipant}
          >
            <option value="abandoned" className="bg-red-500 dark:bg-red-700">
              Abandoned
            </option>
            <option
              value="ongoing"
              className="bg-orange-400 dark:bg-orange-600"
            >
              Ongoing
            </option>
            <option value="complete" className="bg-green-400 dark:bg-green-700">
              Complete
            </option>
          </select>
          {isParticipant && (
            <select
              name="public"
              className="mx-auto mt-2  w-28 rounded-xl bg-gray-100 p-1 dark:bg-gray-700"
              value={data.public}
              onChange={handleChange}
            >
              <option value={true}>Public</option>
              <option value={false}>Private</option>
            </select>
          )}
          {isParticipant && (
            <div
              className="mx-auto mt-auto w-20 cursor-pointer rounded-full bg-red-500 text-lg  text-white drop-shadow-md dark:bg-red-900"
              onClick={() => setIsModalOpen(true)}
            >
              Delete
            </div>
          )}
        </div>
      </div>
      <div className="flex flex-grow flex-col items-center">
        {isParticipant ? (
          <>
            <input
              type="text"
              name="name"
              placeholder="Competition Name"
              value={data.name}
              onChange={handleChange}
              className="m-2 w-full max-w-md rounded border-2 p-1 dark:border-gray-600 dark:bg-gray-700"
            />
            <input
              type="url"
              name="image"
              placeholder="Thumbnail picture"
              value={data.image}
              onChange={handleChange}
              className="m-2 w-full max-w-md rounded border-2 p-1 text-center dark:border-gray-600 dark:bg-gray-700"
            />
            <textarea
              placeholder="Description"
              className="m-2 h-32 w-full max-w-md rounded border-2 p-1 dark:border-gray-600 dark:bg-gray-700"
              name="description"
              value={data.description}
              onChange={handleChange}
            />
            <button
              className="mb-2 flex w-24 place-content-center rounded-full bg-teal-500 p-2 text-lg text-white drop-shadow-md dark:bg-teal-800"
              onClick={(event) => submit(event)}
            >
              Save Info
            </button>
          </>
        ) : (
          <p className="text-center">{data.description}</p>
        )}
      </div>
    </form>
  );
}
