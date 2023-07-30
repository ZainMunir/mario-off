import React from "react";
import { FaTrashAlt } from "react-icons/fa";

export default function CompRule({ rule, delRule, status, isParticipant }) {
  return (
    <div className="group relative">
      - {rule}
      {status === "ongoing" && isParticipant && (
        <button
          className="absolute right-0 top-1 opacity-0 transition-opacity duration-100 group-hover:opacity-100"
          onClick={() => delRule(rule)}
        >
          <FaTrashAlt />
        </button>
      )}
    </div>
  );
}
