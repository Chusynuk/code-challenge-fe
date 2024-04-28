import {
	BrowserRouter,
	Navigate,
	Route,
	Routes,
	useNavigate,
} from "react-router-dom";
import "./App.css";
import AuthVerify from "./common/auth-verify";
import { useToken } from "./hooks";

import Dashboard from "./pages/Dashboard";
import Login from "./pages/Login";

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
	const { token, setToken } = useToken();
	const navigate = useNavigate();
	const handleLogout = () => {
		setToken("");
		navigate("/");
	};

	return (
		<>
			<Routes>
				<Route path="/" element={<Login />} />
				<Route path="*" element={<Navigate to="/" replace />} />
				<Route
					path="/dashboard"
					element={
						<ProtectedRoute token={token}>
							<Dashboard />
						</ProtectedRoute>
					}
				/>
			</Routes>
			<AuthVerify handleLogout={handleLogout} />
		</>
	);
}

export default App;
