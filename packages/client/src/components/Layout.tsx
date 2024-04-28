import Box from "@mui/material/Box";
import Container from "@mui/material/Container";
import CssBaseline from "@mui/material/CssBaseline";
import type * as React from "react";

interface ILayout {
	children: React.ReactNode;
}

const Layout = ({ children }: ILayout) => {
	return (
		<>
			<Container maxWidth="lg">
				<CssBaseline />
				<Box
					display="flex"
					flexDirection="column"
					alignItems="center"
					component="section"
					sx={{ p: 2, border: "1px dashed grey" }}
				>
					{children}
				</Box>
			</Container>
		</>
	);
};

export default Layout;
