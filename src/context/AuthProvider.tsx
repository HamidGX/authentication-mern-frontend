import { createContext, useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'

import clientAxios from '@/config/clientAxios'

// Interface for authentication
interface Auth {
	_id?: string
	token: string
	email: string
	password: string
	name?: string
}

// Type for authentication context
interface AuthContextType {
	auth: Auth
	setAuth: (auth: Auth) => void
	loading: boolean
	closeSessionAuth: () => void
}

// Crea el contexto de autenticación
const AuthContext = createContext<AuthContextType>({
	auth: { token: '', email: '', password: '', name: '' }, // Initial state with the structure defined in the Auth interface
	setAuth: () => {},
	loading: true,
	closeSessionAuth: () => {},
})

// Proveedor de autenticación
const AuthProvider = ({
	children,
}: {
	children: JSX.Element | JSX.Element[]
}) => {
	const [auth, setAuth] = useState<Auth>({
		token: '',
		email: '',
		password: '',
	}) // Set the type for the initial state

	const [loading, setLoading] = useState(true)
	const navigate = useNavigate()

	useEffect(() => {
		const authenticateUser = async () => {
			const token = localStorage.getItem('token')
			if (!token) {
				setLoading(false)
				return
			}
			const config = {
				headers: {
					'Content-Type': 'application/json',
					Authorization: `Bearer ${token}`,
				},
			}
			try {
				const { data } = await clientAxios('/users/profile', config)
				setAuth(data)
				navigate('/home')
			} catch (error) {
				setAuth({ token: '', email: '', password: '' }) // Reset the authentication state if there is an error
			}
			setLoading(false)
		}
		return () => {
			authenticateUser()
		}
	}, [])

	const closeSessionAuth = () => {
		setAuth({ token: '', email: '', password: '' }) // Log out by resetting the authentication state
	}

	return (
		<AuthContext.Provider
			value={{
				auth,
				setAuth,
				loading,
				closeSessionAuth,
			}}
		>
			{children}
		</AuthContext.Provider>
	)
}

export { AuthProvider, AuthContext }
