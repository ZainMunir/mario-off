import React from "react";
import { useNavigation, useOutletContext } from "react-router-dom";
import { addRule, deleteRule } from "../util-js/competitions-api";
import { FaTrashAlt } from "react-icons/fa";

export default function CompRules(props) {
  let { currCompetition } = useOutletContext();
  const navigation = useNavigation();
  const [errorMessage, setErrorMessage] = React.useState(null);
  const [newRule, setNewRule] = React.useState("");

  if (!currCompetition) {
    currCompetition = props.currCompetition;
  }

  function handleChange(event) {
    setNewRule(event.target.value);
  }

  async function delRule(rule) {
    await deleteRule({
      id: currCompetition.id,
      rule: rule,
    });
  }

  const ruleElements = currCompetition.rules.map((rule) => {
    return (
      <div key={currCompetition.rules.indexOf(rule)} className="group relative">
        - {rule}
        {currCompetition.status === "ongoing" && (
          <button
            className="absolute right-0 top-1 opacity-0 transition-opacity duration-100 group-hover:opacity-100"
            onClick={() => delRule(rule)}
          >
            <FaTrashAlt />
          </button>
        )}
      </div>
    );
  });

  async function submit(event) {
    event.preventDefault();
    if (newRule == "") {
      setErrorMessage("Please enter something");
      return;
    }
    try {
      await addRule({
        id: currCompetition.id,
        rule: newRule,
      });
      setErrorMessage(null);
    } catch (err) {
      setErrorMessage(err.message);
    }
  }

  return (
    <div className="flex h-full flex-grow flex-col">
      {errorMessage && (
        <h3 className="text-center text-lg font-bold text-red-600">
          {errorMessage}
        </h3>
      )}
      <div>{ruleElements}</div>
      {currCompetition.status === "ongoing" && (
        <form method="post" className="mt-auto flex flex-col justify-center">
          <input
            type="text"
            name="rule"
            placeholder="New Rule"
            value={newRule}
            onChange={handleChange}
            className="my-2 w-full rounded border-2 p-1 dark:border-gray-600 dark:bg-gray-700"
          />
          <button
            className={`${
              navigation.state === "submitting"
                ? "bg-gray-300 dark:bg-gray-700"
                : "bg-teal-500 dark:bg-teal-800"
            } text-md mx-auto mb-2 flex w-20 place-content-center rounded-full p-1 text-white drop-shadow-md lg:w-32`}
            onClick={(event) => submit(event)}
          >
            {navigation.state === "submitting" ? "Adding..." : "Add rule"}
          </button>
        </form>
      )}
    </div>
  );
}
