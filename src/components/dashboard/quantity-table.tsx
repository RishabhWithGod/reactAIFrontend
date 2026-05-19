import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'

import type { AnalysisItem } from '@/services/analysis.types'

interface QuantityTableProps {
  items: AnalysisItem[]
}

export function QuantityTable({
  items,
}: QuantityTableProps) {
  return (
    <Card
      className="
        rounded-[32px]
        border
        border-white/10
        bg-[#6d8fd0]/20
        shadow-[0_8px_40px_rgba(0,0,0,0.12)]
        backdrop-blur-md
      "
    >
      <CardHeader>
        <CardTitle className="text-white">
          Quantity Counter Table
        </CardTitle>
      </CardHeader>

      <CardContent>

        <div
          className="
            overflow-x-auto
            rounded-[24px]
            border
            border-white/10
            bg-[#7394cf]/18
          "
        >
          <Table>

            <TableHeader>
              <TableRow className="border-white/10 hover:bg-transparent">

                <TableHead className="text-cyan-100">
                  Component
                </TableHead>

                <TableHead className="text-cyan-100">
                  Symbol
                </TableHead>

                <TableHead className="text-cyan-100">
                  Category
                </TableHead>

                <TableHead className="text-right text-cyan-100">
                  Quantity
                </TableHead>

              </TableRow>
            </TableHeader>

            <TableBody>

              {items.map((item) => (
                <TableRow
                  key={`${item.symbol}-${item.name}`}
                  className="
                    border-white/10
                    hover:bg-white/5
                  "
                >
                  <TableCell className="font-medium text-white">
                    {item.name}
                  </TableCell>

                  <TableCell className="text-white/80">
                    {item.symbol}
                  </TableCell>

                  <TableCell className="text-white/80">
                    {item.category}
                  </TableCell>

                  <TableCell className="text-right font-semibold text-cyan-100">
                    {item.quantity}
                  </TableCell>
                </TableRow>
              ))}

            </TableBody>

          </Table>
        </div>

      </CardContent>
    </Card>
  )
}