import { Box, Grid } from "@mui/material";
import CssBaseline from "@mui/material/CssBaseline";
import type * as React from "react";
import { useLocation } from "react-router-dom";
import { Header } from "./";

interface ILayout {
	children: React.ReactNode;
	handleLogout?: () => void;
}

const Layout = ({ handleLogout, children }: ILayout) => {
	const location = useLocation();
	const isDashboardPage = location.pathname.includes("dashboard");

	return (
		<>
			<Grid container flexDirection="column">
				{isDashboardPage && <Header handleLogout={handleLogout} />}
				<CssBaseline />
				<Grid item xs={12}>
					<Box
						display="flex"
						flexDirection="column"
						alignItems="center"
						component="section"
						sx={{ p: 2, border: "1px solid grey" }}
					>
						{children}
					</Box>
				</Grid>
			</Grid>
		</>
	);
};

export default Layout;
