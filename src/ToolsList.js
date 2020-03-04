import React, { useState } from "react";
import "./style.css";
import HTML5Backend from "react-dnd-html5-backend";
import { DragDropContext } from "react-dnd";

const ToolsList = () => {
	const [newTool, setNewTool] = useState("");
	const [tools, setTools] = useState([
		{ id: 1, text: "Hammer" },
		{ id: 2, text: "Screwdriver" },
		{ id: 3, text: "Pincers" },
		{ id: 4, text: "Wrench" }
	]);

	function removeTool(id) {
		setTools(tools.filter(tool => tool.id != id));
	}

	return (
		<div className="all">
			<h1>Tools list</h1>
			<form
				onSubmit={e => {
					e.preventDefault();
					if (newTool === "") return;
					setTools([...tools, { id: Date.now(), text: newTool }]);
					e.target.reset();
				}}
			>
				<input
					placeholder="Add new tool"
					onChange={e => {
						e.preventDefault();
						setNewTool(e.target.value);
					}}
				/>
				<button type="submit">Add</button>
				<ul className="tools-list">
					{tools.map(tool => (
						<li key={tool.id} className="tool">
							{tool.text}
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
