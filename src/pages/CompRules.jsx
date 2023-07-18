import React from "react";
import { Form, useNavigate, useNavigation, useRevalidator } from "react-router-dom";
import { useOutletContext } from "react-router-dom";
import { addRule, deleteRule } from "../util-js/api"
import Trash from "../assets/trash.png"

export async function action({ request }) {
    const formData = await request.formData()
    const rule = formData.get("rule")
    const pathname = new URL(request.url).pathname
    try {
        await addRule({
            id: pathname.split("/")[2],
            rule: rule,
        })
        return null
    } catch (err) {
        return err.message
    }
}

export default function CompRules() {
    const { currCompetition } = useOutletContext()
    const navigation = useNavigation()
    const revalidator = useRevalidator()

    async function delRule(rule) {
        await deleteRule({
            id: currCompetition.id,
            rule: rule
        })
        revalidator.revalidate()
    }

    const ruleElements = currCompetition.rules.map(rule => {
        return (
            <div
                key={currCompetition.rules.indexOf(rule)}
                className="group relative"
            >
                - {rule}
                {currCompetition.status === "ongoing" &&
                    <button
                        className="right-0 top-1 absolute opacity-0 group-hover:opacity-100"
                        onClick={() => delRule(rule)}
                    >
                        <img src={Trash} className="w-3" /></button>
                }
            </div>
        )
    })
    return (
        <div className="flex flex-col h-full">
            <div>
                {ruleElements}
            </div>
            {currCompetition.status === "ongoing" &&
                <Form
                    method="post"
                    className="flex flex-col justify-center mt-auto"
                >
                    <input
                        type="text"
                        name="rule"
                        placeholder="New Rule"
                        className="border-2 rounded p-1 my-2 w-full"
                    />
                    <button
                        className={`${navigation.state === "submitting" ? "bg-gray-300" : "bg-teal-500"} rounded-full drop-shadow-md text-white mb-2 place-content-center flex text-md p-1 w-20 mx-auto`}
                    >
                        {navigation.state === "submitting"
                            ? "Adding..."
                            : "Add rule"
                        }
                    </button>
                </Form>
            }
        </div>

    )
}