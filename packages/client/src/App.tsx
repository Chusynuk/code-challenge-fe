import axios from "axios";
import { useEffect, useState } from "react";
import { BrowserRouter, Link, Route, Routes } from "react-router-dom";
import "./App.css";
import useToken from "./hooks/useToken";

import { Dashboard, Login, Preferences } from "./components";

function App() {
	const [token, setToken] = useState("");
	console.log("token", token);

	if (!token) {
		return (
			<BrowserRouter>
				<Routes>
					<Route path="/" element={<Login setToken={setToken} />} />
				</Routes>
			</BrowserRouter>
		);
	}

	return (
		<div className="wrapper">
			<BrowserRouter>
				<Routes>
					{!token ? (
						<Route path="/" element={<Login setToken={setToken} />} />
					) : (
						<>
							<Route path="/dashboard" element={<Dashboard />} />
							<Route path="/preferences" element={<Preferences />} />
						</>
					)}
				</Routes>
			</BrowserRouter>
		</div>
	);
}

export default App;
