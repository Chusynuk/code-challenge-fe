import axios from "axios";
import type React from "react";
import { type InputHTMLAttributes, useState } from "react";
import { useNavigate } from "react-router-dom";
import useToken from "../hooks/useToken";
import "./Login.css";

// const loginUser = async ({
// 	email,
// 	password,
// }: { email: string; password: string }) => {
// 	// TODO: Refactor
// 	if (email && password) {
// 		const res = await axios.post(
// 			"http://localhost:3000/login",
// 			JSON.stringify({
// 				email,
// 				password,
// 			}),
// 			{
// 				headers: { "Content-Type": "application/json" },
// 			},
// 		);

// 		console.log("res", res);
// 		return res;
// 	}
// 	return null;
// };

interface ILogin {
	email: string;
	password: string;
	setEmail: (email: string) => void;
	setPassword: (password: string) => void;
	setToken: (token: string) => void;
}

const LoginForm = ({
	email,
	setEmail,
	password,
	setPassword,
	setToken,
}: ILogin) => {
	const navigate = useNavigate();
	const handleEmail = (event: React.ChangeEvent<HTMLInputElement>) =>
		setEmail(event.target.value);
	const handlePassword = (event: React.ChangeEvent<HTMLInputElement>) =>
		setPassword(event.target.value);

	const handleSubmit = async (e: React.FormEvent) => {
		e.preventDefault();

		try {
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

			setToken(res.data.token);
			navigate("/dashboard");
		} catch (error) {
			console.error(error);
		}
	};

	return (
		<div className="login-wrapper">
			<h1>Please Log In</h1>
			<form onSubmit={handleSubmit}>
				<label htmlFor="email" />
				<input type="email" id="email" onChange={handleEmail} />
				<label htmlFor="password" />
				<input type="password" id="password" onChange={handlePassword} />
				<div>
					<button type="submit">Submit</button>
				</div>
			</form>
		</div>
	);
};

export default LoginForm;
