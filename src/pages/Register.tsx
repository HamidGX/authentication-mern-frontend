import { zodResolver } from '@hookform/resolvers/zod'
import { AxiosError } from 'axios'
import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { useNavigate } from 'react-router-dom'
import { z } from 'zod'

import { Button } from '@/components/ui/button'
import {
	Form,
	FormControl,
	FormDescription,
	FormField,
	FormItem,
	FormLabel,
	FormMessage,
} from '@/components/ui/form'
import { Input } from '@/components/ui/input'

import clientAxios from '@/config/clientAxios'

import useAuth from '@/hooks/useAuth'

const formSchema = z.object({
	name: z.string().min(2, {
		message: 'name must be at least 2 characters.',
	}),
	email: z.string().email({
		message: 'Invalid email format.',
	}),
	password: z.string().min(6, {
		message: 'Password must be at least 6 characters.',
	}),
})

export function Register() {
	const [errorMessage, setErrorMessage] = useState<string>('')

	const { setAuth } = useAuth()
	const navigate = useNavigate()

	const form = useForm<z.infer<typeof formSchema>>({
		resolver: zodResolver(formSchema),
		defaultValues: {
			name: '',
			email: '',
			password: '',
		},
	})

	async function onSubmit(values: z.infer<typeof formSchema>) {
		try {
			const response = await clientAxios.post('/users', {
				email: values.email,
				password: values.password,
			})
			setAuth(response.data)
			navigate('/inicio')
		} catch (error) {
			if (error instanceof AxiosError) {
				setErrorMessage(error.response?.data.msg)
			}
		}
	}

	return (
		<Form {...form}>
			<FormMessage>{errorMessage}</FormMessage>
			<form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
				<FormField
					control={form.control}
					name="name"
					render={({ field }) => (
						<FormItem>
							<FormLabel>name</FormLabel>
							<FormControl>
								<Input placeholder="Enter your name" {...field} />
							</FormControl>
							<FormDescription>
								This is your public display name.
							</FormDescription>
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
								<Input type="email" placeholder="Enter your email" {...field} />
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
				<Button type="submit">Register</Button>
			</form>
		</Form>
	)
}
