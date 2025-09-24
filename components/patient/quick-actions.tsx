import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Calendar, Video, MessageSquare, FileText, Plus } from "lucide-react"
import Link from "next/link"

const quickActions = [
  {
    icon: Calendar,
    title: "Book Appointment",
    description: "Schedule a consultation",
    href: "/patient/book-appointment",
    color: "bg-primary/10 text-primary",
  },
  {
    icon: Video,
    title: "Join Consultation",
    description: "Start video call",
    href: "/consultation/room",
    color: "bg-secondary/10 text-secondary",
  },
  {
    icon: MessageSquare,
    title: "Chat with Doctor",
    description: "Send a message",
    href: "/patient/messages",
    color: "bg-chart-3/10 text-chart-3",
  },
  {
    icon: FileText,
    title: "DiagBot",
    description: "AI Diagnosis",
    href: "/patient/chat",
    color: "bg-chart-4/10 text-chart-4",
  },
]

export function QuickActions() {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Plus className="w-5 h-5" />
          Quick Actions
        </CardTitle>
        <CardDescription>Common tasks and shortcuts</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          {quickActions.map((action, index) => (
            <Button
              key={index}
              variant="ghost"
              className="h-auto p-4 flex flex-col items-center gap-3 hover:bg-accent/50"
              asChild
            >
              <Link href={action.href}>
                <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${action.color}`}>
                  <action.icon className="w-6 h-6" />
                </div>
                <div className="text-center">
                  <div className="font-medium text-sm">{action.title}</div>
                  <div className="text-xs text-muted-foreground">{action.description}</div>
                </div>
              </Link>
            </Button>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}
