"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Video, Loader2, Check } from "lucide-react"
import Link from "next/link"
import { useSession } from "@/hooks/use-session"
import { useToast } from "@/components/ui/use-toast"

interface Appointment {
  _id: string;
  roomId: string;
  patientId: {
    _id: string;
    name: string;
  };
  startTime: string;
  status: 'pending' | 'confirmed' | 'active';
}

export function TodaySchedule() {
  const { token } = useSession();
  const { toast } = useToast();
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchSchedule = async () => {
    if (!token) return;
    setIsLoading(true);
    try {
      const backendUrl = process.env.NEXT_PUBLIC_SOCKET_URL || "http://localhost:5000";
      const response = await fetch(`${backendUrl}/api/consultations`, {
        headers: { 'Authorization': `Bearer ${token}` },
      });
      if (!response.ok) throw new Error('Failed to fetch schedule');
      const data = await response.json();
      const activeAppointments = data.consultations.filter(
        (appt: Appointment) => appt.status === 'pending' || appt.status === 'confirmed' || appt.status === 'active'
      );
      setAppointments(activeAppointments);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (token) {
      fetchSchedule();
    } else {
      setIsLoading(false);
    }
  }, [token]);

  const handleAccept = async (appointmentId: string) => {
    try {
      const backendUrl = process.env.NEXT_PUBLIC_SOCKET_URL || "http://localhost:5000";
      const response = await fetch(`${backendUrl}/api/consultations/accept/${appointmentId}`, {
        method: 'PATCH',
        headers: { 'Authorization': `Bearer ${token}` },
      });
      if (!response.ok) throw new Error('Failed to accept appointment');
      
      toast({ title: "Success", description: "Appointment confirmed." });
      // Refresh the list after accepting
      fetchSchedule();
    } catch (err: any) {
      setError(err.message);
      toast({ variant: "destructive", title: "Error", description: err.message });
    }
  };

  const pending = appointments.filter(a => a.status === 'pending');
  const confirmed = appointments.filter(a => a.status === 'confirmed' || a.status === 'active');

  return (
    <Card>
      <CardHeader>
        <CardTitle>Today's Appointments</CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        {isLoading && <div className="flex justify-center items-center p-4"><Loader2 className="animate-spin" /></div>}
        {error && <p className="text-destructive text-center">{error}</p>}
        
        {/* Pending Requests */}
        <div>
          <h3 className="font-semibold mb-2">Pending Requests</h3>
          {!isLoading && pending.length === 0 && <p className="text-muted-foreground text-sm">No pending requests.</p>}
          <div className="space-y-2">
            {pending.map((appt) => (
              <div key={appt._id} className="flex items-center justify-between p-2 rounded-lg bg-amber-500/10">
                <div className="flex items-center gap-4">
                  <Avatar><AvatarImage src={"/patient-consultation.jpg"} /><AvatarFallback>{appt.patientId.name.charAt(0)}</AvatarFallback></Avatar>
                  <div>
                    <p className="font-semibold">{appt.patientId.name}</p>
                    <p className="text-sm text-muted-foreground">Requested at {new Date(appt.startTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</p>
                  </div>
                </div>
                <Button size="sm" onClick={() => handleAccept(appt._id)}><Check className="mr-2 h-4 w-4" /> Accept</Button>
              </div>
            ))}
          </div>
        </div>

        {/* Confirmed Appointments */}
        <div>
          <h3 className="font-semibold mb-2">Confirmed Calls</h3>
          {!isLoading && confirmed.length === 0 && <p className="text-muted-foreground text-sm">No confirmed calls.</p>}
          <div className="space-y-2">
            {confirmed.map((appt) => (
              <div key={appt._id} className="flex items-center justify-between p-2 rounded-lg hover:bg-accent">
                <div className="flex items-center gap-4">
                  <Avatar><AvatarImage src={"/patient-consultation.jpg"} /><AvatarFallback>{appt.patientId.name.charAt(0)}</AvatarFallback></Avatar>
                  <div>
                    <p className="font-semibold">{appt.patientId.name}</p>
                    <p className="text-sm text-muted-foreground">Confirmed at {new Date(appt.startTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</p>
                  </div>
                </div>
                <Button asChild><Link href={`/consultation/room?roomId=${appt.roomId}`}><Video className="mr-2 h-4 w-4" /> Join Call</Link></Button>
              </div>
            ))}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
