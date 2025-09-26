"use client"

import { useEffect } from "react"
import { DashboardHeader } from "@/components/patient/dashboard-header"
import { QuickActions } from "@/components/patient/quick-actions"
import { HealthSummary } from "@/components/patient/health-summary"
import { RecentActivity } from "@/components/patient/recent-activity"
import { UpcomingAppointments } from "@/components/patient/upcoming-appointments"
import { useSession } from "@/hooks/use-session"
import { authClient } from "@/lib/auth-client"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Loader2 } from "lucide-react"

export default function PatientDashboard() {
  const { user, isLoading } = useSession()
  const router = useRouter()

  useEffect(() => {
    if (!isLoading && !user) {
      router.push("/login")
    }
  }, [isLoading, user, router])

  const handleLogout = async () => {
    await authClient.signOut()
    router.push("/login")
  }

  if (isLoading || !user) {
    return (
      <div className="flex h-screen items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-accent/5 to-secondary/5">
      <DashboardHeader />

      <main className="container mx-auto px-4 py-8">
        <div className="space-y-8">
          <div className="flex justify-between items-start">
            <div className="space-y-2">
              <h1 className="text-3xl font-bold text-balance">Welcome back, {user?.name}!</h1>
              <p className="text-muted-foreground">Here's an overview of your health and upcoming appointments.</p>
            </div>
            <Button variant="outline" onClick={handleLogout}>Logout</Button>
          </div>

          <QuickActions />

          <div className="grid lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2 space-y-8">
              <UpcomingAppointments />
              <RecentActivity />
            </div>

            <div className="space-y-8">
              <HealthSummary />
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}
