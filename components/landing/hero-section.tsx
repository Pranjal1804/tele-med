"use client"

import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { ArrowRight, Play, Shield, Clock, Users, Video, Stethoscope } from "lucide-react"
import Link from "next/link"

export function HeroSection() {
  return (
    <section className="relative min-h-screen flex items-center justify-center bg-gradient-to-br from-background via-accent/10 to-secondary/5 overflow-hidden">
      {/* Background Pattern */}
      <div className="absolute inset-0 bg-grid-pattern opacity-5" />

      <div className="container mx-auto px-4 py-20 relative z-10">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Left Content */}
          <div className="space-y-8">
            <div className="space-y-4">
              <Badge variant="secondary" className="w-fit">
                <Shield className="w-3 h-3 mr-1" />
                HIPAA Compliant Platform
              </Badge>

              <h1 className="text-4xl md:text-6xl font-bold text-balance leading-tight">
                Healthcare <span className="text-primary">Reimagined</span> for the Digital Age
              </h1>

              <p className="text-xl text-muted-foreground text-pretty max-w-2xl">
                Connect with certified healthcare professionals through secure video consultations, AI-powered
                diagnostics, and comprehensive patient management—all from the comfort of your home.
              </p>
            </div>

            <div className="flex flex-col sm:flex-row gap-4">
              <Button size="lg" className="text-lg px-8" asChild>
                <Link href="/signup">
                  Get Started Today
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Link>
              </Button>

              <Button size="lg" variant="outline" className="text-lg px-8 bg-transparent">
                <Play className="mr-2 h-5 w-5" />
                Watch Demo
              </Button>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-3 gap-8 pt-8 border-t border-border/50">
              <div className="text-center">
                <div className="text-2xl font-bold text-primary">50K+</div>
                <div className="text-sm text-muted-foreground">Patients Served</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-secondary">1,200+</div>
                <div className="text-sm text-muted-foreground">Certified Doctors</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-primary">24/7</div>
                <div className="text-sm text-muted-foreground">Support Available</div>
              </div>
            </div>
          </div>

          {/* Right Content - Dashboard Preview */}
          <div className="relative">
            <Card className="p-6 shadow-2xl bg-card/95 backdrop-blur-sm border-0">
              <div className="space-y-4">
                {/* Header */}
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-primary rounded-lg flex items-center justify-center">
                      <Stethoscope className="w-5 h-5 text-primary-foreground" />
                    </div>
                    <div>
                      <h3 className="font-semibold">Dr. Sarah Johnson</h3>
                      <p className="text-sm text-muted-foreground">Cardiologist</p>
                    </div>
                  </div>
                  <Badge variant="secondary" className="bg-secondary/20 text-secondary">
                    <div className="w-2 h-2 bg-secondary rounded-full mr-2" />
                    Available
                  </Badge>
                </div>

                {/* Video Call Interface */}
                <div className="aspect-video bg-gradient-to-br from-primary/10 to-secondary/10 rounded-lg flex items-center justify-center relative overflow-hidden">
                  <div className="absolute inset-0 bg-gradient-to-br from-primary/20 to-secondary/20" />
                  <div className="relative z-10 text-center space-y-2">
                    <Video className="w-12 h-12 text-primary mx-auto" />
                    <p className="text-sm font-medium">HD Video Consultation</p>
                  </div>

                  {/* Floating Elements */}
                  <div className="absolute top-4 left-4 bg-card/90 backdrop-blur-sm rounded-lg px-3 py-1 text-xs">
                    <Clock className="w-3 h-3 inline mr-1" />
                    15:30 remaining
                  </div>

                  <div className="absolute bottom-4 right-4 bg-card/90 backdrop-blur-sm rounded-lg px-3 py-1 text-xs">
                    <Users className="w-3 h-3 inline mr-1" />2 participants
                  </div>
                </div>

                {/* Quick Actions */}
                <div className="grid grid-cols-3 gap-2">
                  <Button variant="outline" size="sm" className="text-xs bg-transparent">
                    Share Screen
                  </Button>
                  <Button variant="outline" size="sm" className="text-xs bg-transparent">
                    Chat
                  </Button>
                  <Button variant="outline" size="sm" className="text-xs bg-transparent">
                    Records
                  </Button>
                </div>
              </div>
            </Card>

            {/* Floating Cards */}
            <Card className="absolute -top-4 -left-4 p-3 shadow-lg bg-card/95 backdrop-blur-sm border-0 w-48">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 bg-secondary/20 rounded-full flex items-center justify-center">
                  <Shield className="w-4 h-4 text-secondary" />
                </div>
                <div>
                  <p className="text-xs font-medium">End-to-End Encrypted</p>
                  <p className="text-xs text-muted-foreground">HIPAA Compliant</p>
                </div>
              </div>
            </Card>

            <Card className="absolute -bottom-4 -right-4 p-3 shadow-lg bg-card/95 backdrop-blur-sm border-0 w-44">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 bg-primary/20 rounded-full flex items-center justify-center">
                  <Clock className="w-4 h-4 text-primary" />
                </div>
                <div>
                  <p className="text-xs font-medium">Instant Access</p>
                  <p className="text-xs text-muted-foreground">No waiting rooms</p>
                </div>
              </div>
            </Card>
          </div>
        </div>
      </div>
    </section>
  )
}
