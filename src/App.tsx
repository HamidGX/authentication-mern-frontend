import { BrowserRouter, Route, Routes } from 'react-router-dom'

import { ConfirmAccount } from '@/pages/ConfirmAccount'
import { CreateAccount } from '@/pages/CreateAccount'
import { ForgotPassword } from '@/pages/ForgotPassword'
import Home from '@/pages/Home'
import { Login } from '@/pages/Login'
import { NewPassword } from '@/pages/NewPassword'
import { Register } from '@/pages/Register'

import AuthLayout from '@/layouts/AuthLayout'
import ProtectedRoute from '@/layouts/ProtectedRoute'

import { AuthProvider } from '@/context/AuthProvider'

export default function App() {
	return (
		<BrowserRouter>
			<AuthProvider>
				<Routes>
					<Route path="/" element={<AuthLayout />}>
						<Route index element={<Login />} />
						<Route path="register" element={<Register />} />
						<Route path="create-account" element={<CreateAccount />} />
						<Route path="forgot-password" element={<ForgotPassword />} />
						<Route path="forgot-password/:id" element={<NewPassword />} />
						<Route path="confirm/:id" element={<ConfirmAccount />} />
					</Route>
					<Route path="/home" element={<ProtectedRoute />}>
						<Route index element={<Home />} />
					</Route>
				</Routes>
			</AuthProvider>
		</BrowserRouter>
	)
}
