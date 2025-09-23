import { DoctorDashboardHeader } from "@/components/doctor/dashboard-header"
import { StatsOverview } from "@/components/doctor/stats-overview"
import { TodaySchedule } from "@/components/doctor/today-schedule"
import { PatientQueue } from "@/components/doctor/patient-queue"
import { RecentPatients } from "@/components/doctor/recent-patients"

export default function DoctorDashboard() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-accent/5 to-secondary/5">
      <DoctorDashboardHeader />

      <main className="container mx-auto px-4 py-8">
        <div className="space-y-8">
          {/* Welcome Section */}
          <div className="space-y-2">
            <h1 className="text-3xl font-bold text-balance">Good morning, Dr. Johnson!</h1>
            <p className="text-muted-foreground">You have 5 appointments today and 3 patients waiting in the queue.</p>
          </div>

          {/* Stats Overview */}
          <StatsOverview />

          {/* Main Content Grid */}
          <div className="grid lg:grid-cols-3 gap-8">
            {/* Left Column */}
            <div className="lg:col-span-2 space-y-8">
              <TodaySchedule />
              <RecentPatients />
            </div>

            {/* Right Column */}
            <div className="space-y-8">
              <PatientQueue />
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}
