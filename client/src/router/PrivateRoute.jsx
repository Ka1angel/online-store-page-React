import { Navigate } from 'react-router-dom'
import { useEffect, useState } from 'react'
import Loader from '../components/Loader'

export default function PrivateRoute({ children }) {
	const isAuth = localStorage.getItem('auth_token')

	const [loading, setLoading] = useState(true)

	useEffect(() => {
		if (isAuth) {
			setTimeout(() => setLoading(false), 2200)
		} else {
			setLoading(false)
		}
	}, [isAuth])

	if (loading) return <Loader />

	return isAuth ? children : <Navigate to='/' replace />
}
