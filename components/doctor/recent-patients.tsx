import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { FileText, MessageSquare, Clock, Users } from "lucide-react"

const recentPatients = [
  {
    id: 1,
    name: "Jay Patel",
    age: 45,
    avatar: "/patient-john.jpg",
    lastVisit: "2 hours ago",
    condition: "Hypertension",
    status: "stable",
    notes: "Blood pressure improved, continue medication",
  },
  {
    id: 2,
    name: "Arjun Kumar",
    age: 32,
    avatar: "/patient-maria.jpg",
    lastVisit: "1 day ago",
    condition: "Annual checkup",
    status: "healthy",
    notes: "All vitals normal, scheduled follow-up in 6 months",
  },
  {
    id: 3,
    name: "Raj Patel",
    age: 58,
    avatar: "/patient-robert.jpg",
    lastVisit: "3 days ago",
    condition: "Chest pain",
    status: "monitoring",
    notes: "EKG normal, stress test scheduled",
  },
  {
    id: 4,
    name: "Khushi Sharma",
    age: 28,
    avatar: "/patient-emily.jpg",
    lastVisit: "1 week ago",
    condition: "Migraine",
    status: "improved",
    notes: "New medication working well, reduced frequency",
  },
]

const getStatusColor = (status: string) => {
  switch (status) {
    case "stable":
      return "bg-secondary/20 text-secondary"
    case "healthy":
      return "bg-chart-3/20 text-chart-3"
    case "monitoring":
      return "bg-chart-4/20 text-chart-4"
    case "improved":
      return "bg-primary/20 text-primary"
    default:
      return "bg-muted text-muted-foreground"
  }
}

export function RecentPatients() {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Users className="w-5 h-5" />
          Recent Patients
        </CardTitle>
        <CardDescription>Your latest patient interactions</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {recentPatients.map((patient) => (
          <div
            key={patient.id}
            className="flex items-start gap-4 p-4 rounded-lg border bg-card/50 hover:bg-accent/50 transition-colors"
          >
            <Avatar className="h-12 w-12">
              <AvatarImage src={patient.avatar || "/placeholder.svg"} alt={patient.name} />
              <AvatarFallback>
                {patient.name
                  .split(" ")
                  .map((n) => n[0])
                  .join("")}
              </AvatarFallback>
            </Avatar>

            <div className="flex-1 space-y-2">
              <div className="flex items-center justify-between">
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="font-medium">{patient.name}</span>
                    <span className="text-sm text-muted-foreground">({patient.age}y)</span>
                  </div>
                  <div className="text-sm text-muted-foreground">{patient.condition}</div>
                </div>

                <div className="flex items-center gap-2">
                  <Badge className={`text-xs ${getStatusColor(patient.status)}`}>{patient.status}</Badge>
                  <div className="flex items-center gap-1 text-xs text-muted-foreground">
                    <Clock className="w-3 h-3" />
                    {patient.lastVisit}
                  </div>
                </div>
              </div>

              <p className="text-sm text-muted-foreground">{patient.notes}</p>

              <div className="flex gap-2">
                <Button size="sm" variant="outline" className="text-xs bg-transparent">
                  <FileText className="w-3 h-3 mr-1" />
                  Records
                </Button>
                <Button size="sm" variant="outline" className="text-xs bg-transparent">
                  <MessageSquare className="w-3 h-3 mr-1" />
                  Message
                </Button>
              </div>
            </div>
          </div>
        ))}

        <Button variant="outline" className="w-full bg-transparent">
          View All Patients
        </Button>
      </CardContent>
    </Card>
  )
}
