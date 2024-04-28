import { useNavigate } from "react-router-dom";
import Layout from "../components/Layout";
import useToken from "../hooks/useToken";

const Dashboard = () => {
	const navigate = useNavigate();
	const { token, setToken } = useToken();

	const handleLogout = () => {
		navigate("/login");
		sessionStorage.removeItem("token");
		sessionStorage.removeItem("email");
	};
	return (
		<Layout handleLogout={handleLogout}>
			<h2>Dashboard</h2>
			<button type="button" onClick={handleLogout}>
				logout
			</button>
		</Layout>
	);
};

export default Dashboard;
