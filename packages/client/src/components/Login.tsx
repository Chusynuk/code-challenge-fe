import axios from "axios";
import type React from "react";
import { type InputHTMLAttributes, useState } from "react";
import useToken from "../hooks/useToken";
import "./Login.css";

const loginUser = async ({
	email,
	password,
}: { email: string; password: string }) => {
	// TODO: Refactor
	if (email && password) {
		const res = await axios.post(
			"http://localhost:3000/login",
			JSON.stringify({
				email,
				password,
			}),
			{
				headers: { "Content-Type": "application/json" },
			},
		);

		console.log("res", res);
		return res;
	}
	return null;
};

const Login = ({ setToken }) => {
	const [email, setEmail] = useState("");
	const [password, setPassword] = useState("");
	const handleEmail = (event: React.ChangeEvent<HTMLInputElement>) =>
		setEmail(event.target.value);
	const handlePassword = (event: React.ChangeEvent<HTMLInputElement>) =>
		setPassword(event.target.value);

	const handleSubmit = async (e: React.FormEvent) => {
		e.preventDefault();

		try {
			const data = await loginUser({
				email,
				password,
			});

			setToken(data.data.token);
		} catch (error) {
			console.error(error);
		}
	};

	return (
		<div className="login-wrapper">
			<h1>Please Log In</h1>
			<form onSubmit={handleSubmit}>
				<label>
					<p>Username</p>
					<input type="email" onChange={handleEmail} />
				</label>
				<label>
					<p>Password</p>
					<input type="password" onChange={handlePassword} />
				</label>
				<div>
					<button type="submit" onClick={loginUser}>
						Submit
					</button>
				</div>
				{/* <div>
					<input type="submit" value="Subscribe!" />
				</div> */}
			</form>
		</div>
	);
};

export default Login;
