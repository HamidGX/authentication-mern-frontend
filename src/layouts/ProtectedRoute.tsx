import { Navigate, Outlet } from 'react-router-dom'

import Header from '@/components/Header'

import useAuth from '@/hooks/useAuth'

const ProtectedRoute = () => {
	const { auth, loading } = useAuth()
	if (loading) return 'loading...'
	return (
		<>
			{auth._id ? (
				<div>
					<Header />
					<div>
						<main className="grid place-items-center container mx-auto py-10 mb-10">
							<Outlet />
						</main>
					</div>
				</div>
			) : (
				<Navigate to="/" />
			)}
		</>
	)
}
export default ProtectedRoute
