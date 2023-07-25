import React from "react";
import ReactModal from "react-modal";
import {
  Form,
  useOutletContext,
  useNavigate,
  useNavigation,
} from "react-router-dom";
import {
  deleteCompetition,
  updateCompetition,
} from "../util-js/competitions-api";
import CompScore from "../components/CompScore";
import { LuSwords } from "react-icons/lu";
import "./CompInfo.css";
import ReactImageFallback from "react-image-fallback";
import NotFound from "../assets/image-not-found.png";

export default function CompInfo(props) {
  let { currCompetition } = useOutletContext();
  if (!currCompetition) {
    currCompetition = props.currCompetition;
  }
  const navigate = useNavigate();
  const navigation = useNavigation();

  const [errorMessage, setErrorMessage] = React.useState(null);

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

  async function deleteComp() {
    await deleteCompetition(currCompetition.id);
    navigate("../competitions", { replace: true });
  }

  const [data, setData] = React.useState({
    name: currCompetition.name,
    image: currCompetition.image,
    description: currCompetition.description,
    status: currCompetition.status,
  });

  React.useEffect(() => {
    setData({
      name: currCompetition.name,
      image: currCompetition.image,
      description: currCompetition.description,
      status: currCompetition.status,
    });
  }, [currCompetition]);

  function handleChange(event) {
    const { name, value } = event.target;
    setData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  }

  const [isModalOpen, setIsModalOpen] = React.useState(false);

  const selectColor =
    data.status == "complete"
      ? "bg-green-400"
      : data.status == "ongoing"
      ? "bg-orange-400"
      : "bg-red-500";

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
      });
      setErrorMessage(null);
    } catch (err) {
      setErrorMessage(err.message);
    }
  }

  return (
    <form method="post" className="flex h-full flex-grow flex-col">
      {errorMessage && (
        <h3 className="text-center text-lg font-bold text-red-600">
          {errorMessage}
        </h3>
      )}
      <ReactModal
        isOpen={isModalOpen}
        contentLabel="DeleteModal"
        overlayClassName="bg-opacity-50 bg-black w-screen h-screen fixed top-0 left-0 z-20"
        className="centerModal flex h-40 w-72 flex-col place-content-center justify-between rounded-xl bg-gray-200 p-4 text-center drop-shadow-xl "
        appElement={document.getElementById("root")}
      >
        <p>
          Are you sure you want to delete this competition? <br /> This action
          is irreversible
        </p>
        <div className="flex flex-row ">
          <div
            className="text-md mx-auto mt-auto w-24 cursor-pointer rounded-full bg-green-400 text-white drop-shadow-md"
            onClick={() => setIsModalOpen(false)}
          >
            Cancel
          </div>
          <div
            className="text-md mx-auto mt-auto w-24 cursor-pointer rounded-full bg-red-500 text-white drop-shadow-md"
            onClick={deleteComp}
          >
            Delete
          </div>
        </div>
      </ReactModal>
      <div className="mb-2 flex w-full flex-row ">
        <div className="flex h-48 w-1/2 flex-wrap place-content-center">
          {data.image ? (
            <ReactImageFallback
              src={data.image}
              fallbackImage={NotFound}
              alt={data.name}
              className="max-h-48 rounded object-contain"
            />
          ) : (
            <LuSwords size={80} />
          )}
        </div>
        <div className="flex w-1/2 flex-col p-2 text-center align-middle text-sm">
          <div className="mb-3">Started: {creationDate}</div>
          <CompScore
            players={currCompetition.players}
            currentScore={currCompetition.currentScore}
          />
          <select
            name="status"
            className={`mx-auto mt-8 w-28 rounded-xl p-1 ${selectColor}`}
            value={data.status}
            onChange={handleChange}
          >
            <option value="abandoned" className="bg-red-500  ">
              Abandoned
            </option>
            <option value="ongoing" className="bg-orange-400">
              Ongoing
            </option>
            <option value="complete" className="bg-green-400">
              Complete
            </option>
          </select>
          <div
            className="mx-auto mt-auto w-20 cursor-pointer rounded-full bg-red-500 text-lg text-white drop-shadow-md"
            onClick={() => setIsModalOpen(true)}
          >
            Delete
          </div>
        </div>
      </div>
      <div className="flex flex-grow flex-col items-center">
        <input
          type="text"
          name="name"
          placeholder="Competition Name"
          value={data.name}
          onChange={handleChange}
          className="m-2 w-full max-w-md rounded border-2 p-1"
        />
        <input
          type="url"
          name="image"
          placeholder="Thumbnail picture"
          value={data.image}
          onChange={handleChange}
          className="m-2 w-full max-w-md rounded border-2 p-1 text-center"
        />
        <textarea
          placeholder="Description"
          className="m-2 h-32 w-full max-w-md rounded border-2 p-1"
          name="description"
          value={data.description}
          onChange={handleChange}
        />
        <button
          className={`${
            navigation.state === "submitting" ? "bg-gray-300" : "bg-teal-500"
          } mb-2 flex w-24 place-content-center rounded-full p-2 text-lg text-white drop-shadow-md`}
          onClick={(event) => submit(event)}
        >
          {navigation.state === "submitting" ? "Saving" : "Save info"}
        </button>
      </div>
    </form>
  );
}
