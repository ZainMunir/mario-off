import React from "react";
import { useRouteError } from "react-router-dom";

export default function Error() {
  const error = useRouteError();

  return (
    <div className="mx-auto w-full max-w-lg text-center">
      <h1 className="text-2xl font-bold">Error: {error.message}</h1>
      <pre>
        {error.status} - {error.statusText}
      </pre>
      <p>
        This could be caused by trying to access a competition you aren't in or
        one that doesn't exist
      </p>
    </div>
  );
}
