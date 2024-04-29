import { Box, Button, TextField, Typography } from '@mui/material';
import axios from 'axios';
import { useContext, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Layout } from '../components';
import ErrorContext from '../context/context';
import useToken from '../hooks/useToken';

const Login = () => {
    const navigate = useNavigate();
    const { setToken } = useToken();
    const [email, setEmail] = useState('');
    const [loginErrorMsg, setLoginErrorMsg] = useState('');
    const [password, setPassword] = useState('');
    const { isFetchError, setIsFetchError } = useContext(ErrorContext);
    const handleEmail = (event: React.ChangeEvent<HTMLInputElement>) =>
        setEmail(event.target.value);
    const handlePassword = (event: React.ChangeEvent<HTMLInputElement>) =>
        setPassword(event.target.value);
    console.log('isFetchError', isFetchError);
    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        e.stopPropagation();

        try {
            const res = await axios.post(
                'http://localhost:3000/login',
                JSON.stringify({
                    email,
                    password,
                }),
                {
                    headers: { 'Content-Type': 'application/json' },
                }
            );

            setToken(res.data.token);

            sessionStorage.setItem('email', email);

            navigate('/dashboard');
        } catch (error) {
            setIsFetchError(error);
            if (error instanceof Error) {
                console.error(error.response.data.message);
                setLoginErrorMsg(error.response.data.message);
            }
        }
    };

    return (
        <Layout>
            <form
                onSubmit={handleSubmit}
                style={{
                    display: 'flex',
                    flexDirection: 'column',
                    gap: '20px',
                    padding: '16px',
                    border: '1px solid black',
                }}
            >
                <Box
                    display="flex"
                    flexDirection="column"
                    justifyContent="center"
                    textAlign="center"
                    borderRadius="5px"
                    border="1px solid black"
                    width="230px"
                    height="40px"
                    style={{ backgroundColor: 'beige' }} // Box component does not provide backgroundColor prop
                >
                    <Typography>FinMid Login</Typography>
                </Box>
                <TextField
                    type="email"
                    error={Boolean(loginErrorMsg)}
                    label="Email"
                    helperText={loginErrorMsg}
                    onChange={handleEmail}
                    onFocus={() => setLoginErrorMsg('')}
                    autoComplete="off"
                />
                <TextField
                    type="password"
                    error={Boolean(loginErrorMsg)}
                    label="Password"
                    helperText={loginErrorMsg}
                    onChange={handlePassword}
                    onFocus={() => setLoginErrorMsg('')}
                    autoComplete="off"
                />
                <Button variant="contained" type="submit">
                    Log in
                </Button>
            </form>
        </Layout>
    );
};

export default Login;
