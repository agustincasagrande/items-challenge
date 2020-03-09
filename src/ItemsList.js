import React, { useState, useCallback } from "react";
import "./style.css";
import HTML5Backend from "react-dnd-html5-backend";
import Item from "./Item";
import update from "immutability-helper";

// edit needs an option to update image

const ItemsList = () => {
	let intialState = localStorage.getItem("items");
	intialState = intialState
		? JSON.parse(intialState)
		: [
				{ id: 1, text: "Hammer", image: "/pictures/hammer.jpg" },
				{ id: 2, text: "Screwdriver", image: "/pictures/screwdriver.jpg" },
				{ id: 3, text: "Pincers", image: "/pictures/pincers.jpg" },
				{ id: 4, text: "Wrench", image: "/pictures/wrench.jpg" }
		  ];

	const [newItem, setNewItem] = useState("");
	const [items, setItems] = useState(intialState);
	const [loading, setLoading] = useState(false);
	const [edit, setEdit] = useState(false);

	function removeItem(id) {
		save(items.filter(item => item.id != id));
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

	function save(x) {
		setItems(x);
		window.localStorage.setItem("items", JSON.stringify(x));
	}

	async function onSubmit(e) {
		e.preventDefault();

		if (newItem === "") return;

		setLoading(true);
		e.persist();

		const item = {
			id: Date.now(),
			text: newItem
		};

		const file = document.getElementById("file").files[0];
		item.image = await upload(file);

		save([...items, item]);

		setNewItem("");
		e.target.reset();
		setLoading(false);
	}

	async function saveItem() {
		if (!edit || (!edit.text && !edit.image)) return;

		const { id, text } = edit;
		const file = edit.image && edit.image.files[0];
		const image = file && (await upload(file));

		const updatedItems = items.map(item => {
			if (item.id === id) {
				return {
					...item,
					text: text || item.text,
					image: image || item.image
				};
			}
			return item;
		});

		save(updatedItems);
		setEdit(false);
	}

	const moveItem = useCallback(
		(dragIndex, hoverIndex) => {
			const dragItem = items[dragIndex];
			save(
				update(items, {
					$splice: [
						[dragIndex, 1],
						[hoverIndex, 0, dragItem]
					]
				})
			);
		},
		[items]
	);

	return (
		<div className="all">
			<h1>Items list</h1>
			<form onSubmit={onSubmit}>
				<input
					className="text-input"
					maxLength="300"
					placeholder="Add new item"
					onChange={e => {
						e.preventDefault();
						setNewItem(e.target.value);
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
				<ul className="items-list">
					{items.map((item, index) => (
						<Item
							key={item.id}
							edit={edit}
							setEdit={setEdit}
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
				<strong>{`There are ${items.length} items in the list`}</strong>
			</p>
		</div>
	);
};

export default ItemsList;
