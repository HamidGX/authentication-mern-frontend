import { AxiosError } from 'axios'
import { useEffect, useState } from 'react'
import { Link, useParams } from 'react-router-dom'

import {
	Card,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle,
} from '@/components/ui/card'

import clientAxios from '@/config/clientAxios'

export function ConfirmAccount() {
	const [Alert, setAlert] = useState({
		msg: '',
		error: false,
	})

	// Extracting id from URL params
	const params = useParams()
	const { id } = params

	useEffect(() => {
		const confirmAccount = async () => {
			try {
				const response = await clientAxios(`/users/confirm/${id}`)
				setAlert({
					msg: response.data.msg,
					error: false,
				})
			} catch (error) {
				if (error instanceof AxiosError) {
					setAlert({
						msg: error.response?.data.msg,
						error: true,
					})
				}
			}
		}
		return () => {
			confirmAccount()
		}
	}, [id])

	const { msg } = Alert

	return (
		<Card>
			<CardHeader className="space-y-1">
				<CardTitle className="text-2xl">Confirm account</CardTitle>
				<CardDescription>
					Your account will be automatically confirmed...
				</CardDescription>
			</CardHeader>
			<CardContent className="grid gap-4">
				<div className="py-10 flex justify-center">
					<p
						className={`text-3xl ${
							Alert.error ? 'text-red-500' : 'text-green-500'
						}`}
					>
						{msg}
					</p>
				</div>

				<div className="relative">
					<div className="absolute inset-0 flex items-center">
						<span className="w-full border-t" />
					</div>
					<div className="relative flex justify-center text-xs uppercase">
						<span className="bg-background px-2 text-muted-foreground">
							Don't have an account?
						</span>
					</div>
				</div>
				<div className="flex justify-between text-xs uppercase bg-background px-2 text-muted-foreground">
					<Link className="text-center" to="/">
						Login
					</Link>
					<Link className="text-center" to="/create-account">
						Create account
					</Link>
				</div>
			</CardContent>
		</Card>
	)
}
