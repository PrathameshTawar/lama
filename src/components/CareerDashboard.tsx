import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import Leaderboard from "@/components/Leaderboard";
import {
  TrendingUp,
  Target,
  BookOpen,
  Award,
  Briefcase,
  Users,
  ArrowRight,
  Star,
  Clock,
  BarChart3,
  PieChart,
  Activity,
  Zap
} from "lucide-react";

const CareerDashboard = () => {
  const careerPaths = [
    {
      id: 1,
      title: "Software Engineer",
      match: 92,
      growth: "22% growth expected",
      salary: "$95K - $165K",
      skills: ["JavaScript", "React", "Node.js", "Databases"],
      description: "Build and maintain web applications and software systems"
    },
    {
      id: 2,
      title: "Data Scientist",
      match: 87,
      growth: "35% growth expected", 
      salary: "$110K - $180K",
      skills: ["Python", "Machine Learning", "Statistics", "SQL"],
      description: "Analyze complex data to drive business insights and decisions"
    },
    {
      id: 3,
      title: "Product Manager",
      match: 78,
      growth: "19% growth expected",
      salary: "$105K - $175K", 
      skills: ["Strategy", "Analytics", "Communication", "Leadership"],
      description: "Guide product development and strategy from conception to launch"
    }
  ];

  const learningPath = [
    {
      skill: "JavaScript Fundamentals",
      progress: 85,
      timeLeft: "2 weeks",
      status: "in-progress"
    },
    {
      skill: "React Development", 
      progress: 60,
      timeLeft: "1 month",
      status: "in-progress"
    },
    {
      skill: "System Design",
      progress: 0,
      timeLeft: "6 weeks",
      status: "upcoming"
    },
    {
      skill: "Advanced Algorithms",
      progress: 0,
      timeLeft: "8 weeks", 
      status: "upcoming"
    }
  ];

  const upcomingInterviews = [
    {
      company: "TechCorp",
      role: "Senior Frontend Developer",
      date: "Tomorrow, 2:00 PM",
      type: "Technical Round"
    },
    {
      company: "DataFlow Inc",
      role: "Full Stack Engineer",
      date: "Friday, 10:00 AM",
      type: "Behavioral Interview"
    }
  ];

  const skillProgressData = [
    { skill: "JavaScript", progress: 85, color: "bg-blue-500" },
    { skill: "React", progress: 78, color: "bg-cyan-500" },
    { skill: "Python", progress: 65, color: "bg-green-500" },
    { skill: "Data Analysis", progress: 45, color: "bg-purple-500" },
    { skill: "Leadership", progress: 30, color: "bg-orange-500" }
  ];

  const weeklyActivity = [
    { day: "Mon", interviews: 2, chats: 5 },
    { day: "Tue", interviews: 1, chats: 8 },
    { day: "Wed", interviews: 3, chats: 6 },
    { day: "Thu", interviews: 2, chats: 7 },
    { day: "Fri", interviews: 4, chats: 9 },
    { day: "Sat", interviews: 1, chats: 3 },
    { day: "Sun", interviews: 0, chats: 2 }
  ];

  return (
    <div className="space-y-6">
      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="p-4 border-primary/20">
          <div className="flex items-center space-x-3">
            <div className="p-2 rounded-lg bg-primary/10">
              <Target className="w-5 h-5 text-primary" />
            </div>
            <div>
              <div className="text-2xl font-bold text-card-foreground">12</div>
              <div className="text-sm text-muted-foreground">Career Matches</div>
            </div>
          </div>
        </Card>

        <Card className="p-4 border-accent/20">
          <div className="flex items-center space-x-3">
            <div className="p-2 rounded-lg bg-accent/10">
              <BookOpen className="w-5 h-5 text-accent" />
            </div>
            <div>
              <div className="text-2xl font-bold text-card-foreground">4</div>
              <div className="text-sm text-muted-foreground">Skills Learning</div>
            </div>
          </div>
        </Card>

        <Card className="p-4 border-success/20">
          <div className="flex items-center space-x-3">
            <div className="p-2 rounded-lg bg-success/10">
              <Award className="w-5 h-5 text-success" />
            </div>
            <div>
              <div className="text-2xl font-bold text-card-foreground">8</div>
              <div className="text-sm text-muted-foreground">Certifications</div>
            </div>
          </div>
        </Card>

        <Card className="p-4 border-muted">
          <div className="flex items-center space-x-3">
            <div className="p-2 rounded-lg bg-muted/50">
              <Briefcase className="w-5 h-5 text-muted-foreground" />
            </div>
            <div>
              <div className="text-2xl font-bold text-card-foreground">2</div>
              <div className="text-sm text-muted-foreground">Interviews Soon</div>
            </div>
          </div>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Career Path Recommendations */}
        <Card className="p-6 border-primary/20">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-semibold text-card-foreground">Recommended Career Paths</h2>
            <Button variant="outline" size="sm">View All</Button>
          </div>

          <div className="space-y-4">
            {careerPaths.map((path) => (
              <div key={path.id} className="p-4 rounded-lg border border-border hover:border-primary/30 transition-colors">
                <div className="flex items-start justify-between mb-2">
                  <div>
                    <h3 className="font-semibold text-card-foreground">{path.title}</h3>
                    <p className="text-sm text-muted-foreground">{path.description}</p>
                  </div>
                  <Badge className="bg-primary/10 text-primary border-primary/20">
                    {path.match}% match
                  </Badge>
                </div>

                <div className="flex items-center space-x-4 text-sm text-muted-foreground mb-3">
                  <div className="flex items-center space-x-1">
                    <TrendingUp className="w-4 h-4 text-success" />
                    <span>{path.growth}</span>
                  </div>
                  <div>{path.salary}</div>
                </div>

                <div className="flex flex-wrap gap-1 mb-3">
                  {path.skills.map((skill, index) => (
                    <Badge key={index} variant="secondary" className="text-xs">
                      {skill}
                    </Badge>
                  ))}
                </div>

                <Button variant="outline" size="sm" className="w-full">
                  Explore Path <ArrowRight className="w-3 h-3 ml-1" />
                </Button>
              </div>
            ))}
          </div>
        </Card>

        {/* Learning Progress */}
        <Card className="p-6 border-accent/20">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-semibold text-card-foreground">Learning Progress</h2>
            <Button variant="outline" size="sm">Add Skills</Button>
          </div>

          <div className="space-y-4">
            {learningPath.map((item, index) => (
              <div key={index} className="space-y-2">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <span className="font-medium text-card-foreground">{item.skill}</span>
                    {item.status === 'in-progress' && (
                      <Badge variant="secondary" className="text-xs">
                        <Clock className="w-3 h-3 mr-1" />
                        {item.timeLeft}
                      </Badge>
                    )}
                  </div>
                  <span className="text-sm text-muted-foreground">{item.progress}%</span>
                </div>
                <Progress 
                  value={item.progress} 
                  className={`h-2 ${item.status === 'upcoming' ? 'opacity-50' : ''}`}
                />
              </div>
            ))}
          </div>

          <Button className="w-full mt-4">
            Continue Learning <ArrowRight className="w-4 h-4 ml-2" />
          </Button>
        </Card>
      </div>

      {/* Advanced Analytics */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Skill Progress Chart */}
        <Card className="p-6 border-primary/20">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-semibold text-card-foreground flex items-center space-x-2">
              <BarChart3 className="w-5 h-5" />
              <span>Skill Mastery Progress</span>
            </h2>
            <Badge variant="secondary" className="flex items-center space-x-1">
              <Zap className="w-3 h-3" />
              <span>Real-time</span>
            </Badge>
          </div>

          <div className="space-y-4">
            {skillProgressData.map((skill, index) => (
              <div key={index} className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="font-medium text-card-foreground">{skill.skill}</span>
                  <span className="text-sm text-muted-foreground">{skill.progress}%</span>
                </div>
                <div className="w-full bg-muted rounded-full h-3">
                  <div
                    className={`h-3 rounded-full ${skill.color} transition-all duration-1000 ease-out`}
                    style={{ width: `${skill.progress}%` }}
                  ></div>
                </div>
              </div>
            ))}
          </div>
        </Card>

        {/* Weekly Activity */}
        <Card className="p-6 border-accent/20">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-semibold text-card-foreground flex items-center space-x-2">
              <Activity className="w-5 h-5" />
              <span>Weekly Activity</span>
            </h2>
            <Badge variant="secondary">This Week</Badge>
          </div>

          <div className="space-y-3">
            {weeklyActivity.map((day, index) => (
              <div key={index} className="flex items-center justify-between">
                <span className="font-medium text-card-foreground w-12">{day.day}</span>
                <div className="flex-1 mx-4">
                  <div className="flex space-x-1">
                    <div className="flex-1 bg-blue-100 dark:bg-blue-900/20 rounded h-2">
                      <div
                        className="bg-blue-500 h-2 rounded transition-all duration-1000"
                        style={{ width: `${(day.interviews / 4) * 100}%` }}
                      ></div>
                    </div>
                    <div className="flex-1 bg-green-100 dark:bg-green-900/20 rounded h-2">
                      <div
                        className="bg-green-500 h-2 rounded transition-all duration-1000"
                        style={{ width: `${(day.chats / 10) * 100}%` }}
                      ></div>
                    </div>
                  </div>
                </div>
                <div className="text-xs text-muted-foreground w-16 text-right">
                  {day.interviews}I {day.chats}C
                </div>
              </div>
            ))}
            <div className="flex justify-center space-x-4 mt-4 text-xs text-muted-foreground">
              <div className="flex items-center space-x-1">
                <div className="w-3 h-3 bg-blue-500 rounded"></div>
                <span>Interviews</span>
              </div>
              <div className="flex items-center space-x-1">
                <div className="w-3 h-3 bg-green-500 rounded"></div>
                <span>AI Chats</span>
              </div>
            </div>
          </div>
        </Card>
      </div>

      {/* Upcoming Interviews & Leaderboard */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card className="p-6 border-success/20">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-semibold text-card-foreground">Upcoming Interviews</h2>
            <Button variant="outline" size="sm">Schedule Practice</Button>
          </div>

          <div className="space-y-4">
            {upcomingInterviews.map((interview, index) => (
              <div key={index} className="p-4 rounded-lg border border-border bg-card/50">
                <div className="flex items-start justify-between mb-2">
                  <div>
                    <h3 className="font-semibold text-card-foreground">{interview.company}</h3>
                    <p className="text-sm text-muted-foreground">{interview.role}</p>
                  </div>
                  <Badge variant="outline" className="text-xs">
                    {interview.type}
                  </Badge>
                </div>

                <div className="flex items-center space-x-1 text-sm text-muted-foreground mb-3">
                  <Clock className="w-4 h-4" />
                  <span>{interview.date}</span>
                </div>

                <Button variant="outline" size="sm" className="w-full">
                  Prepare Now <Star className="w-3 h-3 ml-1" />
                </Button>
              </div>
            ))}
          </div>
        </Card>

        <Leaderboard />
      </div>
    </div>
  );
};

export default CareerDashboard;