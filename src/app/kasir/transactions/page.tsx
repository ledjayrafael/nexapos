import { createClient } from '@/utils/supabase/server'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'

export default async function TransactionsPage() {
    const supabase = await createClient()

    const { data: transactions, error } = await supabase
        .from('transactions')
        .select(`
      id, total_price, created_at,
      order_items (
        id, quantity, price_at_time,
        products ( name )
      )
    `)
        .order('created_at', { ascending: false })

    if (error) {
        console.error(error)
    }

    return (
        <div className="space-y-6">
            <h1 className="text-3xl font-bold tracking-tight">Transaction History</h1>
            <p className="text-zinc-400">View past sales and receipts.</p>

            <Card className="bg-zinc-900 border-zinc-800">
                <CardHeader>
                    <CardTitle className="text-zinc-100">Recent Transactions</CardTitle>
                </CardHeader>
                <CardContent>
                    <Table>
                        <TableHeader>
                            <TableRow className="border-zinc-800 hover:bg-zinc-800/50">
                                <TableHead className="text-zinc-400">Date & Time</TableHead>
                                <TableHead className="text-zinc-400">Items Sold</TableHead>
                                <TableHead className="text-right text-zinc-400">Total Price</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {transactions?.map((tx) => (
                                <TableRow key={tx.id} className="border-zinc-800 hover:bg-zinc-800/50 align-top">
                                    <TableCell className="text-zinc-300">
                                        {new Date(tx.created_at).toLocaleString('id-ID')}
                                        <div className="text-xs text-zinc-600 mt-1 font-mono">{tx.id.split('-')[0]}</div>
                                    </TableCell>
                                    <TableCell>
                                        <ul className="space-y-1">
                                            {tx.order_items.map((item: any) => (
                                                <li key={item.id} className="text-sm text-zinc-400">
                                                    <span className="text-zinc-300 font-medium">{item.quantity}x</span> {item.products?.name || 'Unknown Product'}
                                                    <span className="text-zinc-500 ml-2">(@ Rp {item.price_at_time.toLocaleString('id-ID')})</span>
                                                </li>
                                            ))}
                                        </ul>
                                    </TableCell>
                                    <TableCell className="text-right font-medium text-emerald-400 text-lg">
                                        Rp {tx.total_price.toLocaleString('id-ID')}
                                    </TableCell>
                                </TableRow>
                            ))}
                            {!transactions || transactions.length === 0 && (
                                <TableRow>
                                    <TableCell colSpan={3} className="h-24 text-center text-zinc-500">
                                        No transactions found.
                                    </TableCell>
                                </TableRow>
                            )}
                        </TableBody>
                    </Table>
                </CardContent>
            </Card>
        </div>
    )
}
