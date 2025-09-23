import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Video, MessageSquare, FileText, Calendar, Shield, Clock, Users, Bot, Mic, Camera } from "lucide-react"

const features = [
  {
    icon: Video,
    title: "HD Video Consultations",
    description: "Crystal-clear video calls with WebRTC technology for seamless doctor-patient interactions.",
    badge: "WebRTC Powered",
  },
  {
    icon: Bot,
    title: "AI Avatar Mode",
    description: "Text-to-Video avatars for enhanced privacy and accessibility during consultations.",
    badge: "AI Enhanced",
  },
  {
    icon: MessageSquare,
    title: "Real-time Chat",
    description: "Secure messaging with Speech-to-Text and Text-to-Speech integration for better communication.",
    badge: "STT/TTS",
  },
  {
    icon: Calendar,
    title: "Smart Scheduling",
    description: "Intelligent appointment booking system that adapts to both patient and doctor availability.",
    badge: "Smart AI",
  },
  {
    icon: FileText,
    title: "Digital Health Records",
    description: "Comprehensive patient history, prescriptions, and medical documents in one secure place.",
    badge: "HIPAA Secure",
  },
  {
    icon: Shield,
    title: "Enterprise Security",
    description: "End-to-end encryption, HIPAA compliance, and advanced security protocols.",
    badge: "Bank-grade",
  },
]

export function FeaturesSection() {
  return (
    <section className="py-24 bg-gradient-to-b from-background to-accent/5">
      <div className="container mx-auto px-4">
        <div className="text-center space-y-4 mb-16">
          <Badge variant="outline" className="w-fit mx-auto">
            <Users className="w-3 h-3 mr-1" />
            Trusted by Healthcare Professionals
          </Badge>

          <h2 className="text-3xl md:text-5xl font-bold text-balance">
            Everything You Need for <span className="text-primary">Modern Healthcare</span>
          </h2>

          <p className="text-xl text-muted-foreground text-pretty max-w-3xl mx-auto">
            Our comprehensive telemedicine platform combines cutting-edge technology with intuitive design to deliver
            exceptional healthcare experiences.
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((feature, index) => (
            <Card
              key={index}
              className="group hover:shadow-xl transition-all duration-300 border-0 bg-card/50 backdrop-blur-sm hover:bg-card/80"
            >
              <CardHeader className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="w-12 h-12 bg-primary/10 rounded-xl flex items-center justify-center group-hover:bg-primary/20 transition-colors">
                    <feature.icon className="w-6 h-6 text-primary" />
                  </div>
                  <Badge variant="secondary" className="text-xs">
                    {feature.badge}
                  </Badge>
                </div>
                <CardTitle className="text-xl">{feature.title}</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription className="text-base leading-relaxed">{feature.description}</CardDescription>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Technology Stack */}
        <div className="mt-20 text-center">
          <h3 className="text-2xl font-bold mb-8">Built with Modern Technology</h3>
          <div className="flex flex-wrap justify-center items-center gap-8 opacity-60">
            <div className="flex items-center gap-2">
              <Camera className="w-5 h-5" />
              <span className="font-medium">WebRTC</span>
            </div>
            <div className="flex items-center gap-2">
              <Bot className="w-5 h-5" />
              <span className="font-medium">AI/ML</span>
            </div>
            <div className="flex items-center gap-2">
              <Mic className="w-5 h-5" />
              <span className="font-medium">Speech AI</span>
            </div>
            <div className="flex items-center gap-2">
              <Shield className="w-5 h-5" />
              <span className="font-medium">HIPAA</span>
            </div>
            <div className="flex items-center gap-2">
              <Clock className="w-5 h-5" />
              <span className="font-medium">Real-time</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
