import { Navigate } from 'react-router-dom'
import useToken from '../hooks/useToken'

interface IProtectedRoutes {
    redirectPath?: string
    children: React.ReactElement
}

const ProtectedRoute = ({
    redirectPath = '/login',
    children,
}: IProtectedRoutes) => {
    const { token } = useToken()
    if (!token) {
        return <Navigate to={redirectPath} replace />
    }

    return children
}

export { ProtectedRoute }
