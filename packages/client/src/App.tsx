import {
	BrowserRouter,
	Navigate,
	Outlet,
	Route,
	Routes,
	useNavigate,
} from "react-router-dom";
import "./App.css";
import AuthVerify from "./common/auth-verify";
import { useToken } from "./hooks";

import { useEffect } from "react";
import { Dashboard, Login, Preferences } from "./components";

interface IProtectedRoutes {
	token: string;
	redirectPath?: string;
	children: React.ReactElement;
}

const ProtectedRoute = ({
	token,
	redirectPath = "/login",
	children,
}: IProtectedRoutes) => {
	if (!token) {
		return <Navigate to={redirectPath} replace />;
	}

	return children;
};

function App() {
	return (
		<BrowserRouter>
			<MainComponent />
		</BrowserRouter>
	);
}

function MainComponent() {
	const navigate = useNavigate();
	const { token, setToken } = useToken();

	const handleLogout = () => {
		console.log("dentro");
		setToken("");
		console.log("navigate", navigate);
		navigate("/login");
	};

	return (
		<div className="wrapper">
			{/* <BrowserRouter> */}
			<Routes>
				<Route path="*" element={<Login setToken={setToken} />} />
				<Route
					path="dashboard"
					element={
						<ProtectedRoute token={token}>
							<Dashboard handleLogout={handleLogout} />
						</ProtectedRoute>
					}
				/>
				<Route
					path="preferences"
					element={
						<ProtectedRoute token={token}>
							<Preferences />
						</ProtectedRoute>
					}
				/>
			</Routes>
			<AuthVerify handleLogout={handleLogout} />
			{/* </BrowserRouter> */}
		</div>
	);
}

export default App;
