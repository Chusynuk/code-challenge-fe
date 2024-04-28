// import MenuIcon from "@mui/icons-material/Menu";
import AppBar from "@mui/material/AppBar";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import IconButton from "@mui/material/IconButton";
import Toolbar from "@mui/material/Toolbar";
import Typography from "@mui/material/Typography";
import * as React from "react";

interface IHeader {
	handleLogout?: () => void;
}

const Header = ({ handleLogout }: IHeader) => {
	const userEmail = sessionStorage.getItem("email");
	const smeName = sessionStorage.getItem("sme-name");

	return (
		<Box sx={{ flexGrow: 1 }}>
			<AppBar position="static">
				<Toolbar>
					<IconButton
						size="large"
						edge="start"
						color="inherit"
						aria-label="menu"
						sx={{ mr: 2 }}
					>
						{/* <MenuIcon /> */}
					</IconButton>
					<Typography component="div" sx={{ flexGrow: 1 }}>
						{userEmail}
					</Typography>
					<Typography component="div" sx={{ flexGrow: 1 }}>
						{smeName}
					</Typography>
					<Button color="inherit" onClick={handleLogout}>
						Logout
					</Button>
				</Toolbar>
			</AppBar>
		</Box>
	);
};

export default Header;
