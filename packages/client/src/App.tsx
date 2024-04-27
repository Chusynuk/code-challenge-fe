import {
	BrowserRouter,
	Navigate,
	Outlet,
	Route,
	Routes,
} from "react-router-dom";
import "./App.css";
import { useToken } from "./hooks";

import { Dashboard, Login } from "./components";

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
				</Routes>
			</BrowserRouter>
		</div>
	);
}

export default App;
