"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Video, Loader2, Clock } from "lucide-react"
import Link from "next/link"
import { useSession } from "@/hooks/use-session"
import { Badge } from "@/components/ui/badge"

interface Appointment {
  _id: string;
  roomId: string;
  doctorId: {
    _id: string;
    name: string;
    specialty: string;
  };
  startTime: string;
  status: 'pending' | 'confirmed' | 'active';
}

export function UpcomingAppointments() {
  const { token } = useSession();
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!token) {
      setIsLoading(false);
      return;
    }

    const fetchAppointments = async () => {
      try {
        const backendUrl = process.env.NEXT_PUBLIC_SOCKET_URL || "http://localhost:5000";
        const response = await fetch(`${backendUrl}/api/consultations`, {
          headers: { 'Authorization': `Bearer ${token}` },
        });
        if (!response.ok) throw new Error('Failed to fetch appointments');
        const data = await response.json();
        const upcoming = data.consultations.filter((appt: Appointment) => appt.status === 'pending' || appt.status === 'confirmed' || appt.status === 'active');
        setAppointments(upcoming);
      } catch (err: any) {
        setError(err.message);
      } finally {
        setIsLoading(false);
      }
    };

    fetchAppointments();
  }, [token]);

  return (
    <Card>
      <CardHeader>
        <CardTitle>Upcoming Appointments</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {isLoading && <div className="flex justify-center items-center p-4"><Loader2 className="animate-spin" /></div>}
        {error && <p className="text-destructive text-center">{error}</p>}
        {!isLoading && !error && appointments.length === 0 && (
          <p className="text-muted-foreground text-center">No upcoming appointments. <Link href="/patient/book-appointment" className="text-primary underline">Book one now</Link>.</p>
        )}
        {!isLoading && !error && appointments.map((appt) => (
          <div key={appt._id} className="flex items-center justify-between p-2 rounded-lg hover:bg-accent">
            <div className="flex items-center gap-4">
              <Avatar><AvatarImage src={"/doctor-consultation.jpg"} /><AvatarFallback>{appt.doctorId.name.charAt(0)}</AvatarFallback></Avatar>
              <div>
                <p className="font-semibold">{appt.doctorId.name}</p>
                <p className="text-sm text-muted-foreground">
                  {new Date(appt.startTime).toLocaleDateString()} - {new Date(appt.startTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                </p>
              </div>
            </div>
            {appt.status === 'confirmed' || appt.status === 'active' ? (
              <Button asChild>
                <Link href={`/consultation/room?roomId=${appt.roomId}`}>
                  <Video className="mr-2 h-4 w-4" />
                  Join Call
                </Link>
              </Button>
            ) : (
              <Badge variant="outline">
                <Clock className="mr-2 h-4 w-4" />
                Pending Approval
              </Badge>
            )}
          </div>
        ))}
      </CardContent>
    </Card>
  )
}