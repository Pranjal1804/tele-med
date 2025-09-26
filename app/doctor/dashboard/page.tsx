"use client"

import { useEffect } from "react"
import { DoctorDashboardHeader } from "@/components/doctor/dashboard-header"
import { StatsOverview } from "@/components/doctor/stats-overview"
import { TodaySchedule } from "@/components/doctor/today-schedule"
import { RecentPatients } from "@/components/doctor/recent-patients"
import { useSession } from "@/hooks/use-session"
import { useRouter } from "next/navigation"
import { Loader2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { authClient } from "@/lib/auth-client"

export default function DoctorDashboardPage() {
  const { user, isLoading } = useSession()
  const router = useRouter()

  useEffect(() => {
    if (!isLoading && (!user || user.userType !== 'doctor')) {
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
      <DoctorDashboardHeader />
      <main className="container mx-auto px-4 py-8">
        <div className="space-y-8">
          <div className="flex justify-between items-start">
            <div className="space-y-2">
              <h1 className="text-3xl font-bold text-balance">Welcome back, {user?.name}!</h1>
              <p className="text-muted-foreground">Here's your dashboard overview for today.</p>
            </div>
            <Button variant="outline" onClick={handleLogout}>Logout</Button>
          </div>
          
          <StatsOverview />

          <div className="grid lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2 space-y-8">
              <TodaySchedule />
            </div>
            <div className="space-y-8">
              <RecentPatients />
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}