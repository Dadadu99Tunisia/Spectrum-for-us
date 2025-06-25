import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { prisma } from "@/lib/db"
import { Users, ShoppingBag, DollarSign, TrendingUp } from "lucide-react"

export async function AdminStats() {
  const [totalUsers, totalProducts, totalOrders, totalRevenue, recentOrders] = await Promise.all([
    prisma.user.count(),
    prisma.product.count(),
    prisma.order.count(),
    prisma.order.aggregate({
      _sum: {
        total: true,
      },
      where: {
        status: "DELIVERED",
      },
    }),
    prisma.order.count({
      where: {
        createdAt: {
          gte: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000), // 30 jours
        },
      },
    }),
  ])

  const stats = [
    {
      title: "Utilisateurs Total",
      value: totalUsers.toLocaleString(),
      description: "Utilisateurs inscrits",
      icon: Users,
    },
    {
      title: "Produits",
      value: totalProducts.toLocaleString(),
      description: "Produits en ligne",
      icon: ShoppingBag,
    },
    {
      title: "Commandes",
      value: totalOrders.toLocaleString(),
      description: "Commandes totales",
      icon: TrendingUp,
    },
    {
      title: "Revenus",
      value: `${(totalRevenue._sum.total || 0).toLocaleString()} €`,
      description: "Revenus totaux",
      icon: DollarSign,
    },
  ]

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
      {stats.map((stat) => (
        <Card key={stat.title}>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">{stat.title}</CardTitle>
            <stat.icon className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stat.value}</div>
            <p className="text-xs text-muted-foreground">{stat.description}</p>
          </CardContent>
        </Card>
      ))}
    </div>
  )
}
