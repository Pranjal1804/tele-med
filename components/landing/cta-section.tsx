import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { ArrowRight, CheckCircle, Stethoscope } from "lucide-react"
import Link from "next/link"

const benefits = [
  "No setup fees or hidden costs",
  "24/7 customer support",
  "HIPAA compliant infrastructure",
  "Integration with existing systems",
  "Mobile and desktop apps",
]

export function CTASection() {
  return (
    <section className="py-24 bg-gradient-to-br from-primary/5 via-background to-secondary/5">
      <div className="container mx-auto px-4">
        <Card className="max-w-4xl mx-auto p-8 md:p-12 shadow-2xl border-0 bg-card/95 backdrop-blur-sm">
          <div className="text-center space-y-8">
            <div className="space-y-4">
              <Badge variant="secondary" className="w-fit mx-auto">
                <Stethoscope className="w-3 h-3 mr-1" />
                Ready to Transform Healthcare?
              </Badge>

              <h2 className="text-3xl md:text-5xl font-bold text-balance">
                Start Your <span className="text-primary">Telemedicine Journey</span> Today
              </h2>

              <p className="text-xl text-muted-foreground text-pretty max-w-2xl mx-auto">
                Join thousands of healthcare professionals and patients who trust MediConnect for secure, efficient, and
                accessible healthcare delivery.
              </p>
            </div>

            {/* Benefits List */}
            <div className="grid md:grid-cols-2 gap-4 max-w-2xl mx-auto text-left">
              {benefits.map((benefit, index) => (
                <div key={index} className="flex items-center gap-3">
                  <CheckCircle className="w-5 h-5 text-secondary flex-shrink-0" />
                  <span className="text-sm">{benefit}</span>
                </div>
              ))}
            </div>

            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button size="lg" className="text-lg px-8" asChild>
                <Link href="/signup">
                  Start Free Trial
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Link>
              </Button>

              <Button size="lg" variant="outline" className="text-lg px-8 bg-transparent" asChild>
                <Link href="/login">Sign In</Link>
              </Button>
            </div>

            {/* Trust Indicators */}
            <div className="pt-8 border-t border-border/50">
              <p className="text-sm text-muted-foreground mb-4">Trusted by leading healthcare organizations</p>
              <div className="flex flex-wrap justify-center items-center gap-8 opacity-50">
                <div className="text-sm font-medium">Mayo Clinic Network</div>
                <div className="text-sm font-medium">Johns Hopkins</div>
                <div className="text-sm font-medium">Cleveland Clinic</div>
                <div className="text-sm font-medium">Kaiser Permanente</div>
              </div>
            </div>
          </div>
        </Card>
      </div>
    </section>
  )
}
