import React from "react";
import { render } from "react-dom";
import ToolsList from "./ToolsList.js";
import { DndProvider } from "react-dnd";
import Backend from "react-dnd-html5-backend";

const App = () => {
	return (
		<div className="App">
			<DndProvider backend={Backend}>
				<ToolsList />
			</DndProvider>
		</div>
	);
};

render(<App />, document.getElementById("root"));
