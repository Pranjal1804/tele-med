import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Heart, Activity, Thermometer, Weight, TrendingUp, TrendingDown } from "lucide-react"

const healthMetrics = [
  {
    icon: Heart,
    label: "Blood Pressure",
    value: "120/80",
    unit: "mmHg",
    status: "normal",
    trend: "stable",
    color: "text-secondary",
  },
  {
    icon: Activity,
    label: "Heart Rate",
    value: "72",
    unit: "bpm",
    status: "normal",
    trend: "up",
    color: "text-primary",
  },
  {
    icon: Thermometer,
    label: "Temperature",
    value: "98.6",
    unit: "°F",
    status: "normal",
    trend: "stable",
    color: "text-chart-4",
  },
  {
    icon: Weight,
    label: "Weight",
    value: "165",
    unit: "lbs",
    status: "normal",
    trend: "down",
    color: "text-chart-3",
  },
]

export function HealthSummary() {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Activity className="w-5 h-5" />
          Health Summary
        </CardTitle>
        <CardDescription>Your latest vital signs and metrics</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-2 gap-4">
          {healthMetrics.map((metric, index) => (
            <div key={index} className="space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <metric.icon className={`w-4 h-4 ${metric.color}`} />
                  <span className="text-sm font-medium">{metric.label}</span>
                </div>
                <div className="flex items-center gap-1">
                  {metric.trend === "up" && <TrendingUp className="w-3 h-3 text-chart-4" />}
                  {metric.trend === "down" && <TrendingDown className="w-3 h-3 text-secondary" />}
                  {metric.trend === "stable" && <div className="w-3 h-3" />}
                </div>
              </div>

              <div className="space-y-2">
                <div className="flex items-baseline gap-1">
                  <span className="text-2xl font-bold">{metric.value}</span>
                  <span className="text-sm text-muted-foreground">{metric.unit}</span>
                </div>
                <Badge variant={metric.status === "normal" ? "secondary" : "destructive"} className="text-xs">
                  {metric.status}
                </Badge>
              </div>
            </div>
          ))}
        </div>

        <div className="mt-6 space-y-4">
          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span>Health Score</span>
              <span className="font-medium">85/100</span>
            </div>
            <Progress value={85} className="h-2" />
          </div>

          <div className="text-xs text-muted-foreground">Last updated: 2 hours ago • Next check-up: Jan 15, 2024</div>
        </div>
      </CardContent>
    </Card>
  )
}
