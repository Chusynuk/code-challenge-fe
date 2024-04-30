import { useState } from 'react';
import { ErrorContext } from './context';

export const ErrorProvider = ({ children }: { children: React.ReactNode }) => {
    const [hasError, setHasError] = useState<boolean>(false);
    const [errorMessage, setErrorMessage] = useState<string>('');
    return (
        <ErrorContext.Provider
            value={{ hasError, setHasError, errorMessage, setErrorMessage }}
        >
            {children}
        </ErrorContext.Provider>
    );
};
