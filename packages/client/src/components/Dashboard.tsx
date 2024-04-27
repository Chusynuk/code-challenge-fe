import React, { useEffect } from "react";
import {
	BrowserRouter,
	Link,
	Navigate,
	Outlet,
	Route,
	Routes,
	useNavigate,
} from "react-router-dom";
import useToken from "../hooks/useToken";

const Dashboard = () => {
	const { token, setToken } = useToken();
	const handleLogout = () => setToken("");

	const navigate = useNavigate();

	useEffect(() => {
		if (!token) {
			navigate("/");
		}
	}, [token, setToken]);
	return (
		<>
			<h2>Dashboard</h2>
			<button type="button" onClick={handleLogout}>
				logout
			</button>
		</>
	);
};

export default Dashboard;
