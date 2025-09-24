"use client";

import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { Badge } from "@/components/ui/badge";
import { useState } from "react";

const demoAppointments = [
  {
    id: 1,
    doctorName: "Dr. Sameer Verma",
    specialty: "Cardiologist",
    date: "2025-09-25",
    time: "10:00 AM",
    status: "upcoming",
  },
  {
    id: 2,
    doctorName: "Dr. Mitesh Patel",
    specialty: "Dermatologist",
    date: "2025-09-26",
    time: "2:30 PM",
    status: "upcoming",
  },
  {
    id: 3,
    doctorName: "Dr. Rishab Kumar",
    specialty: "Neurologist",
    date: "2025-09-24",
    time: "11:15 AM",
    status: "completed",
  },
];

export default function AppointmentsPage() {
  const [date, setDate] = useState<Date | undefined>(new Date());

  return (
    <div className="container mx-auto p-6">
      <h1 className="text-3xl font-bold mb-6">My Appointments</h1>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Calendar Section */}
        <Card className="p-4">
          <h2 className="text-xl font-semibold mb-4">Calendar</h2>
          <Calendar
            mode="single"
            selected={date}
            onSelect={setDate}
            className="rounded-md border"
          />
        </Card>

        {/* Appointments List */}
        <div className="md:col-span-2">
          <h2 className="text-xl font-semibold mb-4">Upcoming Appointments</h2>
          <div className="space-y-4">
            {demoAppointments.map((appointment) => (
              <Card key={appointment.id} className="p-4">
                <div className="flex justify-between items-start">
                  <div>
                    <h3 className="font-semibold">{appointment.doctorName}</h3>
                    <p className="text-sm text-gray-600">
                      {appointment.specialty}
                    </p>
                    <p className="text-sm mt-2">
                      {appointment.date} at {appointment.time}
                    </p>
                  </div>
                  <div className="flex flex-col gap-2">
                    <Badge
                      variant={
                        appointment.status === "upcoming"
                          ? "default"
                          : "secondary"
                      }
                    >
                      {appointment.status}
                    </Badge>
                    {appointment.status === "upcoming" && (
                      <>
                        <Button size="sm" variant="outline">
                          Reschedule
                        </Button>
                        <Button size="sm" variant="destructive">
                          Cancel
                        </Button>
                      </>
                    )}
                  </div>
                </div>
              </Card>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
