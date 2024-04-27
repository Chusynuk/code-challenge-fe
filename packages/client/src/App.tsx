import axios from "axios";
import { useEffect, useState } from "react";
import {
	BrowserRouter,
	Link,
	Navigate,
	Outlet,
	Route,
	Routes,
} from "react-router-dom";
import "./App.css";
import useToken from "./hooks/useToken";

import { Dashboard, Login, Preferences } from "./components";

const ProtectedRoute = ({ token, redirectPath = "/login", children }) => {
	if (!token) {
		return <Navigate to={redirectPath} replace />;
	}

	return children;
};

function App() {
	const { token, setToken } = useToken();

	return (
		<div className="wrapper">
			<BrowserRouter>
				<Routes>
					<Route path="*" index element={<Login setToken={setToken} />} />
					<Route
						path="dashboard"
						element={
							<ProtectedRoute token={token}>
								<Dashboard />
							</ProtectedRoute>
						}
					/>
					{/* <Route path="/preferences" element={<Preferences />} /> */}
				</Routes>
			</BrowserRouter>
		</div>
	);
}

export default App;
