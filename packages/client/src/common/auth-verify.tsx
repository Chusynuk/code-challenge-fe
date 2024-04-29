import { useEffect } from 'react'

import { withRouter } from './with-router'

const parseJwt = (token: string) => {
    try {
        return JSON.parse(atob(token.split('.')[1]))
    } catch (e) {
        return null
    }
}

const AuthVerify = (props) => {
    const location = props.router.location

    useEffect(() => {
        const token = JSON.parse(sessionStorage.getItem('token') as string)

        if (token) {
            const decodedJwt = parseJwt(token)

            if (decodedJwt.exp * 1000 < Date.now()) {
                props.handleLogout()
            }
        }
    }, [location])

    return null
}

export default withRouter(AuthVerify)
