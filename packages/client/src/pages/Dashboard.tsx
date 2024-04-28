import axios from "axios";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Layout from "../components/Layout";
import useToken from "../hooks/useToken";

const Dashboard = () => {
	const navigate = useNavigate();
	const { token, setToken } = useToken();
	const [smeId, setSmeId] = useState("");
	console.log("smeId", smeId);
	const handleLogout = () => {
		navigate("/login");
		sessionStorage.removeItem("token");
		sessionStorage.removeItem("email");
	};

	useEffect(() => {
		const fetchSme = async () => {
			try {
				const res = await axios.get("http://localhost:3000/sme-data", {
					headers: {
						Authorization: `Bearer ${token}`,
						"Content-Type": "application/json",
					},
				});
				sessionStorage.setItem("sme-name", res.data.legalName);
				console.log("res", res);
				setSmeId(res.data.id);
				return res;
			} catch (error) {
				console.log(error);
			}
		};
		fetchSme();
	}, []);

	useEffect(() => {
		const fetchTransactionsFromSme = async () => {
			try {
				const res = await axios.get(
					`http://localhost:3000/transactions?userId=${smeId}&status=PENDING`,
					{
						headers: {
							Authorization: `Bearer ${token}`,
							"Content-Type": "application/json",
						},
					},
				);

				console.log("res", res);
				return res;
			} catch (error) {
				console.log(error);
			}
		};
		fetchTransactionsFromSme();
	}, []);
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
