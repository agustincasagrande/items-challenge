import React, { useState } from "react";
import "./style.css";
import HTML5Backend from "react-dnd-html5-backend";
import { DragDropContext } from "react-dnd";
import Card from "./Card";
const update = require("immutability-helper");
import "./loading.gif";

const ToolsList = () => {
	let intialState = localStorage.getItem("tools");
	intialState = intialState
		? JSON.parse(intialState)
		: [
				{ id: 1, text: "Hammer" },
				{ id: 2, text: "Screwdriver" },
				{ id: 3, text: "Pincers" },
				{ id: 4, text: "Wrench" }
		  ];

	const [newTool, setNewTool] = useState("");
	const [tools, setTools] = useState(intialState);
	const [loading, setLoading] = useState(false);
	//const [edit, setEdit] = useState(false);

	function removeTool(id) {
		save(tools.filter(tool => tool.id != id));
	}

	async function upload(bytes) {
		const response = await fetch("https://api.imgur.com/3/image", {
			method: "POST",
			body: bytes,
			headers: {
				Authorization: "Client-ID 50dc975966702fc"
			}
		});

		const { data } = await response.json();

		return data.link;
	}

	function save(items) {
		setTools(items);
		window.localStorage.setItem("tools", JSON.stringify(items));
	}

	async function onSubmit(e) {
		setLoading(true);
		e.preventDefault();
		e.persist();
		if (newTool === "") return;

		const tool = {
			id: Date.now(),
			text: newTool
		};

		const file = document.getElementById("file").files[0];
		tool.image = await upload(file);
		save([...tools, tool]);
		e.target.reset();
		setLoading(false);
	}

	return (
		<div className="all">
			<h1>Tools list</h1>
			<form onSubmit={onSubmit}>
				<input
					placeholder="Add new tool"
					onChange={e => {
						e.preventDefault();
						setNewTool(e.target.value);
					}}
				/>
				<input placeholder="image" type="file" id="file" />
				{!loading && <button type="submit">Add</button>}
				<ul className="tools-list">
					{tools.map(tool => (
						<li key={tool.id} className="tool">
							{tool.text}
							{tool.image && <img src={tool.image} />}
							<a href="#" onClick={() => removeTool(tool.id)}>
								X
							</a>
						</li>
					))}
				</ul>
			</form>
			<p>
				<strong>{`there are ${tools.length} tools in the list`}</strong>
			</p>
		</div>
	);
};

export default ToolsList;
