import { useState, useEffect, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Send, User, Bot, Sparkles, Trophy, Star, Zap, Loader2 } from "lucide-react";

interface Message {
  id: string;
  content: string;
  sender: 'user' | 'ai';
  timestamp: Date;
}

const ChatInterface = () => {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      content: "Hello! I'm your AI Career Mentor. I'm here to help you navigate your career journey, prepare for interviews, and develop the skills you need to succeed. What would you like to work on today?",
      sender: 'ai',
      timestamp: new Date(),
    }
  ]);
  const [inputValue, setInputValue] = useState("");
  const [demoMode, setDemoMode] = useState(false);
  const [demoProgress, setDemoProgress] = useState(0);
  const [isTyping, setIsTyping] = useState(false);
  const [typingMessage, setTypingMessage] = useState("");
  const scrollAreaRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (demoMode) {
      const interval = setInterval(() => {
        setDemoProgress((prev) => {
          if (prev >= 100) {
            clearInterval(interval);
            setDemoMode(false);
            return 100;
          }
          return prev + 10;
        });
      }, 500);
      return () => clearInterval(interval);
    }
  }, [demoMode]);

  const sendMessage = () => {
    if (!inputValue.trim()) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      content: inputValue,
      sender: 'user',
      timestamp: new Date(),
    };

    setMessages(prev => [...prev, userMessage]);
    setInputValue("");

    // Simulate AI response
    setTimeout(() => {
      const aiResponse: Message = {
        id: (Date.now() + 1).toString(),
        content: getAIResponse(inputValue),
        sender: 'ai',
        timestamp: new Date(),
      };
      setMessages(prev => [...prev, aiResponse]);
    }, 1000);
  };

  const getAIResponse = (userInput: string): string => {
    const input = userInput.toLowerCase();

    if (input.includes('interview') || input.includes('prepare')) {
      return "Great! I can help you prepare for interviews. What type of role are you interviewing for? I can provide you with:\n\n• Technical questions specific to your field\n• Behavioral interview scenarios\n• Mock interview sessions\n• Tips for showcasing your experience\n\nLet me know your target role and I'll customize the preparation for you!";
    } else if (input.includes('career') || input.includes('path')) {
      return "I'd love to help you explore career paths! To provide the best guidance, could you tell me:\n\n• Your current background or field\n• What interests you most about work\n• Any specific industries you're curious about\n• Your long-term goals\n\nBased on this, I can suggest personalized career paths and the skills you'd need to develop.";
    } else if (input.includes('skill') || input.includes('learn')) {
      return "Skill development is key to career growth! I can create personalized learning roadmaps for you. What area would you like to focus on?\n\n• Technical skills (programming, data analysis, etc.)\n• Soft skills (communication, leadership)\n• Industry-specific knowledge\n• Certifications and credentials\n\nI'll recommend the best resources and create a timeline for your learning journey.";
    } else {
      return "I understand you're looking for career guidance. I can help with:\n\n• **Interview Preparation** - Mock interviews and question practice\n• **Career Path Planning** - Explore roles that match your interests\n• **Skill Development** - Personalized learning roadmaps\n• **Resume & LinkedIn Optimization** - Stand out to recruiters\n\nWhat would you like to focus on first?";
    }
  };

  const startDemo = () => {
    setDemoMode(true);
    setMessages(prev => [
      ...prev,
      {
        id: Date.now().toString(),
        content: "Starting hackathon demo mode! Watch the progress bar fill as we simulate AI responses.",
        sender: 'ai',
        timestamp: new Date(),
      }
    ]);
  };

  return (
    <Card className="h-[600px] flex flex-col bg-card border-primary/20">
      <div className="p-4 border-b border-border bg-gradient-to-r from-primary/5 to-accent/5">
        <div className="flex items-center space-x-3">
          <div className="p-2 rounded-full bg-primary/10">
            <Sparkles className="w-5 h-5 text-primary" />
          </div>
            <div>
              <h3 className="font-semibold text-card-foreground">AI Career Mentor</h3>
              <p className="text-sm text-muted-foreground">Powered by Llama 2</p>
            </div>
            <Button
              variant="outline"
              size="sm"
              className="ml-auto flex items-center space-x-1"
              onClick={startDemo}
              disabled={demoMode}
            >
              <Trophy className="w-4 h-4" />
              <span>Hackathon Demo</span>
            </Button>
          </div>
        </div>

      <ScrollArea className="flex-1 p-4">
        <div className="space-y-4">
          {messages.map((message) => (
            <div
              key={message.id}
              className={`flex ${message.sender === 'user' ? 'justify-end' : 'justify-start'}`}
            >
              <div className={`max-w-[80%] ${message.sender === 'user' ? 'order-2' : 'order-1'}`}>
                <div
                  className={`p-3 rounded-lg ${
                    message.sender === 'user'
                      ? 'bg-primary text-primary-foreground'
                      : 'bg-gradient-to-r from-muted to-muted/50 text-card-foreground border border-border/50'
                  }`}
                >
                  <p className="whitespace-pre-wrap">{message.content}</p>
                </div>
                <div className="flex items-center mt-1 text-xs text-muted-foreground">
                  {message.sender === 'user' ? (
                    <User className="w-3 h-3 mr-1" />
                  ) : (
                    <Bot className="w-3 h-3 mr-1" />
                  )}
                  {message.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                </div>
              </div>
            </div>
          ))}
          {demoMode && (
            <div className="mt-4">
              <Badge variant="secondary" className="w-full">
                <div className="flex items-center space-x-2">
                  <Zap className="w-4 h-4" />
                  <span>Demo Progress</span>
                </div>
                <Progress value={demoProgress} className="mt-2" />
              </Badge>
            </div>
          )}
        </div>
      </ScrollArea>

      <div className="p-4 border-t border-border">
        <div className="flex space-x-2">
          <Input
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            placeholder="Ask me about your career goals, interview prep, or skill development..."
            onKeyPress={(e) => e.key === 'Enter' && sendMessage()}
            className="flex-1"
            disabled={demoMode}
          />
          <Button onClick={sendMessage} size="icon" disabled={demoMode}>
            <Send className="w-4 h-4" />
          </Button>
        </div>
      </div>
    </Card>
  );
};

export default ChatInterface;