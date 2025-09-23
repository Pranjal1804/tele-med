import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Users, Calendar, Clock, TrendingUp, Video, MessageSquare, FileText, Star } from "lucide-react"

const stats = [
  {
    icon: Users,
    label: "Patients Today",
    value: "12",
    change: "+2",
    changeType: "increase",
    color: "text-primary",
  },
  {
    icon: Video,
    label: "Consultations",
    value: "8",
    change: "+1",
    changeType: "increase",
    color: "text-secondary",
  },
  {
    icon: Clock,
    label: "Avg. Session",
    value: "28m",
    change: "-3m",
    changeType: "decrease",
    color: "text-chart-3",
  },
  {
    icon: Star,
    label: "Rating",
    value: "4.9",
    change: "+0.1",
    changeType: "increase",
    color: "text-chart-4",
  },
]

const quickStats = [
  {
    icon: MessageSquare,
    label: "Unread Messages",
    value: 5,
    color: "bg-primary/10 text-primary",
  },
  {
    icon: FileText,
    label: "Pending Reports",
    value: 3,
    color: "bg-secondary/10 text-secondary",
  },
  {
    icon: Calendar,
    label: "This Week",
    value: 47,
    color: "bg-chart-3/10 text-chart-3",
  },
]

export function StatsOverview() {
  return (
    <div className="space-y-6">
      {/* Main Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((stat, index) => (
          <Card key={index}>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div className={`w-10 h-10 rounded-lg bg-accent/20 flex items-center justify-center ${stat.color}`}>
                  <stat.icon className="w-5 h-5" />
                </div>
                <Badge variant={stat.changeType === "increase" ? "secondary" : "outline"} className="text-xs">
                  {stat.change}
                </Badge>
              </div>
              <div className="mt-4 space-y-1">
                <div className="text-2xl font-bold">{stat.value}</div>
                <div className="text-sm text-muted-foreground">{stat.label}</div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Quick Stats */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <TrendingUp className="w-5 h-5" />
            Quick Overview
          </CardTitle>
          <CardDescription>Important metrics at a glance</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-3 gap-4">
            {quickStats.map((stat, index) => (
              <div key={index} className="text-center space-y-2">
                <div className={`w-12 h-12 rounded-xl mx-auto flex items-center justify-center ${stat.color}`}>
                  <stat.icon className="w-6 h-6" />
                </div>
                <div className="space-y-1">
                  <div className="text-xl font-bold">{stat.value}</div>
                  <div className="text-xs text-muted-foreground">{stat.label}</div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
