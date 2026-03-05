import { login, signup } from './actions'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'

export default async function LoginPage(props: { searchParams: Promise<{ error?: string }> }) {
    const searchParams = await props.searchParams
    const error = searchParams?.error

    return (
        <div className="flex min-h-screen w-full items-center justify-center bg-zinc-950 p-4">
            <Card className="w-full max-w-sm border-zinc-800 bg-zinc-900 text-zinc-100 shadow-2xl">
                <form>
                    <CardHeader className="space-y-1">
                        <CardTitle className="text-3xl font-bold tracking-tight bg-gradient-to-br from-indigo-400 to-cyan-400 bg-clip-text text-transparent text-center">NexaPOS</CardTitle>
                        <CardDescription className="text-zinc-400 text-center">
                            Login or register to access the POS.
                        </CardDescription>
                    </CardHeader>
                    <CardContent className="grid gap-4 mt-4">
                        <div className="grid gap-2">
                            <Label htmlFor="email" className="text-zinc-200">Email</Label>
                            <Input
                                id="email"
                                name="email"
                                type="email"
                                placeholder="m@example.com"
                                required
                                className="bg-zinc-800 border-zinc-700 text-zinc-100"
                            />
                        </div>
                        <div className="grid gap-2">
                            <Label htmlFor="password" className="text-zinc-200">Password</Label>
                            <Input
                                id="password"
                                name="password"
                                type="password"
                                required
                                className="bg-zinc-800 border-zinc-700 text-zinc-100"
                            />
                        </div>
                        {error && <p className="text-sm font-medium text-red-500 bg-red-500/10 p-2 rounded">{error}</p>}
                    </CardContent>
                    <CardFooter className="flex flex-col gap-3">
                        <Button className="w-full bg-indigo-600 hover:bg-indigo-700 text-white" formAction={login}>
                            Sign In
                        </Button>
                        <Button variant="outline" className="w-full border-zinc-700 text-zinc-300 hover:bg-zinc-800 hover:text-white" formAction={signup}>
                            Sign Up (Test)
                        </Button>
                    </CardFooter>
                </form>
            </Card>
        </div>
    )
}
