import { useState } from 'react';
import { ErrorContext } from './context';

export const ErrorProvider = ({ children }: { children: React.ReactNode }) => {
    const [isFetchError, setIsFetchError] = useState<boolean>(false);
    return (
        <ErrorContext.Provider value={{ isFetchError, setIsFetchError }}>
            {children}
        </ErrorContext.Provider>
    );
};
