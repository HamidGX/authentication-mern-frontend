import { zodResolver } from '@hookform/resolvers/zod'
import { AxiosError } from 'axios'
import { useEffect, useState } from 'react'
import { useForm } from 'react-hook-form'
import { Link } from 'react-router-dom'
import { z } from 'zod'

import { Button } from '@/components/ui/button'
import {
	Card,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle,
} from '@/components/ui/card'
import {
	Form,
	FormControl,
	FormField,
	FormItem,
	FormLabel,
	FormMessage,
} from '@/components/ui/form'
import { Input } from '@/components/ui/input'

import clientAxios from '@/config/clientAxios'

const formSchema = z
	.object({
		password: z.string().min(6, {
			message: 'Password must be at least 6 characters.',
		}),

		confirmPassword: z.string().min(6, {
			message: 'Password must be at least 6 characters.',
		}),
	})

	.refine((data) => data.password === data.confirmPassword, {
		message: "Passwords don't match",
		path: ['confirm'],
	})
export function NewPassword() {
	const [errorMessage, setErrorMessage] = useState({
		msg: '',
		error: false,
	})

	const [token, setToken] = useState<boolean>(false)

	const form = useForm<z.infer<typeof formSchema>>({
		resolver: zodResolver(formSchema),
		defaultValues: {
			password: '',
			confirmPassword: '',
		},
	})

	useEffect(() => {
		const validationToken = async () => {
			try {
				const response = await clientAxios(`/users/confirm/${token}`)
				setErrorMessage({
					msg: response.data.msg,
					error: false,
				})
				setToken(true)
			} catch (error) {
				if (error instanceof AxiosError) {
					setErrorMessage({
						msg: error.response?.data.msg,
						error: true,
					})
				}
			}
		}
		return () => {
			validationToken()
		}
	}, [token])

	async function onSubmit(values: z.infer<typeof formSchema>) {
		try {
			const response = await clientAxios.post(
				'/users/forgot-password/${token}',
				{
					password: values.password,
				},
			)
			setErrorMessage(response.data.msg)
		} catch (error) {
			if (error instanceof AxiosError) {
				setErrorMessage(error.response?.data.msg)
			}
		}
	}

	const { msg } = errorMessage

	return (
		<Card>
			<CardHeader className="space-y-1">
				<CardTitle className="text-2xl">New Password</CardTitle>
				<CardDescription>
					Enter your email to recover your password
				</CardDescription>
			</CardHeader>
			<CardContent className="grid gap-4">
				{token ? (
					<Form {...form}>
						<form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
							<FormField
								control={form.control}
								name="password"
								render={({ field }) => (
									<FormItem>
										<FormLabel>Password</FormLabel>
										<FormControl>
											<Input
												type="password"
												placeholder="Enter your email"
												{...field}
											/>
										</FormControl>
										<FormMessage />
									</FormItem>
								)}
							/>
							<FormField
								control={form.control}
								name="confirmPassword"
								render={({ field }) => (
									<FormItem>
										<FormLabel>Password</FormLabel>
										<FormControl>
											<Input
												type="password"
												placeholder="Enter your email"
												{...field}
											/>
										</FormControl>
										<FormMessage />
									</FormItem>
								)}
							/>

							<Button className="w-full" type="submit">
								Change Password
							</Button>
						</form>
					</Form>
				) : (
					<div className="flex justify-center py-10">
						<p className="text-red-500 text-3xl">{msg}</p>
					</div>
				)}
				<div className="relative">
					<div className="absolute inset-0 flex items-center">
						<span className="w-full border-t" />
					</div>
					<div className="relative flex justify-center text-xs uppercase">
						<span className="bg-background px-2 text-muted-foreground">OR</span>
					</div>
				</div>
				<div className="flex justify-between text-xs uppercase bg-background px-2 text-muted-foreground">
					<Link to="/" className="text-center">
						Login
					</Link>
					<Link to="/create-account" className="text-center">
						Create account
					</Link>
				</div>
			</CardContent>
		</Card>
	)
}
