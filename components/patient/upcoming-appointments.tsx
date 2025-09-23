import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Calendar, Clock, Video, MessageSquare } from "lucide-react"
import Link from "next/link"

const appointments = [
  {
    id: 1,
    doctor: {
      name: "Dr. Sarah Johnson",
      specialty: "Cardiologist",
      avatar: "/doctor-sarah.jpg",
    },
    date: "Today",
    time: "2:30 PM",
    type: "Video Consultation",
    status: "confirmed",
  },
  {
    id: 2,
    doctor: {
      name: "Dr. Michael Chen",
      specialty: "General Practice",
      avatar: "/doctor-michael.jpg",
    },
    date: "Tomorrow",
    time: "10:00 AM",
    type: "Follow-up",
    status: "confirmed",
  },
  {
    id: 3,
    doctor: {
      name: "Dr. Emily Rodriguez",
      specialty: "Dermatologist",
      avatar: "/doctor-emily.jpg",
    },
    date: "Dec 28",
    time: "3:15 PM",
    type: "Consultation",
    status: "pending",
  },
]

export function UpcomingAppointments() {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Calendar className="w-5 h-5" />
          Upcoming Appointments
        </CardTitle>
        <CardDescription>Your scheduled consultations</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {appointments.map((appointment) => (
          <div key={appointment.id} className="flex items-center justify-between p-4 rounded-lg border bg-card/50">
            <div className="flex items-center gap-4">
              <Avatar className="h-12 w-12">
                <AvatarImage src={appointment.doctor.avatar || "/placeholder.svg"} alt={appointment.doctor.name} />
                <AvatarFallback>
                  {appointment.doctor.name
                    .split(" ")
                    .map((n) => n[0])
                    .join("")}
                </AvatarFallback>
              </Avatar>

              <div className="space-y-1">
                <div className="font-medium">{appointment.doctor.name}</div>
                <div className="text-sm text-muted-foreground">{appointment.doctor.specialty}</div>
                <div className="flex items-center gap-4 text-sm text-muted-foreground">
                  <div className="flex items-center gap-1">
                    <Calendar className="w-3 h-3" />
                    {appointment.date}
                  </div>
                  <div className="flex items-center gap-1">
                    <Clock className="w-3 h-3" />
                    {appointment.time}
                  </div>
                </div>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <Badge variant={appointment.status === "confirmed" ? "default" : "secondary"}>{appointment.status}</Badge>

              {appointment.status === "confirmed" && appointment.date === "Today" && (
                <div className="flex gap-2">
                  <Button size="sm" asChild>
                    <Link href="/consultation/room">
                      <Video className="w-4 h-4 mr-1" />
                      Join
                    </Link>
                  </Button>
                  <Button size="sm" variant="outline">
                    <MessageSquare className="w-4 h-4" />
                  </Button>
                </div>
              )}
            </div>
          </div>
        ))}

        <Button variant="outline" className="w-full bg-transparent" asChild>
          <Link href="/patient/appointments">View All Appointments</Link>
        </Button>
      </CardContent>
    </Card>
  )
}
