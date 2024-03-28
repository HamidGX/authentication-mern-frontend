import { zodResolver } from '@hookform/resolvers/zod'
import { AxiosError } from 'axios'
import { useState } from 'react'
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

const formSchema = z.object({
	email: z.string().email({
		message: 'Invalid email format.',
	}),
})

export function ForgotPassword() {
	const [errorMessage, setErrorMessage] = useState<string>('')

	const form = useForm<z.infer<typeof formSchema>>({
		resolver: zodResolver(formSchema),
		defaultValues: {
			email: '',
		},
	})

	async function onSubmit(values: z.infer<typeof formSchema>) {
		try {
			const response = await clientAxios.post('/users/forgot-password', {
				email: values.email,
			})

			setErrorMessage(response.data.msg)
		} catch (error) {
			if (error instanceof AxiosError) {
				setErrorMessage(error.response?.data.msg)
			}
		}
	}
	return (
		<Card>
			<CardHeader className="space-y-1">
				<CardTitle className="text-2xl">
					Did you forget your password?
				</CardTitle>
				<CardDescription>
					Enter your email to recover your password
				</CardDescription>
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

						<Button className="w-full" type="submit">
							Send instructions
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
					<Link to="/create-account" className="text-center">
						Create account
					</Link>
				</div>
			</CardContent>
		</Card>
	)
}
