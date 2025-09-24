import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { Clock, Users, AlertCircle, Video } from "lucide-react"
import Link from "next/link"

const waitingPatients = [
  {
    id: 1,
    name: "Amit Kumar",
    avatar: "/patient-alice.jpg",
    waitTime: "5 min",
    reason: "Urgent consultation",
    priority: "urgent",
  },
  {
    id: 2,
    name: "Arjun Patel",
    avatar: "/patient-michael.jpg",
    waitTime: "12 min",
    reason: "Follow-up appointment",
    priority: "normal",
  },
  {
    id: 3,
    name: "Krish Saxena",
    avatar: "/patient-sarah.jpg",
    waitTime: "8 min",
    reason: "Prescription refill",
    priority: "normal",
  },
]

export function PatientQueue() {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Users className="w-5 h-5" />
          Patient Queue
        </CardTitle>
        <CardDescription>Patients waiting for consultation</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {waitingPatients.length > 0 ? (
          <>
            {waitingPatients.map((patient) => (
              <div key={patient.id} className="flex items-center justify-between p-3 rounded-lg border bg-card/50">
                <div className="flex items-center gap-3">
                  <Avatar className="h-10 w-10">
                    <AvatarImage src={patient.avatar || "/placeholder.svg"} alt={patient.name} />
                    <AvatarFallback>
                      {patient.name
                        .split(" ")
                        .map((n) => n[0])
                        .join("")}
                    </AvatarFallback>
                  </Avatar>

                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <span className="font-medium text-sm">{patient.name}</span>
                      {patient.priority === "urgent" && <AlertCircle className="w-4 h-4 text-destructive" />}
                    </div>
                    <div className="text-xs text-muted-foreground">{patient.reason}</div>
                    <div className="flex items-center gap-1 text-xs text-muted-foreground">
                      <Clock className="w-3 h-3" />
                      Waiting {patient.waitTime}
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <Badge variant={patient.priority === "urgent" ? "destructive" : "secondary"} className="text-xs">
                    {patient.priority}
                  </Badge>
                  <Button size="sm" asChild>
                    <Link href="/consultation/room">
                      <Video className="w-4 h-4" />
                    </Link>
                  </Button>
                </div>
              </div>
            ))}

            <div className="text-center pt-2">
              <Button variant="outline" className="w-full bg-transparent" asChild>
                <Link href="/doctor/queue">View All Waiting Patients</Link>
              </Button>
            </div>
          </>
        ) : (
          <div className="text-center py-8 text-muted-foreground">
            <Users className="w-12 h-12 mx-auto mb-4 opacity-50" />
            <p>No patients in queue</p>
          </div>
        )}
      </CardContent>
    </Card>
  )
}
