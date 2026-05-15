import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import type { AnalysisItem } from '@/services/analysis.types'

interface QuantityTableProps {
  items: AnalysisItem[]
}

export function QuantityTable({ items }: QuantityTableProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Quantity counter table</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Component</TableHead>
                <TableHead>Symbol</TableHead>
                <TableHead>Category</TableHead>
                <TableHead className="text-right">Quantity</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {items.map((item) => (
                <TableRow key={`${item.symbol}-${item.name}`}>
                  <TableCell className="font-medium text-white">{item.name}</TableCell>
                  <TableCell>{item.symbol}</TableCell>
                  <TableCell>{item.category}</TableCell>
                  <TableCell className="text-right">{item.quantity}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </CardContent>
    </Card>
  )
}
