import React from "react";
import { Form, useActionData, useNavigation } from "react-router-dom";
import { useOutletContext } from "react-router-dom";
import { addRule, deleteRule } from "../util-js/competitions-api";
import { FaTrashAlt } from "react-icons/fa";

export async function action({ request }) {
  const formData = await request.formData();
  const rule = formData.get("rule");
  if (rule == "") return "Please enter something";
  const pathname = new URL(request.url).pathname;
  try {
    await addRule({
      id: pathname.split("/")[2],
      rule: rule,
    });
    return null;
  } catch (err) {
    return err.message;
  }
}

export default function CompRules(props) {
  let { currCompetition } = useOutletContext();
  if (!currCompetition) {
    currCompetition = props.currCompetition;
  }
  const navigation = useNavigation();
  const errorMessage = useActionData();

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
  return (
    <div className="flex h-full flex-col">
      {errorMessage && (
        <h3 className="text-center text-lg font-bold text-red-600">
          {errorMessage}
        </h3>
      )}
      <div>{ruleElements}</div>
      {currCompetition.status === "ongoing" && (
        <Form method="post" className="mt-auto flex flex-col justify-center">
          <input
            type="text"
            name="rule"
            placeholder="New Rule"
            className="my-2 w-full rounded border-2 p-1"
          />
          <button
            className={`${
              navigation.state === "submitting" ? "bg-gray-300" : "bg-teal-500"
            } text-md mx-auto mb-2 flex w-20 place-content-center rounded-full p-1 text-white drop-shadow-md lg:w-32`}
          >
            {navigation.state === "submitting" ? "Adding..." : "Add rule"}
          </button>
        </Form>
      )}
    </div>
  );
}
