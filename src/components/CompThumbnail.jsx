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
    <div className="font flex aspect-[3/5] w-full flex-col items-center rounded-lg bg-slate-300 text-lg drop-shadow-md sm:text-2xl">
      <p
        className={`max-h-8 w-full rounded-lg text-center capitalize ${color}`}
      >
        {props.status}
      </p>
      <div className="m-1 flex flex-grow flex-col flex-wrap place-content-center items-center object-contain">
        {props.image ? (
          <ReactImageFallback
            src={props.image}
            fallbackImage={NotFound}
            alt={props.name}
            className="aspect-[3/4] w-full object-contain"
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
