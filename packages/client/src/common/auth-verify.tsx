import React, { useEffect } from "react";
import { withRouter } from "./with-router";

const parseJwt = (token) => {
	try {
		return JSON.parse(atob(token.split(".")[1]));
	} catch (e) {
		return null;
	}
};

const AuthVerify = (props) => {
	const location = props.router.location;

	useEffect(() => {
		const token = JSON.parse(sessionStorage.getItem("token"));

		if (token) {
			const decodedJwt = parseJwt(token);

			if (decodedJwt.exp * 1000 < Date.now()) {
				props.handleLogout();
			}
		}
	}, [location]);

	return <div></div>;
};

export default withRouter(AuthVerify);
