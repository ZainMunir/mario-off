import React from "react";

export default function ErrorMessage({ message }) {
  return (
    <>
      {message && (
        <h3 className="text-center text-lg font-bold text-red-600">
          {message}
        </h3>
      )}
    </>
  );
}
