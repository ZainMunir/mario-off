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

export default function CompRules() {
  const { currCompetition } = useOutletContext();
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
            className="right-0 top-1 absolute opacity-0 group-hover:opacity-100 transition-opacity duration-100"
            onClick={() => delRule(rule)}
          >
            <FaTrashAlt />
          </button>
        )}
      </div>
    );
  });
  return (
    <div className="flex flex-col h-full">
      {errorMessage && (
        <h3 className="font-bold text-center text-lg text-red-600">
          {errorMessage}
        </h3>
      )}
      <div>{ruleElements}</div>
      {currCompetition.status === "ongoing" && (
        <Form method="post" className="flex flex-col justify-center mt-auto">
          <input
            type="text"
            name="rule"
            placeholder="New Rule"
            className="border-2 rounded p-1 my-2 w-full"
          />
          <button
            className={`${
              navigation.state === "submitting" ? "bg-gray-300" : "bg-teal-500"
            } rounded-full drop-shadow-md text-white mb-2 place-content-center flex text-md p-1 w-20 mx-auto`}
          >
            {navigation.state === "submitting" ? "Adding..." : "Add rule"}
          </button>
        </Form>
      )}
    </div>
  );
}
