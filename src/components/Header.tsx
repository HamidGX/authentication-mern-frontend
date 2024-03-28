import { LogOut } from 'lucide-react'

import { Button } from '@/components/ui/button'

import useAuth from '@/hooks/useAuth'

export default function Header() {
	const { closeSessionAuth } = useAuth()

	const handleCloseSession = () => {
		closeSessionAuth()
		localStorage.removeItem('token')
	}

	return (
		<header className="sticky top-0 z-10 flex h-[53px] items-center gap-1 border-b bg-background px-4">
			<h1 className="text-xl font-semibold">Banner</h1>
			<Button
				variant="outline"
				size="sm"
				className="ml-auto gap-1.5 text-sm"
				onClick={handleCloseSession}
			>
				<LogOut className="size-3.5" />
				Log out
			</Button>
		</header>
	)
}
