import { createContext } from 'react'

const ErrorContext = createContext({
    isFetchError: '',
    setIsFetchError: () => {},
})

export default ErrorContext
