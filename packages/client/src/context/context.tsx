import { createContext } from 'react';

const ErrorContext = createContext({
    isFetchError: false,
    setIsFetchError: (isFetchError: boolean) => {},
});

export { ErrorContext };
