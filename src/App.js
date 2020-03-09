import React from "react";
import { render } from "react-dom";
import ItemsList from "./ItemsList.js";
import { DndProvider } from "react-dnd";
import Backend from "react-dnd-html5-backend";

const App = () => {
	return (
		<div className="App">
			<DndProvider backend={Backend}>
				<ItemsList />
			</DndProvider>
		</div>
	);
};

render(<App />, document.getElementById("root"));
