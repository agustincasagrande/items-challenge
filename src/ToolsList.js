import React, { useState, useCallback } from "react";
import "./style.css";
import HTML5Backend from "react-dnd-html5-backend";
import Item from "./Item";
import update from "immutability-helper";

const ToolsList = () => {
	let intialState = localStorage.getItem("tools");
	intialState = intialState
		? JSON.parse(intialState)
		: [
				{ id: 1, text: "Hammer", image: "/pictures/hammer.jpg" },
				{ id: 2, text: "Screwdriver" },
				{ id: 3, text: "Pincers" },
				{ id: 4, text: "Wrench" }
		  ];

	const [newTool, setNewTool] = useState("");
	const [tools, setTools] = useState(intialState);
	const [loading, setLoading] = useState(false);
	const [edit, setEdit] = useState(false);

	function removeItem(id) {
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
		if (newTool === "") return;

		setLoading(true);
		e.preventDefault();
		e.persist();

		const tool = {
			id: Date.now(),
			text: newTool
		};

		const file = document.getElementById("file").files[0];
		tool.image = await upload(file);

		save([...tools, tool]);

		setNewTool("");
		e.target.reset();
		setLoading(false);
	}

	function saveItem() {
		if (!edit || !edit.text) return;

		const { id, text } = edit;
		const updatedTools = tools.map(item => {
			if (item.id === id) return { ...item, text };
			return item;
		});
		save(updatedTools);
		setEdit(false);
	}

	const moveItem = useCallback(
		(dragIndex, hoverIndex) => {
			const dragItem = tools[dragIndex];
			save(
				update(tools, {
					$splice: [
						[dragIndex, 1],
						[hoverIndex, 0, dragItem]
					]
				})
			);
		},
		[tools]
	);

	return (
		<div className="all">
			<h1>Tools list</h1>
			<form onSubmit={onSubmit}>
				<input
					className="text-input"
					maxLength="300"
					placeholder="Add new tool"
					onChange={e => {
						e.preventDefault();
						setNewTool(e.target.value);
					}}
				/>
				<input
					placeholder="image"
					type="file"
					id="file"
					className="img-input"
				/>
				{!loading ? (
					<button type="submit" className="add-button">
						Add
					</button>
				) : (
					<img id="loading" src="/assets/loading.gif" />
				)}
				<ul className="tools-list">
					{tools.map((item, index) => (
						<Item
							key={item.id}
							edit={edit}
							data={item}
							moveItem={moveItem}
							index={index}
							removeItem={removeItem}
							saveItem={saveItem}
						/>
					))}
				</ul>
			</form>

			<p>
				<strong>{`There are ${tools.length} tools in the list`}</strong>
			</p>
		</div>
	);
};

export default ToolsList;
