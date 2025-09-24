"use client";

import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { Badge } from "@/components/ui/badge";
import { useState } from "react";

const demoSchedule = [
  {
    id: 1,
    patientName: "Jay Sharma",
    age: 45,
    appointmentType: "Follow-up",
    time: "09:00 AM",
    duration: "30 mins",
    status: "confirmed",
  },
  {
    id: 2,
    patientName: "Sonam Patel",
    age: 32,
    appointmentType: "New Patient",
    time: "10:00 AM",
    duration: "45 mins",
    status: "confirmed",
  },
  {
    id: 3,
    patientName: "Amit Mehta",
    age: 58,
    appointmentType: "Consultation",
    time: "11:30 AM",
    duration: "30 mins",
    status: "pending",
  },
  {
    id: 4,
    patientName: "Arjun Kumar",
    age: 28,
    appointmentType: "Follow-up",
    time: "02:00 PM",
    duration: "30 mins",
    status: "confirmed",
  },
];

export default function DoctorSchedulePage() {
  const [date, setDate] = useState<Date | undefined>(new Date());

  return (
    <div className="container mx-auto p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">My Schedule</h1>
        <Button variant="default">+ Add Appointment</Button>
      </div>

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
          <div className="mt-4">
            <h3 className="font-semibold mb-2">Schedule Summary</h3>
            <div className="text-sm space-y-1">
              <p>Total Appointments: {demoSchedule.length}</p>
              <p>Available Slots: 3</p>
              <p>Hours: 9:00 AM - 5:00 PM</p>
            </div>
          </div>
        </Card>

        {/* Schedule List */}
        <div className="md:col-span-2">
          <Card className="p-4">
            <h2 className="text-xl font-semibold mb-4">Today's Appointments</h2>
            <div className="space-y-4">
              {demoSchedule.map((appointment) => (
                <Card key={appointment.id} className="p-4 border">
                  <div className="flex justify-between items-start">
                    <div>
                      <div className="flex items-center gap-2">
                        <h3 className="font-semibold">
                          {appointment.patientName}
                        </h3>
                        <span className="text-sm text-gray-500">
                          ({appointment.age} years)
                        </span>
                      </div>
                      <p className="text-sm text-gray-600">
                        {appointment.appointmentType}
                      </p>
                      <p className="text-sm mt-1">
                        {appointment.time} • {appointment.duration}
                      </p>
                    </div>
                    <div className="flex flex-col items-end gap-2">
                      <Badge
                        variant={
                          appointment.status === "confirmed"
                            ? "default"
                            : "secondary"
                        }
                      >
                        {appointment.status}
                      </Badge>
                      <div className="flex gap-2">
                        <Button size="sm" variant="outline">
                          Reschedule
                        </Button>
                        <Button size="sm" variant="destructive">
                          Cancel
                        </Button>
                      </div>
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
}
