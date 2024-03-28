import { zodResolver } from '@hookform/resolvers/zod'
import { AxiosError } from 'axios'
import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { Link, useNavigate } from 'react-router-dom'
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

import useAuth from '@/hooks/useAuth'

const formSchema = z.object({
	email: z.string().email({
		message: 'Invalid email format.',
	}),
	password: z.string().min(6, {
		message: 'Password must be at least 6 characters.',
	}),
})

export function Login() {
	const [errorMessage, setErrorMessage] = useState<string>('')

	const { setAuth } = useAuth()

	const navigate = useNavigate()

	const form = useForm<z.infer<typeof formSchema>>({
		resolver: zodResolver(formSchema),
		defaultValues: {
			email: '',
			password: '',
		},
	})

	async function onSubmit(values: z.infer<typeof formSchema>) {
		try {
			const response = await clientAxios.post('/users/login', {
				email: values.email,
				password: values.password,
			})
			localStorage.setItem('token', response.data.token)
			setAuth(response.data)
			navigate('/home')
		} catch (error) {
			if (error instanceof AxiosError) {
				setErrorMessage(error.response?.data.msg)
			}
		}
	}
	return (
		<Card>
			<CardHeader className="space-y-1">
				<CardTitle className="text-2xl">Login</CardTitle>
				<CardDescription>Enter your email below to login</CardDescription>
			</CardHeader>
			<CardContent className="grid gap-4">
				<Form {...form}>
					<FormMessage>{errorMessage}</FormMessage>
					<form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
						<FormField
							control={form.control}
							name="email"
							render={({ field }) => (
								<FormItem>
									<FormLabel>Email</FormLabel>
									<FormControl>
										<Input
											type="email"
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
							name="password"
							render={({ field }) => (
								<FormItem>
									<FormLabel>Password</FormLabel>
									<FormControl>
										<Input
											type="password"
											autoComplete="on"
											placeholder="Enter your password"
											{...field}
										/>
									</FormControl>
									<FormMessage />
								</FormItem>
							)}
						/>

						<Button className="w-full" type="submit">
							Login
						</Button>
					</form>
				</Form>
				<div className="relative">
					<div className="absolute inset-0 flex items-center">
						<span className="w-full border-t" />
					</div>
					<div className="relative flex justify-center text-xs uppercase">
						<span className="bg-background px-2 text-muted-foreground">OR</span>
					</div>
				</div>
				<div className="flex justify-between text-xs uppercase bg-background px-2 text-muted-foreground">
					<Link to="/create-account" className="text-center">
						Create account
					</Link>
					<Link to="/forgot-password" className="text-center">
						Did you forget your password?
					</Link>
				</div>
			</CardContent>
		</Card>
	)
}
