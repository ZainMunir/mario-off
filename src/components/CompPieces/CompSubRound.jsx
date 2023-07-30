import React from "react";
import { FaTrashAlt } from "react-icons/fa";

export default function CompSubRound({
  selectedRound,
  idx,
  subRound,
  isParticipant,
  status,
  delSubRound,
  convertUidToUsername,
}) {
  return (
    <div
      key={`${selectedRound - 1}-${idx + 1}`}
      className="group  flex flex-row justify-between"
    >
      <div className="mr-auto w-5/12 text-left">{subRound.name}</div>
      <div className="relative">
        <div
          className={`transition-opacity duration-100 ${
            isParticipant ? "group-hover:opacity-0" : ""
          }`}
        >
          {subRound.points}
        </div>
        {status === "ongoing" && isParticipant && (
          <div className="absolute inset-0 flex h-full w-full justify-center">
            <button
              className="self-center opacity-0 transition-opacity duration-100 group-hover:opacity-100"
              onClick={() => delSubRound(idx)}
            >
              <FaTrashAlt size={16} />
            </button>
          </div>
        )}
      </div>
      <div className="ml-auto w-5/12 text-right">
        {convertUidToUsername(subRound.player)}
      </div>
    </div>
  );
}
