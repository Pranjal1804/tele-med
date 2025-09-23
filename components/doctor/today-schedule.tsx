import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Calendar, Clock, Video, MessageSquare, FileText, Phone } from "lucide-react"
import Link from "next/link"

const todayAppointments = [
  {
    id: 1,
    patient: {
      name: "John Doe",
      age: 45,
      avatar: "/patient-john.jpg",
      condition: "Hypertension follow-up",
    },
    time: "9:00 AM",
    duration: "30 min",
    type: "video",
    status: "upcoming",
    priority: "normal",
  },
  {
    id: 2,
    patient: {
      name: "Maria Garcia",
      age: 32,
      avatar: "/patient-maria.jpg",
      condition: "Annual checkup",
    },
    time: "9:45 AM",
    duration: "45 min",
    type: "video",
    status: "in-progress",
    priority: "normal",
  },
  {
    id: 3,
    patient: {
      name: "Robert Chen",
      age: 58,
      avatar: "/patient-robert.jpg",
      condition: "Chest pain consultation",
    },
    time: "10:30 AM",
    duration: "30 min",
    type: "video",
    status: "upcoming",
    priority: "urgent",
  },
  {
    id: 4,
    patient: {
      name: "Emily Wilson",
      age: 28,
      avatar: "/patient-emily.jpg",
      condition: "Lab results review",
    },
    time: "11:15 AM",
    duration: "15 min",
    type: "phone",
    status: "upcoming",
    priority: "normal",
  },
  {
    id: 5,
    patient: {
      name: "David Brown",
      age: 67,
      avatar: "/patient-david.jpg",
      condition: "Medication adjustment",
    },
    time: "2:00 PM",
    duration: "30 min",
    type: "video",
    status: "upcoming",
    priority: "normal",
  },
]

export function TodaySchedule() {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Calendar className="w-5 h-5" />
          Today's Schedule
        </CardTitle>
        <CardDescription>December 22, 2024 • 5 appointments</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {todayAppointments.map((appointment) => (
          <div
            key={appointment.id}
            className={`flex items-center justify-between p-4 rounded-lg border transition-colors ${
              appointment.status === "in-progress"
                ? "bg-secondary/10 border-secondary/20"
                : "bg-card/50 hover:bg-accent/50"
            }`}
          >
            <div className="flex items-center gap-4">
              <Avatar className="h-12 w-12">
                <AvatarImage src={appointment.patient.avatar || "/placeholder.svg"} alt={appointment.patient.name} />
                <AvatarFallback>
                  {appointment.patient.name
                    .split(" ")
                    .map((n) => n[0])
                    .join("")}
                </AvatarFallback>
              </Avatar>

              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <span className="font-medium">{appointment.patient.name}</span>
                  <span className="text-sm text-muted-foreground">({appointment.patient.age}y)</span>
                  {appointment.priority === "urgent" && (
                    <Badge variant="destructive" className="text-xs">
                      Urgent
                    </Badge>
                  )}
                </div>
                <div className="text-sm text-muted-foreground">{appointment.patient.condition}</div>
                <div className="flex items-center gap-4 text-sm text-muted-foreground">
                  <div className="flex items-center gap-1">
                    <Clock className="w-3 h-3" />
                    {appointment.time}
                  </div>
                  <div className="flex items-center gap-1">
                    {appointment.type === "video" ? <Video className="w-3 h-3" /> : <Phone className="w-3 h-3" />}
                    {appointment.duration}
                  </div>
                </div>
              </div>
            </div>

            <div className="flex items-center gap-2">
              {appointment.status === "in-progress" ? (
                <Badge className="bg-secondary text-secondary-foreground">In Progress</Badge>
              ) : (
                <Badge variant="outline">Scheduled</Badge>
              )}

              <div className="flex gap-2">
                {appointment.status === "in-progress" ? (
                  <Button size="sm" className="bg-secondary hover:bg-secondary/90" asChild>
                    <Link href="/consultation/room">
                      <Video className="w-4 h-4 mr-1" />
                      Resume
                    </Link>
                  </Button>
                ) : (
                  <Button size="sm" variant="outline" asChild>
                    <Link href="/consultation/room">
                      <Video className="w-4 h-4 mr-1" />
                      Start
                    </Link>
                  </Button>
                )}

                <Button size="sm" variant="ghost">
                  <FileText className="w-4 h-4" />
                </Button>
                <Button size="sm" variant="ghost">
                  <MessageSquare className="w-4 h-4" />
                </Button>
              </div>
            </div>
          </div>
        ))}

        <Button variant="outline" className="w-full bg-transparent" asChild>
          <Link href="/doctor/schedule">View Full Schedule</Link>
        </Button>
      </CardContent>
    </Card>
  )
}
