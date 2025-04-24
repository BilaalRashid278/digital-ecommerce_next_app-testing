import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"

// Mock data for recent sales
const recentSales = [
  {
    id: 1,
    customer: {
      name: "John Smith",
      email: "john@example.com",
      avatar: "/placeholder.svg?height=32&width=32",
    },
    product: "Premium Video Course",
    amount: 49.99,
    status: "Completed",
    date: "2 hours ago",
  },
  {
    id: 2,
    customer: {
      name: "Sarah Johnson",
      email: "sarah@example.com",
      avatar: "/placeholder.svg?height=32&width=32",
    },
    product: "E-Book Bundle",
    amount: 29.99,
    status: "Completed",
    date: "5 hours ago",
  },
  {
    id: 3,
    customer: {
      name: "Michael Brown",
      email: "michael@example.com",
      avatar: "/placeholder.svg?height=32&width=32",
    },
    product: "Software Template",
    amount: 79.99,
    status: "Processing",
    date: "1 day ago",
  },
  {
    id: 4,
    customer: {
      name: "Emily Davis",
      email: "emily@example.com",
      avatar: "/placeholder.svg?height=32&width=32",
    },
    product: "Design Assets Pack",
    amount: 39.99,
    status: "Completed",
    date: "2 days ago",
  },
]

export default function RecentSalesTable() {
  return (
    <div className="space-y-4">
      {recentSales.map((sale) => (
        <div key={sale.id} className="flex items-center">
          <Avatar className="h-9 w-9">
            <AvatarImage src={sale.customer.avatar} alt={sale.customer.name} />
            <AvatarFallback>{sale.customer.name.charAt(0)}</AvatarFallback>
          </Avatar>
          <div className="ml-4 space-y-1">
            <p className="text-sm font-medium leading-none">{sale.customer.name}</p>
            <p className="text-sm text-muted-foreground">{sale.customer.email}</p>
          </div>
          <div className="ml-auto text-right">
            <Badge
              className={
                sale.status === "Completed"
                  ? "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400"
                  : "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400"
              }
            >
              {sale.status}
            </Badge>
            <p className="text-sm font-medium">${sale.amount}</p>
            <p className="text-xs text-muted-foreground">{sale.date}</p>
          </div>
        </div>
      ))}
    </div>
  )
}

