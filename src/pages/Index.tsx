import Navigation from "@/components/Navigation";
import HeroSection from "@/components/HeroSection";
import ChatInterface from "@/components/ChatInterface";
import MockInterview from "@/components/MockInterview";
import CareerDashboard from "@/components/CareerDashboard";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { BarChart3, MessageSquare, Target } from "lucide-react";

const Index = () => {
  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      <HeroSection />

      <div id="features" className="max-w-7xl mx-auto px-6 py-16">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-foreground mb-4">Your AI-Powered Career Journey</h2>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            Get personalized guidance, practice interviews, and track your professional development all in one place.
          </p>
        </div>

        <Tabs defaultValue="chat" className="w-full">
          <TabsList className="grid w-full grid-cols-3 max-w-md mx-auto mb-8">
            <TabsTrigger value="chat" className="flex items-center space-x-2">
              <MessageSquare className="w-4 h-4" />
              <span>Career Chat</span>
            </TabsTrigger>
            <TabsTrigger value="interview" className="flex items-center space-x-2">
              <Target className="w-4 h-4" />
              <span>Mock Interview</span>
            </TabsTrigger>
            <TabsTrigger value="dashboard" className="flex items-center space-x-2">
              <BarChart3 className="w-4 h-4" />
              <span>Dashboard</span>
            </TabsTrigger>
          </TabsList>

          <TabsContent value="chat">
            <div className="max-w-4xl mx-auto">
              <ChatInterface />
            </div>
          </TabsContent>
          <TabsContent value="interview">
            <div className="max-w-4xl mx-auto">
              <MockInterview />
            </div>
          </TabsContent>
          <TabsContent value="dashboard">
            <CareerDashboard />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default Index;
