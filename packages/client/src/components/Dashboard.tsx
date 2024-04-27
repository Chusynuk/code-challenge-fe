const Dashboard = ({ handleLogout }: { handleLogout: () => void }) => {
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
