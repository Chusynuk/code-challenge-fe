import {
    BrowserRouter,
    Navigate,
    Route,
    Routes,
    useNavigate,
} from 'react-router-dom'
import './App.css'
import AuthVerify from './common/auth-verify'
import { ProtectedRoute } from './common/protected-route'
import { useToken } from './hooks'

import Dashboard from './pages/Dashboard'
import Login from './pages/Login'

function App() {
    return (
        <BrowserRouter>
            <MainComponent />
        </BrowserRouter>
    )
}

function MainComponent() {
    const { setToken } = useToken()
    const navigate = useNavigate()
    const handleLogout = () => {
        setToken('')
        navigate('/login')
    }

    return (
        <>
            <Routes>
                <Route path="/login" element={<Login />} />
                <Route path="*" element={<Navigate to="/login" replace />} />
                <Route
                    path="/dashboard"
                    element={
                        <ProtectedRoute>
                            <Dashboard />
                        </ProtectedRoute>
                    }
                />
            </Routes>
            <AuthVerify handleLogout={handleLogout} />
        </>
    )
}

export default App
