"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import {
  FileText,
  User,
  Clock,
  Heart,
  Activity,
  Thermometer,
  Weight,
  Pill,
  AlertTriangle,
  Save,
  Download,
} from "lucide-react"

interface ConsultationSidebarProps {
  isDoctor?: boolean
}

export function ConsultationSidebar({ isDoctor = false }: ConsultationSidebarProps) {
  const [notes, setNotes] = useState("")
  const [diagnosis, setDiagnosis] = useState("")
  const [prescription, setPrescription] = useState("")

  const patientInfo = {
    name: "John Doe",
    age: 45,
    gender: "Male",
    bloodType: "O+",
    allergies: ["Penicillin", "Shellfish"],
    conditions: ["Hypertension", "Type 2 Diabetes"],
  }

  const vitals = [
    { icon: Heart, label: "Blood Pressure", value: "140/90", status: "high", color: "text-destructive" },
    { icon: Activity, label: "Heart Rate", value: "78 bpm", status: "normal", color: "text-secondary" },
    { icon: Thermometer, label: "Temperature", value: "98.6°F", status: "normal", color: "text-primary" },
    { icon: Weight, label: "Weight", value: "185 lbs", status: "normal", color: "text-chart-3" },
  ]

  const medications = [
    { name: "Lisinopril", dosage: "10mg", frequency: "Once daily", purpose: "Blood pressure" },
    { name: "Metformin", dosage: "500mg", frequency: "Twice daily", purpose: "Diabetes" },
    { name: "Aspirin", dosage: "81mg", frequency: "Once daily", purpose: "Heart health" },
  ]

  const saveNotes = () => {
    // Save consultation notes
    console.log("Saving notes:", { notes, diagnosis, prescription })
  }

  return (
    <Card className="h-full">
      <CardHeader className="pb-3">
        <CardTitle className="text-lg">Consultation Details</CardTitle>
        <CardDescription>Patient information and consultation notes</CardDescription>
      </CardHeader>

      <CardContent className="p-0 flex-1">
        <Tabs defaultValue="patient" className="h-full flex flex-col">
          <TabsList className="grid w-full grid-cols-3 mx-4">
            <TabsTrigger value="patient" className="text-xs">
              <User className="w-3 h-3 mr-1" />
              Patient
            </TabsTrigger>
            <TabsTrigger value="vitals" className="text-xs">
              <Activity className="w-3 h-3 mr-1" />
              Vitals
            </TabsTrigger>
            <TabsTrigger value="notes" className="text-xs">
              <FileText className="w-3 h-3 mr-1" />
              Notes
            </TabsTrigger>
          </TabsList>

          <div className="flex-1 px-4">
            <TabsContent value="patient" className="mt-4 space-y-4">
              <ScrollArea className="h-[400px]">
                <div className="space-y-4">
                  {/* Patient Info */}
                  <div className="space-y-3">
                    <h4 className="font-medium text-sm">Patient Information</h4>
                    <div className="grid grid-cols-2 gap-2 text-sm">
                      <div>
                        <span className="text-muted-foreground">Name:</span>
                        <div className="font-medium">{patientInfo.name}</div>
                      </div>
                      <div>
                        <span className="text-muted-foreground">Age:</span>
                        <div className="font-medium">{patientInfo.age}</div>
                      </div>
                      <div>
                        <span className="text-muted-foreground">Gender:</span>
                        <div className="font-medium">{patientInfo.gender}</div>
                      </div>
                      <div>
                        <span className="text-muted-foreground">Blood Type:</span>
                        <div className="font-medium">{patientInfo.bloodType}</div>
                      </div>
                    </div>
                  </div>

                  {/* Allergies */}
                  <div className="space-y-2">
                    <h4 className="font-medium text-sm flex items-center gap-2">
                      <AlertTriangle className="w-4 h-4 text-destructive" />
                      Allergies
                    </h4>
                    <div className="flex flex-wrap gap-2">
                      {patientInfo.allergies.map((allergy, index) => (
                        <Badge key={index} variant="destructive" className="text-xs">
                          {allergy}
                        </Badge>
                      ))}
                    </div>
                  </div>

                  {/* Current Conditions */}
                  <div className="space-y-2">
                    <h4 className="font-medium text-sm">Current Conditions</h4>
                    <div className="space-y-2">
                      {patientInfo.conditions.map((condition, index) => (
                        <div key={index} className="flex items-center gap-2 text-sm">
                          <div className="w-2 h-2 bg-chart-4 rounded-full" />
                          {condition}
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Current Medications */}
                  <div className="space-y-2">
                    <h4 className="font-medium text-sm flex items-center gap-2">
                      <Pill className="w-4 h-4" />
                      Current Medications
                    </h4>
                    <div className="space-y-3">
                      {medications.map((med, index) => (
                        <div key={index} className="p-3 bg-muted/50 rounded-lg text-sm">
                          <div className="font-medium">{med.name}</div>
                          <div className="text-muted-foreground text-xs">
                            {med.dosage} • {med.frequency}
                          </div>
                          <div className="text-muted-foreground text-xs">{med.purpose}</div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </ScrollArea>
            </TabsContent>

            <TabsContent value="vitals" className="mt-4 space-y-4">
              <ScrollArea className="h-[400px]">
                <div className="space-y-4">
                  <h4 className="font-medium text-sm">Current Vitals</h4>
                  <div className="space-y-3">
                    {vitals.map((vital, index) => (
                      <div key={index} className="flex items-center justify-between p-3 bg-muted/50 rounded-lg">
                        <div className="flex items-center gap-3">
                          <div
                            className={`w-8 h-8 rounded-lg bg-accent/20 flex items-center justify-center ${vital.color}`}
                          >
                            <vital.icon className="w-4 h-4" />
                          </div>
                          <div>
                            <div className="font-medium text-sm">{vital.label}</div>
                            <div className="text-xs text-muted-foreground">Latest reading</div>
                          </div>
                        </div>
                        <div className="text-right">
                          <div className="font-medium text-sm">{vital.value}</div>
                          <Badge variant={vital.status === "normal" ? "secondary" : "destructive"} className="text-xs">
                            {vital.status}
                          </Badge>
                        </div>
                      </div>
                    ))}
                  </div>

                  <div className="text-xs text-muted-foreground">
                    <Clock className="w-3 h-3 inline mr-1" />
                    Last updated: 10 minutes ago
                  </div>
                </div>
              </ScrollArea>
            </TabsContent>

            <TabsContent value="notes" className="mt-4 space-y-4">
              <ScrollArea className="h-[400px]">
                <div className="space-y-4">
                  {isDoctor && (
                    <>
                      {/* Consultation Notes */}
                      <div className="space-y-2">
                        <Label htmlFor="notes" className="text-sm font-medium">
                          Consultation Notes
                        </Label>
                        <Textarea
                          id="notes"
                          placeholder="Enter your consultation notes here..."
                          value={notes}
                          onChange={(e) => setNotes(e.target.value)}
                          className="min-h-[100px] text-sm"
                        />
                      </div>

                      {/* Diagnosis */}
                      <div className="space-y-2">
                        <Label htmlFor="diagnosis" className="text-sm font-medium">
                          Diagnosis
                        </Label>
                        <Textarea
                          id="diagnosis"
                          placeholder="Enter diagnosis..."
                          value={diagnosis}
                          onChange={(e) => setDiagnosis(e.target.value)}
                          className="min-h-[80px] text-sm"
                        />
                      </div>

                      {/* Prescription */}
                      <div className="space-y-2">
                        <Label htmlFor="prescription" className="text-sm font-medium">
                          Prescription
                        </Label>
                        <Textarea
                          id="prescription"
                          placeholder="Enter prescription details..."
                          value={prescription}
                          onChange={(e) => setPrescription(e.target.value)}
                          className="min-h-[80px] text-sm"
                        />
                      </div>

                      {/* Action Buttons */}
                      <div className="flex gap-2">
                        <Button size="sm" onClick={saveNotes} className="flex-1">
                          <Save className="w-3 h-3 mr-1" />
                          Save
                        </Button>
                        <Button size="sm" variant="outline">
                          <Download className="w-3 h-3 mr-1" />
                          Export
                        </Button>
                      </div>
                    </>
                  )}

                  {!isDoctor && (
                    <div className="text-center py-8 text-muted-foreground">
                      <FileText className="w-12 h-12 mx-auto mb-4 opacity-50" />
                      <p className="text-sm">Consultation notes will appear here after the session</p>
                    </div>
                  )}
                </div>
              </ScrollArea>
            </TabsContent>
          </div>
        </Tabs>
      </CardContent>
    </Card>
  )
}
