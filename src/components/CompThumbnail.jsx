import React from "react";
import CompScore from "./CompScore";
import { LuSwords } from "react-icons/lu";
import ReactImageFallback from "react-image-fallback";
import NotFound from "../assets/image-not-found.png";

export default function CompThumbnail(props) {
  const color =
    props.status == "complete"
      ? "bg-green-400"
      : props.status == "ongoing"
      ? "bg-orange-400"
      : "bg-red-500";
  return (
    <div className="flex flex-col items-center font text-lg w-36 h-60 drop-shadow-md bg-slate-300 rounded-lg">
      <p
        className={`w-full max-h-8 rounded-lg text-center capitalize ${color}`}
      >
        {props.status}
      </p>
      <div className="flex-grow flex flex-col flex-wrap place-content-center m-1 items-center ">
        {props.image ? (
          <ReactImageFallback
            src={props.image}
            fallbackImage={NotFound}
            alt={props.name}
            className="max-h-44 object-contain"
          />
        ) : (
          <>
            <LuSwords size={50} />
            <p className="text-center">{props.name}</p>
          </>
        )}
      </div>
      <CompScore players={props.players} currentScore={props.currentScore} />
    </div>
  );
}
