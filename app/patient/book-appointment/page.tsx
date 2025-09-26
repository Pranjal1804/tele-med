"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useSession } from "@/hooks/use-session";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Loader2, Stethoscope } from "lucide-react";
import { DashboardHeader } from "@/components/patient/dashboard-header";
import { useToast } from "@/components/ui/use-toast";

interface Doctor {
  _id: string;
  name: string;
  specialty: string;
}

export default function BookAppointmentPage() {
  const { token, isLoading: isSessionLoading } = useSession();
  const router = useRouter();
  const { toast } = useToast();
  const [doctors, setDoctors] = useState<Doctor[]>([]);
  const [isFetchingDoctors, setIsFetchingDoctors] = useState(true);
  const [isBooking, setIsBooking] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    // Don't do anything until the session has been checked
    if (isSessionLoading) {
      return;
    }

    // If session is loaded and there's no token, redirect to login
    if (!token) {
      router.push("/login");
      return;
    }

    // Now that we have a token, fetch the doctors
    const fetchDoctors = async () => {
      setIsFetchingDoctors(true);
      try {
        const backendUrl = process.env.NEXT_PUBLIC_SOCKET_URL || "http://localhost:5000";
        const response = await fetch(`${backendUrl}/api/doctors`, {
          headers: { 'Authorization': `Bearer ${token}` },
        });
        if (!response.ok) throw new Error("Failed to fetch doctors.");
        const data = await response.json();
        setDoctors(data.doctors);
      } catch (err: any) {
        setError(err.message);
      } finally {
        setIsFetchingDoctors(false);
      }
    };

    fetchDoctors();
  }, [token, isSessionLoading, router]);

  const handleRequestAppointment = async (doctorId: string) => {
    setIsBooking(doctorId);
    setError(null);
    try {
      const backendUrl = process.env.NEXT_PUBLIC_SOCKET_URL || "http://localhost:5000";
      const response = await fetch(`${backendUrl}/api/consultations/request`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify({ doctorId }),
      });
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Failed to request appointment.");
      }
      toast({ title: "Success", description: "Appointment requested. You will be notified upon confirmation." });
      router.push("/patient/dashboard");
    } catch (err: any) {
      setError(err.message);
    } finally {
      setIsBooking(null);
    }
  };

  // Show a loading spinner if the session is loading OR if we are fetching doctors
  if (isSessionLoading || isFetchingDoctors) {
    return (
      <div className="flex h-screen w-full items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <DashboardHeader />
      <main className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          <CardHeader className="px-0">
            <CardTitle className="text-3xl font-bold">Book a Consultation</CardTitle>
            <CardDescription>Find a doctor and request an instant consultation.</CardDescription>
          </CardHeader>
          {error && <p className="text-destructive text-center mb-4">{error}</p>}
          <div className="space-y-4">
            {doctors.length > 0 ? doctors.map((doctor) => (
              <Card key={doctor._id}>
                <CardContent className="p-4 flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <Avatar className="h-12 w-12"><AvatarImage src="/doctor-consultation.jpg" /><AvatarFallback>{doctor.name.charAt(0)}</AvatarFallback></Avatar>
                    <div>
                      <p className="font-semibold text-lg">{doctor.name}</p>
                      <p className="text-sm text-muted-foreground flex items-center gap-2"><Stethoscope className="w-4 h-4" />{doctor.specialty}</p>
                    </div>
                  </div>
                  <Button onClick={() => handleRequestAppointment(doctor._id)} disabled={isBooking === doctor._id}>
                    {isBooking === doctor._id && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                    Request Call
                  </Button>
                </CardContent>
              </Card>
            )) : (
              <p className="text-center text-muted-foreground py-10">No doctors are available at the moment.</p>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}