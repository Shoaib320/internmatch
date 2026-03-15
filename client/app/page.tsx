"use client";

import Link from "next/link";
import { 
  ArrowRight, 
  Brain, 
  FileText, 
  Building2, 
  Users, 
  Star,
  CheckCircle2,
  TrendingUp,
  Shield
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Logo } from "@/components/logo";
import { BackgroundDecoration } from "@/components/background-decoration";
import { FloatingIllustration } from "@/components/floating-illustration";
import { Hero3D } from "@/components/hero-3d";

const features = [
  {
    icon: Brain,
    title: "ML-Powered Matching",
    description: "Our algorithm analyzes your skills, CGPA, and preferences to recommend the perfect internships.",
  },
  {
    icon: FileText,
    title: "Smart Resume Builder",
    description: "Create ATS-friendly resumes tailored to specific internship opportunities.",
  },
  {
    icon: TrendingUp,
    title: "Prediction Analytics",
    description: "Get insights on your acceptance probability and areas for improvement.",
  },
  {
    icon: Shield,
    title: "Verified Companies",
    description: "All companies are thoroughly vetted to ensure legitimate opportunities.",
  },
];

const stats = [
  { value: "10K+", label: "Students Placed" },
  { value: "500+", label: "Partner Companies" },
  { value: "95%", label: "Match Accuracy" },
  { value: "4.9", label: "User Rating" },
];

