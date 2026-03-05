import { createClient } from '@/utils/supabase/server'
import { addCashier, deleteCashier } from './actions'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'

export default async function DeveloperUsersPage() {
    const supabase = await createClient()

    const { data: cashiers, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('role', 'cashier')
        .order('created_at', { ascending: false })

    if (error) {
        console.error(error)
    }

    return (
        <div className="space-y-6">
            <h1 className="text-3xl font-bold tracking-tight">Manage Cashiers</h1>

            <div className="grid gap-6 md:grid-cols-[1fr_2fr]">
                <Card className="bg-zinc-900 border-zinc-800">
                    <CardHeader>
                        <CardTitle className="text-zinc-100">Add New Cashier</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <form action={addCashier} className="space-y-4">
                            <div className="space-y-2">
                                <Label htmlFor="email" className="text-zinc-200">Email Address</Label>
                                <Input
                                    id="email"
                                    name="email"
                                    type="email"
                                    required
                                    placeholder="cashier@example.com"
                                    className="bg-zinc-800 border-zinc-700 text-zinc-100"
                                />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="password" className="text-zinc-200">Password</Label>
                                <Input
                                    id="password"
                                    name="password"
                                    type="password"
                                    required
                                    minLength={6}
                                    className="bg-zinc-800 border-zinc-700 text-zinc-100"
                                />
                            </div>
                            <Button type="submit" className="w-full bg-cyan-600 hover:bg-cyan-700 text-white">
                                Create Cashier Account
                            </Button>
                        </form>
                    </CardContent>
                </Card>

                <Card className="bg-zinc-900 border-zinc-800">
                    <CardHeader>
                        <CardTitle className="text-zinc-100">Store Cashiers</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <Table>
                            <TableHeader>
                                <TableRow className="border-zinc-800 hover:bg-zinc-800/50">
                                    <TableHead className="text-zinc-400">Email</TableHead>
                                    <TableHead className="text-zinc-400">Role</TableHead>
                                    <TableHead className="text-zinc-400">Created</TableHead>
                                    <TableHead className="text-right text-zinc-400">Actions</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {cashiers?.map((user) => (
                                    <TableRow key={user.id} className="border-zinc-800 hover:bg-zinc-800/50">
                                        <TableCell className="font-medium text-zinc-200">{user.email}</TableCell>
                                        <TableCell>
                                            <span className="inline-flex items-center rounded-full bg-indigo-500/10 px-2.5 py-0.5 text-xs font-semibold text-indigo-400">
                                                {user.role}
                                            </span>
                                        </TableCell>
                                        <TableCell className="text-zinc-400">{new Date(user.created_at).toLocaleDateString()}</TableCell>
                                        <TableCell className="text-right">
                                            <form action={deleteCashier}>
                                                <input type="hidden" name="user_id" value={user.id} />
                                                <Button variant="destructive" size="sm" type="submit" className="bg-red-900/50 text-red-400 hover:bg-red-900/80 hover:text-red-300 border border-red-900/50">
                                                    Delete
                                                </Button>
                                            </form>
                                        </TableCell>
                                    </TableRow>
                                ))}
                                {!cashiers || cashiers.length === 0 && (
                                    <TableRow>
                                        <TableCell colSpan={4} className="h-24 text-center text-zinc-500">
                                            No cashiers found. Add one to get started.
                                        </TableCell>
                                    </TableRow>
                                )}
                            </TableBody>
                        </Table>
                    </CardContent>
                </Card>
            </div>
        </div>
    )
}
