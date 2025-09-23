import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { FileText, MessageSquare, Calendar, Clock } from "lucide-react"

const activities = [
  {
    icon: FileText,
    title: "Lab Results Available",
    description: "Blood work results from Dr. Johnson",
    time: "2 hours ago",
    type: "results",
    action: "Download",
  },
  {
    icon: MessageSquare,
    title: "New Message",
    description: "Dr. Chen responded to your question",
    time: "4 hours ago",
    type: "message",
    action: "Read",
  },
  {
    icon: Calendar,
    title: "Appointment Confirmed",
    description: "Follow-up with Dr. Rodriguez on Dec 28",
    time: "1 day ago",
    type: "appointment",
    action: "View",
  },
  {
    icon: FileText,
    title: "Prescription Updated",
    description: "Medication dosage adjusted",
    time: "2 days ago",
    type: "prescription",
    action: "View",
  },
  {
    icon: Calendar,
    title: "Appointment Completed",
    description: "Video consultation with Dr. Johnson",
    time: "3 days ago",
    type: "completed",
    action: "Summary",
  },
]

const getActivityColor = (type: string) => {
  switch (type) {
    case "results":
      return "text-secondary"
    case "message":
      return "text-primary"
    case "appointment":
      return "text-chart-3"
    case "prescription":
      return "text-chart-4"
    default:
      return "text-muted-foreground"
  }
}

export function RecentActivity() {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Clock className="w-5 h-5" />
          Recent Activity
        </CardTitle>
        <CardDescription>Your latest healthcare interactions</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {activities.map((activity, index) => (
          <div key={index} className="flex items-start gap-4 p-3 rounded-lg hover:bg-accent/50 transition-colors">
            <div
              className={`w-10 h-10 rounded-lg bg-accent/20 flex items-center justify-center ${getActivityColor(activity.type)}`}
            >
              <activity.icon className="w-5 h-5" />
            </div>

            <div className="flex-1 space-y-1">
              <div className="font-medium text-sm">{activity.title}</div>
              <div className="text-sm text-muted-foreground">{activity.description}</div>
              <div className="text-xs text-muted-foreground">{activity.time}</div>
            </div>

            <Badge variant="outline" className="text-xs">
              {activity.action}
            </Badge>
          </div>
        ))}
      </CardContent>
    </Card>
  )
}
