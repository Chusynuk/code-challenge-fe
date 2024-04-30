import { createContext } from 'react';

const ErrorContext = createContext({
    hasError: false,
    setHasError: (isFetchError: boolean) => {},
    errorMessage: '',
    setErrorMessage: (isFetchError: string) => {},
});

export { ErrorContext };
