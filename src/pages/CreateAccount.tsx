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

const formSchema = z
	.object({
		name: z.string().min(2, {
			message: 'name must be at least 2 characters.',
		}),
		email: z.string().email({
			message: 'Invalid email format.',
		}),
		password: z.string().min(6, {
			message: 'Password must be at least 6 characters.',
		}),
		confirm: z.string().min(6, {
			message: 'Password must be at least 6 characters.',
		}),
	})
	.refine((data) => data.password === data.confirm, {
		message: "Passwords don't match",
		path: ['confirm'],
	})

export function CreateAccount() {
	const [errorMessage, setErrorMessage] = useState<string>('')

	const { setAuth } = useAuth()
	const navigate = useNavigate()
	// 1. Define your form.
	const form = useForm<z.infer<typeof formSchema>>({
		resolver: zodResolver(formSchema),
		defaultValues: {
			name: '',
			email: '',
			password: '',
			confirm: '',
		},
	})

	async function onSubmit(values: z.infer<typeof formSchema>) {
		try {
			const response = await clientAxios.post('/users', {
				name: values.name,
				email: values.email,
				password: values.password,
			})
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
				<CardTitle className="text-2xl">Create an account</CardTitle>
				<CardDescription>
					Enter your email below to create your account
				</CardDescription>
			</CardHeader>
			<CardContent className="grid gap-4">
				<Form {...form}>
					<FormMessage>{errorMessage}</FormMessage>
					<form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
						<FormField
							control={form.control}
							name="name"
							render={({ field }) => (
								<FormItem>
									<FormLabel>Name</FormLabel>
									<FormControl>
										<Input placeholder="Enter your name" {...field} />
									</FormControl>
									<FormMessage />
								</FormItem>
							)}
						/>
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
											placeholder="Enter your password"
											{...field}
										/>
									</FormControl>
									<FormMessage />
								</FormItem>
							)}
						/>
						<FormField
							control={form.control}
							name="confirm"
							render={({ field }) => (
								<FormItem>
									<FormLabel>Repit password</FormLabel>
									<FormControl>
										<Input
											type="password"
											placeholder="Enter your password"
											{...field}
										/>
									</FormControl>
									<FormMessage />
								</FormItem>
							)}
						/>
						<Button className="w-full" type="submit">
							Register
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
					<Link to="/" className="text-center">
						Login
					</Link>
					<Link to="/forgot-password" className="text-center">
						Did you forget your password?
					</Link>
				</div>
			</CardContent>
		</Card>
	)
}
