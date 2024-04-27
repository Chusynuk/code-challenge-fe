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

	const handleLogout = () => {
		setToken("");

		const navigate = useNavigate();

		useEffect(() => {
			if (!token) {
				navigate("/");
			}
		}, [token]);
	};

	return (
		<div className="wrapper">
			<BrowserRouter>
				<Routes>
					<Route path="*" index element={<Login setToken={setToken} />} />
					<Route
						path="dashboard"
						element={
							<ProtectedRoute token={token}>
								<Dashboard handleLogout={handleLogout} />
							</ProtectedRoute>
						}
					/>
				</Routes>
				<AuthVerify handleLogout={handleLogout} />
			</BrowserRouter>
		</div>
	);
}

export default App;
