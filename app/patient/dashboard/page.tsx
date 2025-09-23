import { DashboardHeader } from "@/components/patient/dashboard-header"
import { QuickActions } from "@/components/patient/quick-actions"
import { UpcomingAppointments } from "@/components/patient/upcoming-appointments"
import { HealthSummary } from "@/components/patient/health-summary"
import { RecentActivity } from "@/components/patient/recent-activity"

export default function PatientDashboard() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-accent/5 to-secondary/5">
      <DashboardHeader />

      <main className="container mx-auto px-4 py-8">
        <div className="space-y-8">
          {/* Welcome Section */}
          <div className="space-y-2">
            <h1 className="text-3xl font-bold text-balance">Welcome back, John!</h1>
            <p className="text-muted-foreground">Here's an overview of your health and upcoming appointments.</p>
          </div>

          {/* Quick Actions */}
          <QuickActions />

          {/* Main Content Grid */}
          <div className="grid lg:grid-cols-3 gap-8">
            {/* Left Column */}
            <div className="lg:col-span-2 space-y-8">
              <UpcomingAppointments />
              <RecentActivity />
            </div>

            {/* Right Column */}
            <div className="space-y-8">
              <HealthSummary />
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}
