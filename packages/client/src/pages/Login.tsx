import {
	Button,
	FormControl,
	FormGroup,
	FormHelperText,
	Input,
	InputLabel,
} from "@mui/material";
import axios from "axios";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Layout } from "../components";
import useToken from "../hooks/useToken";

const Login = () => {
	const navigate = useNavigate();
	const { token, setToken } = useToken();
	const [email, setEmail] = useState("");
	const [password, setPassword] = useState("");
	const handleEmail = (event: React.ChangeEvent<HTMLInputElement>) =>
		setEmail(event.target.value);
	const handlePassword = (event: React.ChangeEvent<HTMLInputElement>) =>
		setPassword(event.target.value);

	const handleSubmit = async (e: React.FormEvent) => {
		e.preventDefault();
		console.log("hola");

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
		<Layout>
			{/* <div className="login-wrapper">
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
						<button type="submit">Submit</button>
					</div>

				</form>
			</div> */}
			<form onSubmit={handleSubmit}>
				<InputLabel htmlFor="email">Email address</InputLabel>
				<Input
					id="email"
					type="email"
					aria-describedby="my-helper-text"
					onChange={handleEmail}
				/>
				<FormHelperText id="my-helper-text">
					We'll never share your email.
				</FormHelperText>
				<InputLabel htmlFor="password">Password</InputLabel>
				<Input
					id="password"
					type="password"
					aria-describedby="my-helper-text"
					onChange={handlePassword}
				/>
				<Button type="submit">Log in</Button>
			</form>
		</Layout>
	);
};

export default Login;