const testimonials = [
  {
    name: "Sarah Chen",
    role: "Software Engineer @ Google",
    content: "InternMatch helped me land my dream internship. The ML recommendations were spot-on!",
    avatar: "SC",
  },
  {
    name: "Michael Park",
    role: "Data Scientist @ Meta",
    content: "The prediction feature gave me confidence in my applications. Highly recommend!",
    avatar: "MP",
  },
  {
    name: "Emily Rodriguez",
    role: "Product Manager @ Stripe",
    content: "Best platform for finding quality internships. The resume builder saved me hours.",
    avatar: "ER",
  },
];

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-background relative overflow-hidden">
      <BackgroundDecoration />
      
      {/* Navigation */}
      <nav className="relative z-10 border-b border-border/50 bg-card/50 backdrop-blur-xl">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <Logo />
            <div className="hidden md:flex items-center gap-8">
              <Link href="#features" className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors">
                Features
              </Link>
              <Link href="#testimonials" className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors">
                Testimonials
              </Link>
              <Link href="#companies" className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors">
                For Companies
              </Link>
            </div>
            <div className="flex items-center gap-3">
              <Button variant="ghost" asChild>
                <Link href="/login">Sign In</Link>
              </Button>
              <Button asChild className="bg-primary hover:bg-primary/90">
                <Link href="/signup">Get Started</Link>
              </Button>
            </div>
          </div>
        </div>
      </nav>

      <Hero3D />

      {/* Stats Section */}
      <section className="relative z-10 py-16 border-y border-border/50 bg-card/30 backdrop-blur-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {stats.map((stat, index) => (
              <div key={index} className="text-center">
                <div className="text-3xl sm:text-4xl font-bold text-foreground">{stat.value}</div>
                <div className="text-sm text-muted-foreground mt-1">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="relative z-10 py-20 lg:py-32">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-16">
            <h2 className="text-3xl sm:text-4xl font-bold text-foreground text-balance">
              Everything You Need to Land Your Dream Internship
            </h2>
            <p className="mt-4 text-lg text-muted-foreground text-pretty">
              Our platform combines cutting-edge AI with a user-friendly experience to maximize your chances of success.
            </p>
          </div>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {features.map((feature, index) => (
              <Card key={index} className="border-border/50 bg-card/80 backdrop-blur-sm hover:shadow-lg transition-all duration-300 hover:-translate-y-1">
                <CardContent className="pt-6">
                  <div className="h-12 w-12 rounded-xl bg-primary/10 flex items-center justify-center mb-4">
                    <feature.icon className="h-6 w-6 text-primary" />
                  </div>
                  <h3 className="font-semibold text-foreground mb-2">{feature.title}</h3>
                  <p className="text-sm text-muted-foreground">{feature.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="relative z-10 py-20 lg:py-32 bg-muted/30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-16">
            <h2 className="text-3xl sm:text-4xl font-bold text-foreground text-balance">
              How InternMatch Works
            </h2>
            <p className="mt-4 text-lg text-muted-foreground text-pretty">
              Get matched with your ideal internship in three simple steps.
            </p>
          </div>
          
          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                step: "01",
                title: "Create Your Profile",
                description: "Enter your skills, CGPA, experience, and career preferences.",
              },
              {
                step: "02",
                title: "Get Matched",
                description: "Our ML algorithm analyzes your profile against thousands of opportunities.",
              },
              {
                step: "03",
                title: "Apply with Confidence",
                description: "Apply to recommended internships with tailored resumes and prediction insights.",
              },
            ].map((item, index) => (
              <div key={index} className="relative">
                <div className="text-6xl font-bold text-primary/10 absolute -top-4 left-0">{item.step}</div>
                <div className="pt-8 pl-2">
                  <h3 className="text-xl font-semibold text-foreground mb-2">{item.title}</h3>
                  <p className="text-muted-foreground">{item.description}</p>
                </div>
                {index < 2 && (
                  <div className="hidden md:block absolute top-12 right-0 translate-x-1/2">
                    <ArrowRight className="h-6 w-6 text-border" />
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section id="testimonials" className="relative z-10 py-20 lg:py-32">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-16">
            <h2 className="text-3xl sm:text-4xl font-bold text-foreground text-balance">
              Success Stories from Our Community
            </h2>
            <p className="mt-4 text-lg text-muted-foreground text-pretty">
              Hear from students who found their dream internships through InternMatch.
            </p>
          </div>
          
          <div className="grid md:grid-cols-3 gap-6">
            {testimonials.map((testimonial, index) => (
              <Card key={index} className="border-border/50 bg-card/80 backdrop-blur-sm">
                <CardContent className="pt-6">
                  <div className="flex items-center gap-1 mb-4">
                    {[...Array(5)].map((_, i) => (
                      <Star key={i} className="h-4 w-4 fill-orange text-orange" />
                    ))}
                  </div>
                  <p className="text-foreground mb-6">&quot;{testimonial.content}&quot;</p>
                  <div className="flex items-center gap-3">
                    <div className="h-10 w-10 rounded-full bg-gradient-to-br from-primary to-secondary flex items-center justify-center text-primary-foreground text-sm font-medium">
                      {testimonial.avatar}
                    </div>
                    <div>
                      <div className="font-medium text-foreground">{testimonial.name}</div>
                      <div className="text-sm text-muted-foreground">{testimonial.role}</div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* For Companies Section */}
      <section id="companies" className="relative z-10 py-20 lg:py-32 bg-navy text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div className="space-y-6">
              <h2 className="text-3xl sm:text-4xl font-bold text-balance">
                Hire Top Talent with InternMatch
              </h2>
              <p className="text-lg text-white/70 text-pretty">
                Connect with pre-qualified students who match your requirements. Our ML-powered platform helps you find the best candidates faster.
              </p>
              <ul className="space-y-4">
                {[
                  "Access to verified student profiles",
                  "ML-powered candidate matching",
                  "Streamlined application management",
                  "Analytics and insights dashboard",
                ].map((item, index) => (
                  <li key={index} className="flex items-center gap-3">
                    <CheckCircle2 className="h-5 w-5 text-teal flex-shrink-0" />
                    <span className="text-white/80">{item}</span>
                  </li>
                ))}
              </ul>
              <Button size="lg" className="bg-white text-navy hover:bg-white/90 gap-2">
                <Link href="/signup?role=company" className="flex items-center gap-2">
                  Start Hiring
                  <ArrowRight className="h-4 w-4" />
                </Link>
              </Button>
            </div>
            <div className="hidden lg:block">
              <FloatingIllustration variant="hiring" className="w-full max-w-lg mx-auto" />
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="relative z-10 py-20 lg:py-32">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl sm:text-4xl font-bold text-foreground text-balance">
            Ready to Launch Your Career?
          </h2>
          <p className="mt-4 text-lg text-muted-foreground text-pretty max-w-2xl mx-auto">
            Join thousands of students who have found their dream internships through InternMatch. Your perfect opportunity is waiting.
          </p>
          <div className="mt-8 flex flex-col sm:flex-row gap-4 justify-center">
            <Button size="lg" asChild className="bg-primary hover:bg-primary/90 gap-2">
              <Link href="/signup">
                Create Free Account
                <ArrowRight className="h-4 w-4" />
              </Link>
            </Button>
            <Button size="lg" variant="outline" asChild>
              <Link href="/login">
                <Users className="h-4 w-4 mr-2" />
                Sign In
              </Link>
            </Button>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="relative z-10 border-t border-border/50 bg-card/50 backdrop-blur-sm py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            <div className="col-span-2 md:col-span-1">
              <Logo />
              <p className="mt-4 text-sm text-muted-foreground">
                AI-powered internship matching platform helping students launch their careers.
              </p>
            </div>
            <div>
              <h4 className="font-semibold text-foreground mb-4">For Students</h4>
              <ul className="space-y-2">
                <li><Link href="/signup" className="text-sm text-muted-foreground hover:text-foreground transition-colors">Sign Up</Link></li>
                <li><Link href="/login" className="text-sm text-muted-foreground hover:text-foreground transition-colors">Login</Link></li>
                <li><Link href="#" className="text-sm text-muted-foreground hover:text-foreground transition-colors">Browse Internships</Link></li>
                <li><Link href="#" className="text-sm text-muted-foreground hover:text-foreground transition-colors">Resume Builder</Link></li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold text-foreground mb-4">For Companies</h4>
              <ul className="space-y-2">
                <li><Link href="/signup?role=company" className="text-sm text-muted-foreground hover:text-foreground transition-colors">Post Internships</Link></li>
                <li><Link href="#" className="text-sm text-muted-foreground hover:text-foreground transition-colors">Pricing</Link></li>
                <li><Link href="#" className="text-sm text-muted-foreground hover:text-foreground transition-colors">Employer Dashboard</Link></li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold text-foreground mb-4">Company</h4>
              <ul className="space-y-2">
                <li><Link href="#" className="text-sm text-muted-foreground hover:text-foreground transition-colors">About Us</Link></li>
                <li><Link href="#" className="text-sm text-muted-foreground hover:text-foreground transition-colors">Contact</Link></li>
                <li><Link href="#" className="text-sm text-muted-foreground hover:text-foreground transition-colors">Privacy Policy</Link></li>
                <li><Link href="#" className="text-sm text-muted-foreground hover:text-foreground transition-colors">Terms of Service</Link></li>
              </ul>
            </div>
          </div>
          <div className="mt-12 pt-8 border-t border-border/50 text-center text-sm text-muted-foreground">
            <p>&copy; {new Date().getFullYear()} InternMatch. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
