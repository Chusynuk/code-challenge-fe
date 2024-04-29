import { useState } from 'react';

export default function useToken() {
    const getToken = () => {
        const tokenString = sessionStorage?.getItem('token');

        const token = JSON.parse(tokenString as string);
        return token;
    };
    const [token, setToken] = useState(getToken());

    const saveToken = (userToken: string) => {
        sessionStorage.setItem('token', JSON.stringify(userToken));
        setToken(userToken);
    };

    return {
        setToken: saveToken,
        token,
    };
}
