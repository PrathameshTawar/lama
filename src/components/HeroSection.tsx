import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Brain, Sparkles, Target, Users } from "lucide-react";
import heroImage from "@/assets/hero-career-mentor.jpg";

const HeroSection = () => {
  return (
    <div className="relative min-h-screen flex items-center justify-center overflow-hidden">
      {/* Background with hero image and overlay */}
      <div className="absolute inset-0 z-0">
        <img 
          src={heroImage} 
          alt="AI Career Mentor - Professional Development" 
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-secondary/95 via-secondary/85 to-transparent"></div>
      </div>

      {/* Content */}
      <div className="relative z-10 max-w-7xl mx-auto px-6 py-20 grid lg:grid-cols-2 gap-12 items-center">
        <div className="space-y-8">
          <div className="space-y-6">
            <div className="inline-flex items-center px-4 py-2 rounded-full bg-primary/10 border border-primary/20">
              <Sparkles className="w-4 h-4 text-primary mr-2" />
              <span className="text-sm font-medium text-primary">🏆 Hackathon Project - Powered by Llama 4 AI</span>
            </div>
            
            <h1 className="text-5xl lg:text-6xl font-bold text-primary-foreground leading-tight">
              Your Personal
              <span className="bg-gradient-to-r from-primary via-accent to-primary bg-clip-text text-transparent block">
                Career Mentor
              </span>
            </h1>
            
            <p className="text-xl text-primary-foreground/90 leading-relaxed">
              Get personalized career guidance, ace your interviews, and accelerate your professional growth with AI-powered insights tailored to your unique background and goals.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row gap-4">
            <Button size="lg" className="text-lg px-8 py-6">
              Start Your Journey
            </Button>
            <Button variant="outline" size="lg" className="text-lg px-8 py-6 border-primary-foreground/20 text-primary-foreground hover:bg-primary-foreground/10">
              Try Mock Interview
            </Button>
          </div>

          {/* Stats */}
          <div className="flex flex-wrap gap-8 pt-8 border-t border-primary-foreground/20">
            <div className="text-center">
              <div className="text-3xl font-bold text-primary">10K+</div>
              <div className="text-sm text-primary-foreground/70">Professionals Guided</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-primary">500+</div>
              <div className="text-sm text-primary-foreground/70">Career Paths</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-primary">95%</div>
              <div className="text-sm text-primary-foreground/70">Success Rate</div>
            </div>
          </div>
        </div>

        {/* Feature Cards */}
        <div className="grid gap-6">
          <Card className="p-6 bg-card/95 backdrop-blur-sm border-primary/20 hover:shadow-[var(--card-hover)] transition-all duration-300">
            <div className="flex items-start space-x-4">
              <div className="p-3 rounded-lg bg-primary/10">
                <Brain className="w-6 h-6 text-primary" />
              </div>
              <div>
                <h3 className="font-semibold text-lg text-card-foreground">AI-Powered Guidance</h3>
                <p className="text-muted-foreground mt-1">Personalized career advice based on your skills, experience, and industry trends.</p>
              </div>
            </div>
          </Card>

          <Card className="p-6 bg-card/95 backdrop-blur-sm border-primary/20 hover:shadow-[var(--card-hover)] transition-all duration-300">
            <div className="flex items-start space-x-4">
              <div className="p-3 rounded-lg bg-accent/10">
                <Target className="w-6 h-6 text-accent" />
              </div>
              <div>
                <h3 className="font-semibold text-lg text-card-foreground">Mock Interviews</h3>
                <p className="text-muted-foreground mt-1">Practice with domain-specific questions and get real-time feedback.</p>
              </div>
            </div>
          </Card>

          <Card className="p-6 bg-card/95 backdrop-blur-sm border-primary/20 hover:shadow-[var(--card-hover)] transition-all duration-300">
            <div className="flex items-start space-x-4">
              <div className="p-3 rounded-lg bg-success/10">
                <Users className="w-6 h-6 text-success" />
              </div>
              <div>
                <h3 className="font-semibold text-lg text-card-foreground">Learning Roadmaps</h3>
                <p className="text-muted-foreground mt-1">Customized skill development paths for your career goals.</p>
              </div>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default HeroSection;