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

import type { BoqItem } from '@/services/analysis.types'
import { formatCurrency } from '@/utils/format'

interface BoqTableProps {
  items: BoqItem[]
}

export function BoqTable({ items }: BoqTableProps) {
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
          BOQ / Material Table
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
                  Description
                </TableHead>

                <TableHead className="text-cyan-100">
                  Code
                </TableHead>

                <TableHead className="text-cyan-100">
                  Unit
                </TableHead>

                <TableHead className="text-right text-cyan-100">
                  Quantity
                </TableHead>

                <TableHead className="text-right text-cyan-100">
                  Rate
                </TableHead>

                <TableHead className="text-right text-cyan-100">
                  Amount
                </TableHead>

              </TableRow>
            </TableHeader>

            <TableBody>

              {items.map((item) => (
                <TableRow
                  key={`${item.code}-${item.description}`}
                  className="
                    border-white/10
                    hover:bg-white/5
                  "
                >
                  <TableCell className="font-medium text-white">
                    {item.description}
                  </TableCell>

                  <TableCell className="text-white/80">
                    {item.code}
                  </TableCell>

                  <TableCell className="text-white/80">
                    {item.unit}
                  </TableCell>

                  <TableCell className="text-right text-white">
                    {item.quantity}
                  </TableCell>

                  <TableCell className="text-right text-white">
                    {formatCurrency(item.rate)}
                  </TableCell>

                  <TableCell className="text-right font-semibold text-cyan-100">
                    {formatCurrency(item.amount)}
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