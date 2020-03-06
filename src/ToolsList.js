import React, { useState } from "react";
import "./style.css";
import HTML5Backend from "react-dnd-html5-backend";
import { DragDropContext } from "react-dnd";
import Card from "./Card";
const update = require("immutability-helper");
import loadingImage from "./loading.gif";
//import "./pictures/pincers";
//import "./pictures/Hammer";
//import "./pictures/Screwdriver";
//import "./pictures/wrench";

//falta: fix drag n drop
//falta: fix edit button
//falta: displaying deffault items
//falta: add a picture to deffault items
//falta: fix enter spam
//falta: fix loading gif (browser does not render gif)

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
	const [edit, setEdit] = useState(false);

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
	/*
	{
		moveCard = (dragIndex, hoverIndex) => {
			const { cards } = this.state;
			const dragCard = cards[dragIndex];

			this.setState(
				update(this.state, {
					cards: {
						$splice: [
							[dragIndex, 1],
							[hoverIndex, 0, dragCard]
						]
					}
				})
			);
		};
	}
*/

	//	/*
	{
		/*
		function moveCard(dragIndex, hoverIndex) {
			const cards = setTools;
			const dragCard = cards[dragIndex];

			setTools(
				update(setTools, {
					cards: {
						$splice: [
							[dragIndex, 1],
							[hoverIndex, 0, dragCard]
						]
					}
				})
			);
		}
	*/
	}

	return (
		<div className="all">
			<h1>Tools list</h1>
			<form onSubmit={onSubmit}>
				<input
					className="text-input"
					maxlength="300"
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
					<img id="loading" src={loadingImage} />
				)}
				<ul className="tools-list">
					{tools.map(tool => (
						<li key={tool.id} className="tool">
							{edit.id === tool.id ? (
								<input
									value={edit.text || tool.text}
									onChange={e => {
										e.preventDefault();
										setEdit({ ...edit, text: e.target.value });
									}}
								/>
							) : (
								<p>{tool.text}</p>
							)}

							{tool.image && <img src={tool.image} />}
							<a href="#" onClick={() => removeTool(tool.id)}>
								X
							</a>
							{edit.id !== tool.id ? (
								<a href="#" onClick={() => setEdit({ id: tool.id })}>
									Edit
								</a>
							) : (
								<div className="edit-actions">
									<span onClick={saveItem}>Save</span>
									<span onClick={() => setEdit(false)}>Cancel</span>
								</div>
							)}
						</li>
					))}
				</ul>
			</form>
			<p>
				<strong>{`there are ${tools.length} tools in the list`}</strong>
			</p>

			{/*			<div className="card-container">
				{tools.map((card, i) => (
					<Card
						key={card.id}
						index={i}
						id={card.id}
						text={card.text}
						moveCard={moveCard}
					/>
				))}
			</div>
*/}
		</div>
	);
};

export default ToolsList;

{
	/*

	<div className="card-container">
            {this.state.cards.map((card, i) => (
              <Card
                key={card.id}
                index={i}
                id={card.id}
                text={card.text}
                moveCard={this.moveCard}
              />
            ))}
	</div>

*/
}
