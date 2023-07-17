import React from "react";
import { Form, useOutletContext, redirect, useNavigate } from "react-router-dom";
import CompScore from "../components/CompScore";
import { deleteCompetition } from "../util-js/api"


export default function CompInfo() {
    const { currCompetition } = useOutletContext()
    const navigate = useNavigate()

    function formatDate(date) {
        var d = new Date(date),
            month = '' + (d.getMonth() + 1),
            day = '' + d.getDate(),
            year = d.getFullYear();

        if (month.length < 2)
            month = '0' + month;
        if (day.length < 2)
            day = '0' + day;

        return [year, month, day].join('-');
    }
    const creationDate = formatDate(currCompetition.creationDate.toDate())

    async function deleteComp() {
        await deleteCompetition()
        navigate("../competitions")
    }

    const [data, setData] = React.useState({
        name: currCompetition.name,
        image: currCompetition.image,
        description: currCompetition.description
    })

    function handleChange(event) {
        const { name, value } = event.target
        setData(prevData => ({
            ...prevData,
            [name]: value
        }))
    }

    return (
        <Form className="flex flex-col h-full ">
            <div className="flex flex-row mb-2 ">
                <div className="h-48 w-1/2 flex flex-wrap place-content-center">
                    <img src={data.image} alt={data.name} className="max-h-48 w-auto h-fit rounded" />
                </div>
                <div className="flex flex-col align-middle w-1/2 text-center text-sm p-2">
                    <div className="mb-3">Started: {creationDate}</div>
                    <CompScore players={currCompetition.players} currentScore={currCompetition.currentScore} />
                    <select className="mt-8 mx-auto w-24" defaultValue={currCompetition.status}>
                        <option value="abandoned" >Abandoned</option>
                        <option value="ongoing" >Ongoing</option>
                        <option value="complete" >Complete</option>
                    </select>
                    <div
                        className="mt-auto text-lg w-20 mx-auto bg-red-500 rounded-full drop-shadow-md text-white"
                        onClick={deleteComp}
                    >Delete</div>
                </div>
            </div>
            <div className="flex flex-col items-center flex-grow">
                <input
                    type="text"
                    name="name"
                    placeholder="Competition Name"
                    value={data.name}
                    onChange={handleChange} className="border-2 rounded p-1 m-2 w-full"
                />
                <input
                    type="url"
                    name="image"
                    placeholder="Thumbnail picture"
                    value={data.image}
                    onChange={handleChange}
                    className="border-2 rounded p-1 m-2 w-full text-center"
                />
                <textarea
                    placeholder="Description"
                    className="border-2 rounded p-1 m-2 w-full h-32"
                    name="description"
                    value={data.description}
                    onChange={handleChange}
                />
                <button className="rounded-full bg-teal-500 drop-shadow-md text-white mb-2 place-content-center flex text-lg p-2">Save info</button>
            </div>
        </Form>
    )
}