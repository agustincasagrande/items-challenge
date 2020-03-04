import React from "react";
import { render } from "react-dom";
import ToolsList from "./ToolsList.js";

const App = () => {
	return (
		<div className="App">
			<ToolsList />
		</div>
	);
};

render(<App />, document.getElementById("root"));
